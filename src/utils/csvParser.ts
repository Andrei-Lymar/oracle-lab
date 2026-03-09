// ============================================================================
// CSV Parser for Horoscope Data
// ============================================================================

import type { HoroscopeEntry, WeeklyHoroscope } from '@/types/horoscope';
import { zodiacSigns } from '@/types/horoscope';

export interface ParsedCSVRow {
  sign: string;
  horoscope: string;
}

/**
 * Parse CSV content into horoscope entries
 * Expected format: sign,horoscope (with possible multiline horoscope)
 * Supports both comma and semicolon separators
 */
export function parseHoroscopeCSV(csvContent: string): ParsedCSVRow[] {
  const rows: ParsedCSVRow[] = [];
  const lines = csvContent.split('\n').filter((line) => line.trim());
  
  // Detect separator (comma or semicolon)
  const firstLine = lines[0] || '';
  const separator = firstLine.includes(';') ? ';' : ',';
  
  // Skip header if present
  let startIndex = 0;
  const firstLineLower = firstLine.toLowerCase().trim();
  if (firstLineLower.includes('знак') || firstLineLower.includes('sign') || firstLineLower.includes('гороскоп')) {
    startIndex = 1;
  }
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle quoted values and multiline
    const parts = parseCSVLine(line, separator);
    
    if (parts.length >= 2) {
      const sign = parts[0].trim();
      const horoscope = parts[1].trim();
      
      if (sign && horoscope) {
        rows.push({ sign, horoscope });
      }
    }
  }
  
  return rows;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string, separator: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  parts.push(current.trim());
  return parts;
}

/**
 * Match sign name to zodiac sign ID
 */
export function matchSignToZodiac(signName: string): string | null {
  const normalized = signName.toLowerCase().trim();
  
  for (const sign of zodiacSigns) {
    const names = [
      sign.name.toLowerCase(),
      sign.nameEn.toLowerCase(),
      sign.id.toLowerCase(),
    ];
    
    if (names.some((n) => normalized.includes(n))) {
      return sign.id;
    }
  }
  
  return null;
}

/**
 * Convert parsed CSV rows to weekly horoscope structure
 */
export function createWeeklyHoroscope(
  rows: ParsedCSVRow[],
  weekLabel: string,
  dateFrom: string,
  dateTo: string
): WeeklyHoroscope {
  const entries: HoroscopeEntry[] = [];
  
  for (const row of rows) {
    const signId = matchSignToZodiac(row.sign);
    if (signId) {
      const sign = zodiacSigns.find((s) => s.id === signId);
      if (sign) {
        entries.push({
          signId,
          signName: sign.name,
          scienceNews: '', // Will be extracted from horoscope if formatted with "Наука недели:"
          horoscopeText: row.horoscope,
        });
      }
    }
  }
  
  // Generate week ID from dates
  const weekId = `week-${dateFrom.replace(/\./g, '-')}`;
  
  return {
    weekId,
    weekLabel,
    dateFrom,
    dateTo,
    entries,
  };
}

/**
 * Extract science news from horoscope text if formatted with "Наука недели:"
 */
export function extractScienceNews(horoscopeText: string): { scienceNews: string; horoscope: string } {
  const scienceMatch = horoscopeText.match(/Наука недели[:\s\n]+(.+?)(?:\n\s*Гороскоп[:\s\n]|$)/is);
  
  if (scienceMatch) {
    const scienceNews = scienceMatch[1].trim();
    const horoscope = horoscopeText.replace(scienceMatch[0], '').trim();
    return { scienceNews, horoscope };
  }
  
  return { scienceNews: '', horoscope: horoscopeText };
}

/**
 * Validate CSV content
 */
export function validateCSV(rows: ParsedCSVRow[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (rows.length === 0) {
    errors.push('CSV файл пуст или не содержит данных');
    return { valid: false, errors };
  }
  
  if (rows.length !== 12) {
    errors.push(`Ожидается 12 знаков зодиака, найдено ${rows.length}`);
  }
  
  const matchedSigns = new Set<string>();
  for (const row of rows) {
    const signId = matchSignToZodiac(row.sign);
    if (signId) {
      if (matchedSigns.has(signId)) {
        errors.push(`Знак "${row.sign}" повторяется в файле`);
      }
      matchedSigns.add(signId);
    } else {
      errors.push(`Не удалось распознать знак: "${row.sign}"`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
