// ============================================================================
// Admin App - Админка для управления гороскопами
// ============================================================================

import { useState, useEffect } from 'react';
import { FlaskConical, Upload, Download, Trash2, LogOut, FileText, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { parseHoroscopeCSV, validateCSV, createWeeklyHoroscope } from './utils/csvParser';
import type { WeeklyHoroscope } from './types/horoscope';
import { zodiacSigns } from './types/horoscope';

const ADMIN_PASSWORD = 'oracle2024'; // В продакшене использовать env переменную

interface HoroscopeData {
  currentWeek: WeeklyHoroscope | null;
  archive: WeeklyHoroscope[];
  lastUpdated: string | null;
}

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [data, setData] = useState<HoroscopeData>({
    currentWeek: null,
    archive: [],
    lastUpdated: null,
  });
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isDragging, setIsDragging] = useState(false);

  // Загрузка данных при входе
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const response = await fetch('/data/horoscopes.json');
      if (response.ok) {
        const jsonData = await response.json();
        setData(jsonData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const processCSV = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus({ type: 'error', message: 'Пожалуйста, загрузите файл в формате CSV' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = parseHoroscopeCSV(content);
        const validation = validateCSV(rows);

        if (!validation.valid) {
          setUploadStatus({ type: 'error', message: `Ошибки: ${validation.errors.join(', ')}` });
          return;
        }

        // Создаем новую неделю
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
        const weekLabel = `Неделя ${formatDate(weekStart)} — ${formatDate(weekEnd)}`;

        const newWeek = createWeeklyHoroscope(rows, weekLabel, formatDate(weekStart), formatDate(weekEnd));

        // Обновляем данные
        setData((prev) => ({
          currentWeek: newWeek,
          archive: prev.currentWeek ? [prev.currentWeek, ...prev.archive].slice(0, 52) : prev.archive,
          lastUpdated: new Date().toISOString(),
        }));

        setUploadStatus({ type: 'success', message: `Гороскоп "${weekLabel}" успешно загружен!` });
      } catch (error) {
        setUploadStatus({ type: 'error', message: 'Ошибка обработки файла' });
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) processCSV(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) processCSV(files[0]);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'horoscopes.json';
    link.click();
  };

  const clearAll = () => {
    if (confirm('Вы уверены? Все данные будут удалены.')) {
      setData({ currentWeek: null, archive: [], lastUpdated: null });
      setUploadStatus({ type: 'success', message: 'Все данные очищены' });
    }
  };

  // Экран логина
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
              <FlaskConical className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Админка</h1>
            <p className="text-white/50">Лаборатория Оракулов</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {loginError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-semibold hover:opacity-90 transition-opacity"
            >
              Войти
            </button>
          </form>

          <a href="/" className="block text-center mt-6 text-white/50 hover:text-white transition-colors">
            ← На главную
          </a>
        </div>
      </div>
    );
  }

  // Админ-панель
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold">Админка</h1>
              <p className="text-xs text-white/50">Лаборатория Оракулов</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/50 text-sm mb-1">Текущая неделя</p>
            <p className="text-2xl font-bold">{data.currentWeek ? 'Активна' : 'Нет данных'}</p>
            {data.currentWeek && (
              <p className="text-sm text-white/40 mt-1">{data.currentWeek.weekLabel}</p>
            )}
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/50 text-sm mb-1">В архиве</p>
            <p className="text-2xl font-bold">{data.archive.length}</p>
            <p className="text-sm text-white/40 mt-1">недель</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/50 text-sm mb-1">Последнее обновление</p>
            <p className="text-lg font-bold">
              {data.lastUpdated 
                ? new Date(data.lastUpdated).toLocaleDateString('ru-RU') 
                : '—'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Загрузка нового гороскопа
            </h2>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`
                relative p-12 rounded-2xl border-2 border-dashed
                flex flex-col items-center justify-center
                cursor-pointer transition-all duration-300
                ${isDragging
                  ? 'border-purple-400 bg-purple-400/10'
                  : 'border-white/30 bg-white/5 hover:border-white/50'
                }
              `}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="text-center cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-lg font-semibold mb-1">Перетащите CSV файл</p>
                <p className="text-white/50">или нажмите для выбора</p>
              </label>
            </div>

            {/* Status */}
            {uploadStatus.type && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                uploadStatus.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {uploadStatus.message}
                </span>
              </div>
            )}

            {/* Current Week Preview */}
            {data.currentWeek && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-4">Текущий гороскоп</h3>
                <div className="space-y-2">
                  {data.currentWeek.entries.map((entry) => {
                    const sign = zodiacSigns.find((s) => s.id === entry.signId);
                    return (
                      <div key={entry.signId} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <span className="text-xl">{sign?.symbol}</span>
                        <span>{sign?.name}</span>
                        <span className="ml-auto text-white/40 text-sm">
                          {entry.horoscopeText.slice(0, 50)}...
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actions Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Download className="w-5 h-5" />
              Действия
            </h2>

            <div className="space-y-4">
              {/* Export */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2">Экспорт данных</h3>
                <p className="text-white/50 text-sm mb-4">
                  Скачайте JSON файл с текущими гороскопами. 
                  Замените файл /public/data/horoscopes.json и пересоберите сайт.
                </p>
                <button
                  onClick={exportJSON}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Скачать horoscopes.json
                </button>
              </div>

              {/* Clear */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold mb-2 text-red-400">Опасная зона</h3>
                <p className="text-white/50 text-sm mb-4">
                  Удаление всех данных. Это действие нельзя отменить.
                </p>
                <button
                  onClick={clearAll}
                  className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Очистить все данные
                </button>
              </div>

              {/* Instructions */}
              <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                <h3 className="font-semibold mb-2 text-blue-400">Как обновить сайт</h3>
                <ol className="text-sm text-white/70 space-y-2 list-decimal list-inside">
                  <li>Загрузите CSV файл с гороскопами</li>
                  <li>Нажмите "Скачать horoscopes.json"</li>
                  <li>Замените файл <code className="bg-white/10 px-1 rounded">public/data/horoscopes.json</code></li>
                  <li>Пересоберите и задеплойте сайт: <code className="bg-white/10 px-1 rounded">npm run build</code></li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminApp;
