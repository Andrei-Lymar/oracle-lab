// ============================================================================
// Horoscope Types
// ============================================================================

export interface ZodiacSign {
  id: string;
  name: string;
  nameEn: string;
  dateRange: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  image: string;
}

export interface HoroscopeEntry {
  signId: string;
  signName: string;
  scienceNews: string;
  horoscopeText: string;
}

export interface WeeklyHoroscope {
  weekId: string;
  weekLabel: string;
  dateFrom: string;
  dateTo: string;
  entries: HoroscopeEntry[];
}

export interface HoroscopeArchive {
  current: WeeklyHoroscope | null;
  archive: WeeklyHoroscope[];
}

// ============================================================================
// Zodiac Signs Data
// ============================================================================

export const zodiacSigns: ZodiacSign[] = [
  {
    id: 'aries',
    name: 'Овен',
    nameEn: 'Aries',
    dateRange: '21 марта — 19 апреля',
    symbol: '♈',
    element: 'fire',
    image: '/zodiac/aries.jpg',
  },
  {
    id: 'taurus',
    name: 'Телец',
    nameEn: 'Taurus',
    dateRange: '20 апреля — 20 мая',
    symbol: '♉',
    element: 'earth',
    image: '/zodiac/taurus.jpg',
  },
  {
    id: 'gemini',
    name: 'Близнецы',
    nameEn: 'Gemini',
    dateRange: '21 мая — 20 июня',
    symbol: '♊',
    element: 'air',
    image: '/zodiac/gemini.jpg',
  },
  {
    id: 'cancer',
    name: 'Рак',
    nameEn: 'Cancer',
    dateRange: '21 июня — 22 июля',
    symbol: '♋',
    element: 'water',
    image: '/zodiac/cancer.jpg',
  },
  {
    id: 'leo',
    name: 'Лев',
    nameEn: 'Leo',
    dateRange: '23 июля — 22 августа',
    symbol: '♌',
    element: 'fire',
    image: '/zodiac/leo.jpg',
  },
  {
    id: 'virgo',
    name: 'Дева',
    nameEn: 'Virgo',
    dateRange: '23 августа — 22 сентября',
    symbol: '♍',
    element: 'earth',
    image: '/zodiac/virgo.jpg',
  },
  {
    id: 'libra',
    name: 'Весы',
    nameEn: 'Libra',
    dateRange: '23 сентября — 22 октября',
    symbol: '♎',
    element: 'air',
    image: '/zodiac/libra.jpg',
  },
  {
    id: 'scorpio',
    name: 'Скорпион',
    nameEn: 'Scorpio',
    dateRange: '23 октября — 21 ноября',
    symbol: '♏',
    element: 'water',
    image: '/zodiac/scorpio.jpg',
  },
  {
    id: 'sagittarius',
    name: 'Стрелец',
    nameEn: 'Sagittarius',
    dateRange: '22 ноября — 21 декабря',
    symbol: '♐',
    element: 'fire',
    image: '/zodiac/sagittarius.jpg',
  },
  {
    id: 'capricorn',
    name: 'Козерог',
    nameEn: 'Capricorn',
    dateRange: '22 декабря — 19 января',
    symbol: '♑',
    element: 'earth',
    image: '/zodiac/capricorn.jpg',
  },
  {
    id: 'aquarius',
    name: 'Водолей',
    nameEn: 'Aquarius',
    dateRange: '20 января — 18 февраля',
    symbol: '♒',
    element: 'air',
    image: '/zodiac/aquarius.jpg',
  },
  {
    id: 'pisces',
    name: 'Рыбы',
    nameEn: 'Pisces',
    dateRange: '19 февраля — 20 марта',
    symbol: '♓',
    element: 'water',
    image: '/zodiac/pisces.jpg',
  },
];

export const getZodiacSignById = (id: string): ZodiacSign | undefined => {
  return zodiacSigns.find((sign) => sign.id === id);
};

export const getElementColor = (element: ZodiacSign['element']): string => {
  const colors = {
    fire: '#ff6b35',
    earth: '#4caf50',
    air: '#87ceeb',
    water: '#4a90d9',
  };
  return colors[element];
};
