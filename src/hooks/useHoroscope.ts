// ============================================================================
// Horoscope Data Management Hook
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type { WeeklyHoroscope, HoroscopeEntry } from '@/types/horoscope';
import { zodiacSigns } from '@/types/horoscope';
import { parseHoroscopeCSV, validateCSV, createWeeklyHoroscope } from '@/utils/csvParser';

const STORAGE_KEY = 'oracle-lab-horoscopes';
const CURRENT_WEEK_KEY = 'oracle-lab-current-week';

export interface UseHoroscopeReturn {
  currentWeek: WeeklyHoroscope | null;
  archive: WeeklyHoroscope[];
  isLoading: boolean;
  uploadCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  getHoroscopeBySign: (signId: string) => HoroscopeEntry | null;
  moveCurrentToArchive: () => void;
  clearAllData: () => void;
  exportCurrentWeek: () => string;
}

export function useHoroscope(): UseHoroscopeReturn {
  const [currentWeek, setCurrentWeek] = useState<WeeklyHoroscope | null>(null);
  const [archive, setArchive] = useState<WeeklyHoroscope[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const currentData = localStorage.getItem(CURRENT_WEEK_KEY);
        const archiveData = localStorage.getItem(STORAGE_KEY);

        if (currentData) {
          setCurrentWeek(JSON.parse(currentData));
        }

        if (archiveData) {
          setArchive(JSON.parse(archiveData));
        }
      } catch (error) {
        console.error('Error loading horoscope data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save current week to localStorage
  useEffect(() => {
    if (currentWeek) {
      localStorage.setItem(CURRENT_WEEK_KEY, JSON.stringify(currentWeek));
    }
  }, [currentWeek]);

  // Save archive to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));
  }, [archive]);

  /**
   * Upload and process CSV file
   */
  const uploadCSV = useCallback(async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          if (!content || content.trim().length === 0) {
            resolve({ success: false, message: 'Файл пуст' });
            return;
          }

          const rows = parseHoroscopeCSV(content);
          const validation = validateCSV(rows);

          if (!validation.valid) {
            resolve({ 
              success: false, 
              message: `Ошибки в CSV: ${validation.errors.join(', ')}` 
            });
            return;
          }

          // Generate week dates (current week)
          const now = new Date();
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6); // Sunday

          const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
          
          const weekLabel = `Неделя ${formatDate(weekStart)} — ${formatDate(weekEnd)}`;
          const dateFrom = formatDate(weekStart);
          const dateTo = formatDate(weekEnd);

          // Move current week to archive if exists
          if (currentWeek) {
            setArchive((prev) => [currentWeek, ...prev].slice(0, 52)); // Keep last 52 weeks
          }

          // Create new current week
          const newWeek = createWeeklyHoroscope(rows, weekLabel, dateFrom, dateTo);
          setCurrentWeek(newWeek);

          resolve({ 
            success: true, 
            message: `Гороскоп на "${weekLabel}" успешно загружен. Загружено ${rows.length} знаков.` 
          });
        } catch (error) {
          resolve({ 
            success: false, 
            message: `Ошибка обработки файла: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
          });
        }
      };

      reader.onerror = () => {
        resolve({ success: false, message: 'Ошибка чтения файла' });
      };

      reader.readAsText(file, 'UTF-8');
    });
  }, [currentWeek]);

  /**
   * Get horoscope entry by sign ID
   */
  const getHoroscopeBySign = useCallback((signId: string): HoroscopeEntry | null => {
    if (!currentWeek) return null;
    return currentWeek.entries.find((e) => e.signId === signId) || null;
  }, [currentWeek]);

  /**
   * Move current week to archive
   */
  const moveCurrentToArchive = useCallback(() => {
    if (currentWeek) {
      setArchive((prev) => [currentWeek, ...prev].slice(0, 52));
      setCurrentWeek(null);
    }
  }, [currentWeek]);

  /**
   * Clear all data
   */
  const clearAllData = useCallback(() => {
    setCurrentWeek(null);
    setArchive([]);
    localStorage.removeItem(CURRENT_WEEK_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Export current week as CSV
   */
  const exportCurrentWeek = useCallback((): string => {
    if (!currentWeek) return '';

    const rows = zodiacSigns.map((sign) => {
      const entry = currentWeek.entries.find((e) => e.signId === sign.id);
      if (entry) {
        return `"${sign.name}","${entry.horoscopeText.replace(/"/g, '""')}"`;
      }
      return `"${sign.name}",""`;
    });

    return `Знак,Гороскоп\n${rows.join('\n')}`;
  }, [currentWeek]);

  return {
    currentWeek,
    archive,
    isLoading,
    uploadCSV,
    getHoroscopeBySign,
    moveCurrentToArchive,
    clearAllData,
    exportCurrentWeek,
  };
}
