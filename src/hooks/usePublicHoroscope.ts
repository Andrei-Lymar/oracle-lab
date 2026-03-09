// ============================================================================
// Public Horoscope Hook - для чтения гороскопов пользователями
// ============================================================================

import { useState, useEffect } from 'react';
import type { WeeklyHoroscope, HoroscopeEntry } from '@/types/horoscope';

interface HoroscopeData {
  currentWeek: WeeklyHoroscope | null;
  archive: WeeklyHoroscope[];
  lastUpdated: string | null;
}

export interface UsePublicHoroscopeReturn {
  currentWeek: WeeklyHoroscope | null;
  archive: WeeklyHoroscope[];
  isLoading: boolean;
  error: string | null;
  getHoroscopeBySign: (signId: string) => HoroscopeEntry | null;
  hasData: boolean;
}

export function usePublicHoroscope(): UsePublicHoroscopeReturn {
  const [data, setData] = useState<HoroscopeData>({
    currentWeek: null,
    archive: [],
    lastUpdated: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHoroscopes = async () => {
      try {
        // Пытаемся загрузить из JSON файла
        const response = await fetch('/data/horoscopes.json');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить гороскопы');
        }
        
        const jsonData: HoroscopeData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error('Error loading horoscopes:', err);
        setError('Гороскопы временно недоступны');
      } finally {
        setIsLoading(false);
      }
    };

    loadHoroscopes();
  }, []);

  const getHoroscopeBySign = (signId: string): HoroscopeEntry | null => {
    if (!data.currentWeek) return null;
    return data.currentWeek.entries.find((e) => e.signId === signId) || null;
  };

  return {
    currentWeek: data.currentWeek,
    archive: data.archive,
    isLoading,
    error,
    getHoroscopeBySign,
    hasData: !!data.currentWeek,
  };
}
