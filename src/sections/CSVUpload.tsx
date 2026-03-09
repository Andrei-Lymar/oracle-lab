// ============================================================================
// CSV Upload Section
// ============================================================================

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CSVUploadProps {
  onUpload: (file: File) => Promise<{ success: boolean; message: string }>;
  onClear: () => void;
  hasData: boolean;
  currentWeekLabel: string | null;
}

export function CSVUpload({ onUpload, onClear, hasData, currentWeekLabel }: CSVUploadProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const upload = uploadRef.current;

    if (!section || !title || !upload) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        title.querySelectorAll('.title-word'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        upload,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: upload,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        await processFile(files[0]);
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await processFile(files[0]);
      }
    },
    [onUpload]
  );

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Пожалуйста, загрузите файл в формате CSV',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const result = await onUpload(file);
      setUploadStatus({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Произошла ошибка при загрузке файла',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `Знак,Гороскоп
Овен,"Наука недели: Microsoft создает систему хранения данных на стекле.

Гороскоп: На следующей неделе тебе предстоит стать носителем вечной информации."
Телец,"Наука недели: Устрицы строят рифы с оптимальной геометрией.

Гороскоп: Телец, вселенная намекает: хватит плыть по течению, пора строить свой риф."
Близнецы,"Наука недели: ИИ-агенты нанимают людей через платформы.

Гороскоп: Близнецы, вы — главные работники этой недели."
Рак,"Наука недели: Черепные дренажи защищают мозг от патогенов.

Гороскоп: Раки, ваша главная задача — защита личных границ."
Лев,"Наука недели: Персонализированная мРНК-вакцина против рака груди.

Гороскоп: Львы, неделя потребует персонализированного подхода."
Дева,"Наука недели: Кофе связан с замедлением старения мозга.

Гороскоп: Дорогие Девы, наука дает вам индульгенцию."
Весы,"Наука недели: Европа и Китай в научном сотрудничестве.

Гороскоп: Весы, вы окажетесь в эпицентре противоречий."
Скорпион,"Наука недели: Гигантский вирус угоняет клеточные механизмы.

Гороскоп: Скорпион, активируется ваша темная сторона."
Стрелец,"Наука недели: Керн из антарктического льда расскажет о прошлом.

Гороскоп: Стрельцы, вас тянет вдаль, но звезды предлагают копнуть вглубь."
Козерог,"Наука недели: Наука финансирования нуждается в починке.

Гороскоп: Козерог, кто-то попытается ввести хаотичные реформы."
Водолей,"Наука недели: Роботизированные лаборатории заменят биологов.

Гороскоп: Водолей, ты можешь столкнуться с роботизацией рутины."
Рыбы,"Наука недели: Социальные сети сдвигают политические взгляды.

Гороскоп: Рыбы, будьте внимательны к потокам информации."`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'horoscope-template.csv';
    link.click();
  };

  return (
    <section
      ref={sectionRef}
      id="upload"
      className="relative py-24 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <Upload className="w-8 h-8 text-white/60" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="title-word inline-block">Загрузка</span>{' '}
            <span className="title-word inline-block text-white/60">гороскопа</span>
          </h2>
          <p className="title-word text-lg text-white/50">
            Обновите гороскоп на новую неделю через CSV файл
          </p>
        </div>

        {/* Upload Area */}
        <div ref={uploadRef}>
          {/* Current Status */}
          {hasData && currentWeekLabel && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">
                    Активен гороскоп: <strong>{currentWeekLabel}</strong>
                  </span>
                </div>
                <button
                  onClick={onClear}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                  title="Очистить все данные"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative p-12 rounded-3xl border-2 border-dashed
              flex flex-col items-center justify-center
              cursor-pointer transition-all duration-300
              ${isDragging
                ? 'border-blue-400 bg-blue-400/10'
                : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center mb-6
              transition-all duration-300
              ${isDragging ? 'bg-blue-400/30 scale-110' : 'bg-white/10'}
            `}>
              <FileText className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-white/60'}`} />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragging ? 'Отпустите файл' : 'Перетащите CSV файл'}
            </h3>
            <p className="text-white/50 text-center mb-4">
              или нажмите, чтобы выбрать файл
            </p>

            {isUploading && (
              <div className="flex items-center gap-2 text-blue-400">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>Загрузка...</span>
              </div>
            )}
          </div>

          {/* Status Message */}
          {uploadStatus.type && (
            <div
              className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                uploadStatus.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <span className={uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                {uploadStatus.message}
              </span>
            </div>
          )}

          {/* Template Download */}
          <div className="mt-8 text-center">
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Скачать шаблон CSV</span>
            </button>
            <p className="mt-3 text-sm text-white/40">
              Формат: Знак,Гороскоп (с разделителем запятая или точка с запятой)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
