import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { PortfolioData } from '../components/PortfolioAIChat';

export const parseFile = (file: File): Promise<PortfolioData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let parsedData: (string | number)[][] = [];
        let headers: string[] = [];

        if (file.name.endsWith('.xlsx')) {
          // Parse XLSX file
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (string | number)[][];
          
          if (jsonData.length > 0) {
            headers = jsonData[0].map(h => String(h));
            parsedData = jsonData.slice(1);
          }
          
          resolve({ headers, data: parsedData });
        } else if (file.name.endsWith('.csv')) {
          // Parse CSV file
          Papa.parse(file, {
            complete: (results) => {
              if (results.data.length > 0) {
                const csvData = results.data as string[][];
                headers = csvData[0];
                parsedData = csvData.slice(1).filter(row => row.some(cell => cell.trim() !== ''));
              }
              resolve({ headers, data: parsedData });
            },
            header: false,
            skipEmptyLines: true,
            error: (error) => {
              reject(new Error(`CSV parsing error: ${error.message}`));
            }
          });
          return; // Exit early for CSV since Papa.parse is async
        } else {
          reject(new Error('Unsupported file format'));
        }
      } catch (error) {
        reject(new Error(`File parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('File reading error'));
    };

    if (file.name.endsWith('.xlsx')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};