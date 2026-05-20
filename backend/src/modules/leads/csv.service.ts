import { Transform } from 'json2csv';
import type { Response } from 'express';
import type { Readable } from 'stream';

class CsvService {
  /**
   * Stream leads data from a Mongoose cursor to an Express response in CSV format.
   * This approach is highly memory-efficient as it processes records one by one.
   */
  async streamLeadsToCsv(cursor: Readable, res: Response): Promise<void> {
    const fields = [
      { label: 'Name', value: 'name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: (row: Record<string, unknown>) => row.phone || '' },
      { label: 'Company', value: (row: Record<string, unknown>) => row.company || '' },
      { label: 'Status', value: 'status' },
      { label: 'Source', value: 'source' },
      { label: 'Assigned To', value: (row: Record<string, unknown>) => (row.assignedTo as Record<string, string>)?.name || 'Unassigned' },
      { label: 'Created At', value: (row: Record<string, unknown>) => (row.createdAt instanceof Date ? row.createdAt.toISOString() : '') },
    ];

    // Using Transform for memory efficiency
    const parser = new Transform({ fields }, { objectMode: true });

    // Set appropriate headers for file download
    const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Pipe cursor -> parser -> response
    cursor.pipe(parser as NodeJS.ReadWriteStream).pipe(res);

    return new Promise((resolve, reject) => {
      cursor.on('error', (err: Error) => {
        console.error('Cursor error during CSV export:', err);
        reject(err);
      });
      parser.on('error', (err: Error) => {
        console.error('Parser error during CSV export:', err);
        reject(err);
      });
      res.on('finish', () => {
        resolve();
      });
      res.on('error', (err: Error) => {
        console.error('Response stream error during CSV export:', err);
        reject(err);
      });
    });
  }
}

export default new CsvService();
