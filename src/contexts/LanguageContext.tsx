import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ru' | 'kk';

interface Translations {
  [key: string]: {
    en: string;
    ru: string;
    kk: string;
  };
}

export const translations: Translations = {
  // Navigation
  home: { en: 'Home', ru: 'Главная', kk: 'Басты бет' },
  symptoms: { en: 'Symptoms', ru: 'Симптомы', kk: 'Белгілер' },
  aiDoctor: { en: 'AI Doctor', ru: 'ИИ Доктор', kk: 'AI Дәрігер' },
  aiAnalysis: { en: 'AI Analysis', ru: 'ИИ Анализ', kk: 'AI Талдау' },
  medicines: { en: 'Medicines', ru: 'Лекарства', kk: 'Дәрілер' },
  hospitals: { en: 'Hospitals', ru: 'Больницы', kk: 'Ауруханалар' },
  about: { en: 'About', ru: 'О нас', kk: 'Біз туралы' },
  feedback: { en: 'Feedback', ru: 'Отзывы', kk: 'Пікірлер' },
  
  // Common
  search: { en: 'Search', ru: 'Поиск', kk: 'Іздеу' },
  submit: { en: 'Submit', ru: 'Отправить', kk: 'Жіберу' },
  loading: { en: 'Loading...', ru: 'Загрузка...', kk: 'Жүктелуде...' },
  analyze: { en: 'Analyze', ru: 'Анализировать', kk: 'Талдау' },
  send: { en: 'Send', ru: 'Отправить', kk: 'Жіберу' },
  
  // Symptoms page
  symptomChecker: { en: 'Symptom Checker', ru: 'Проверка симптомов', kk: 'Белгілерді тексеру' },
  selectSymptoms: { en: 'Select Your Symptoms', ru: 'Выберите симптомы', kk: 'Белгілеріңізді таңдаңыз' },
  symptomDescription: { en: 'Select multiple symptoms for more accurate analysis', ru: 'Выберите несколько симптомов для точного анализа', kk: 'Дәлірек талдау үшін бірнеше белгіні таңдаңыз' },
  analyzeSymptoms: { en: 'Analyze Symptoms', ru: 'Анализ симптомов', kk: 'Белгілерді талдау' },
  selectedSymptoms: { en: 'Selected symptoms', ru: 'Выбранные симптомы', kk: 'Таңдалған белгілер' },
  
  // AI Doctor
  askDoctor: { en: 'Ask AI Doctor', ru: 'Спросить ИИ Доктора', kk: 'AI Дәрігерден сұрау' },
  typeMessage: { en: 'Type your message...', ru: 'Введите сообщение...', kk: 'Хабарламаңызды жазыңыз...' },
  
  // Medicines
  medicineShop: { en: 'Medicine Information', ru: 'Информация о лекарствах', kk: 'Дәрілер туралы ақпарат' },
  searchCondition: { en: 'Search by condition or symptom', ru: 'Поиск по заболеванию или симптому', kk: 'Ауру немесе белгі бойынша іздеу' },
  findMedicines: { en: 'Find Medicines', ru: 'Найти лекарства', kk: 'Дәрілерді табу' },
  
  // Hospitals
  pharmaciesHospitals: { en: 'Pharmacies & Hospitals', ru: 'Аптеки и Больницы', kk: 'Дәріханалар мен Ауруханалар' },
  getDirections: { en: 'Get Directions', ru: 'Построить маршрут', kk: 'Бағытты көрсету' },
  callPharmacy: { en: 'Call', ru: 'Позвонить', kk: 'Қоңырау шалу' },
  emergency: { en: 'Emergency', ru: 'Экстренная помощь', kk: 'Шұғыл көмек' },
  
  // About
  ourTeam: { en: 'Our Team', ru: 'Наша команда', kk: 'Біздің команда' },
  developer: { en: 'Developer', ru: 'Разработчик', kk: 'Әзірлеуші' },
  researcher: { en: 'Researcher', ru: 'Исследователь', kk: 'Зерттеуші' },
  
  // Feedback
  feedbackTitle: { en: 'Product Improvement Suggestions', ru: 'Предложения по улучшению', kk: 'Жақсарту ұсыныстары' },
  feedbackDescription: { en: 'Help us improve MedAI+ by sharing your ideas and suggestions', ru: 'Помогите нам улучшить MedAI+, поделившись своими идеями', kk: 'Идеяларыңызбен бөлісіп, MedAI+ жақсартуға көмектесіңіз' },
  yourName: { en: 'Your Name (optional)', ru: 'Ваше имя (необязательно)', kk: 'Атыңыз (міндетті емес)' },
  yourEmail: { en: 'Your Email (optional)', ru: 'Ваш email (необязательно)', kk: 'Email (міндетті емес)' },
  category: { en: 'Category', ru: 'Категория', kk: 'Санат' },
  suggestion: { en: 'Your Suggestion', ru: 'Ваше предложение', kk: 'Сіздің ұсынысыңыз' },
  suggestionPlaceholder: { en: 'Share your ideas for improving our product...', ru: 'Поделитесь идеями по улучшению продукта...', kk: 'Өнімді жақсарту бойынша идеяларыңызбен бөлісіңіз...' },
  submitSuggestion: { en: 'Submit Suggestion', ru: 'Отправить предложение', kk: 'Ұсынысты жіберу' },
  thankYou: { en: 'Thank you for your feedback!', ru: 'Спасибо за ваш отзыв!', kk: 'Пікіріңіз үшін рахмет!' },
  
  // Categories
  catGeneral: { en: 'General', ru: 'Общее', kk: 'Жалпы' },
  catUI: { en: 'User Interface', ru: 'Интерфейс', kk: 'Интерфейс' },
  catFeatures: { en: 'New Features', ru: 'Новые функции', kk: 'Жаңа мүмкіндіктер' },
  catAI: { en: 'AI Improvements', ru: 'Улучшения ИИ', kk: 'AI жақсарту' },
  catOther: { en: 'Other', ru: 'Другое', kk: 'Басқа' },
  
  // Medical Profile
  medicalProfile: { en: 'Medical Profile', ru: 'Медицинский профиль', kk: 'Медициналық профиль' },
  age: { en: 'Age', ru: 'Возраст', kk: 'Жас' },
  gender: { en: 'Gender', ru: 'Пол', kk: 'Жынысы' },
  male: { en: 'Male', ru: 'Мужской', kk: 'Ер' },
  female: { en: 'Female', ru: 'Женский', kk: 'Әйел' },
  allergies: { en: 'Allergies', ru: 'Аллергии', kk: 'Аллергиялар' },
  medications: { en: 'Current Medications', ru: 'Текущие лекарства', kk: 'Қазіргі дәрілер' },
  chronicConditions: { en: 'Chronic Conditions', ru: 'Хронические заболевания', kk: 'Созылмалы аурулар' },
  
  // Disclaimer
  disclaimer: { en: 'Medical Disclaimer', ru: 'Медицинский отказ от ответственности', kk: 'Медициналық жауапкершіліктен бас тарту' },
  disclaimerText: { en: 'This AI tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.', ru: 'Этот инструмент предоставляет только общую информацию о здоровье и не заменяет профессиональную медицинскую консультацию. Всегда консультируйтесь с врачом.', kk: 'Бұл құрал тек жалпы денсаулық туралы ақпарат береді және кәсіби медициналық кеңестің орнын баспайды. Әрқашан дәрігермен кеңесіңіз.' },
  
  // Evidence
  evidenceBased: { en: 'Evidence-Based Sources', ru: 'Научные источники', kk: 'Ғылыми дереккөздер' },
  whatIsThisBased: { en: 'What is this based on?', ru: 'На чём это основано?', kk: 'Бұл неге негізделген?' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('medai-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('medai-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
