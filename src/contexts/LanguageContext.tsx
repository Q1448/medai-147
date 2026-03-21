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
  
  // Homepage
  heroTagline: { en: 'Next-Gen Health Assistant', ru: 'Медицинский ИИ-помощник', kk: 'Жаңа буын денсаулық көмекшісі' },
  heroTitle1: { en: 'Your AI-Powered', ru: 'Ваш ИИ-помощник', kk: 'Сіздің AI-қуатты' },
  heroTitle2: { en: 'Medical', ru: 'по', kk: 'Медициналық' },
  heroTitle3: { en: 'Companion', ru: 'здоровью', kk: 'Серігіңіз' },
  heroDescription: { en: 'Get instant health insights, accurate symptom analysis, medicine recommendations, and find nearby healthcare facilities—all powered by advanced AI.', ru: 'Получайте мгновенные медицинские советы, точный анализ симптомов, рекомендации по лекарствам и находите ближайшие медучреждения — всё на основе ИИ.', kk: 'Лезде денсаулық кеңестері, дәл белгілер талдауы, дәрі ұсыныстары және жақын медициналық мекемелерді табыңыз — барлығы AI негізінде.' },
  checkSymptoms: { en: 'Check Symptoms', ru: 'Проверить симптомы', kk: 'Белгілерді тексеру' },
  talkToAI: { en: 'Talk to AI Doctor', ru: 'Спросить ИИ доктора', kk: 'AI дәрігермен сөйлесу' },
  available247: { en: 'Available', ru: 'Доступно', kk: 'Қолжетімді' },
  aiPowered: { en: 'Powered', ru: 'На базе', kk: 'Қуатты' },
  privateSecure: { en: 'Private', ru: 'Приватно', kk: 'Құпия' },
  fastResults: { en: 'Results', ru: 'Результаты', kk: 'Нәтижелер' },
  exploreFeatures: { en: 'Explore Our Features', ru: 'Наши возможности', kk: 'Мүмкіндіктерімізді зерттеңіз' },
  featuresDescription: { en: 'Comprehensive AI-powered tools designed to help you make informed health decisions', ru: 'Комплексные ИИ-инструменты для принятия обоснованных решений о здоровье', kk: 'Денсаулық шешімдерін қабылдауға көмектесетін жан-жақты AI құралдары' },
  needHelp: { en: 'Need Immediate Help?', ru: 'Нужна срочная помощь?', kk: 'Шұғыл көмек керек пе?' },
  emergencyDescription: { en: "If you're experiencing a medical emergency, please contact emergency services immediately.", ru: 'Если у вас неотложная медицинская ситуация, немедленно вызовите скорую помощь.', kk: 'Медициналық төтенше жағдай болса, дереу жедел жәрдемге хабарласыңыз.' },
  callEmergency: { en: 'Call Emergency: 103', ru: 'Скорая помощь: 103', kk: 'Жедел жәрдем: 103' },
  findHospitals: { en: 'Find Hospitals', ru: 'Найти больницы', kk: 'Ауруханаларды табу' },
  
  // Feature cards
  featureSymptomTitle: { en: 'Symptoms Checker', ru: 'Проверка симптомов', kk: 'Белгілерді тексеру' },
  featureSymptomDesc: { en: 'Advanced AI analysis of your symptoms for accurate condition identification', ru: 'Расширенный ИИ-анализ симптомов для точного определения заболевания', kk: 'Дәл ауруды анықтау үшін белгілердің AI талдауы' },
  featureAIDoctorTitle: { en: 'AI Doctor', ru: 'ИИ Доктор', kk: 'AI Дәрігер' },
  featureAIDoctorDesc: { en: 'Powerful AI medical assistant with comprehensive health knowledge', ru: 'Мощный ИИ медицинский ассистент с обширными знаниями о здоровье', kk: 'Денсаулық туралы терең білімі бар қуатты AI медициналық көмекшісі' },
  featureImageTitle: { en: 'AI Image Analysis', ru: 'ИИ анализ изображений', kk: 'AI сурет талдау' },
  featureImageDesc: { en: 'Precise visual analysis of skin conditions with detailed insights', ru: 'Точный визуальный анализ состояния кожи с детальными выводами', kk: 'Тері жағдайларының нақты визуалды талдауы' },
  featureMedicineTitle: { en: 'Medicine Shop', ru: 'Аптека', kk: 'Дәріхана' },
  featureMedicineDesc: { en: 'Find medicines for your condition with prices and instructions', ru: 'Найдите лекарства с ценами и инструкциями', kk: 'Бағалар мен нұсқаулармен дәрі табыңыз' },
  featureHospitalTitle: { en: 'Pharmacies & Hospitals', ru: 'Аптеки и Больницы', kk: 'Дәріханалар мен Ауруханалар' },
  featureHospitalDesc: { en: 'Navigate directly to pharmacies and hospitals in Astana', ru: 'Переходите напрямую к аптекам и больницам в Астане', kk: 'Астанадағы дәріханалар мен ауруханаларға тікелей өтіңіз' },
  featureAboutTitle: { en: 'About Us', ru: 'О нас', kk: 'Біз туралы' },
  featureAboutDesc: { en: 'Meet our team and learn about our mission', ru: 'Познакомьтесь с нашей командой и миссией', kk: 'Біздің команда және миссиямызбен танысыңыз' },
  
  // Common
  search: { en: 'Search', ru: 'Поиск', kk: 'Іздеу' },
  submit: { en: 'Submit', ru: 'Отправить', kk: 'Жіберу' },
  loading: { en: 'Loading...', ru: 'Загрузка...', kk: 'Жүктелуде...' },
  analyze: { en: 'Analyze', ru: 'Анализировать', kk: 'Талдау' },
  send: { en: 'Send', ru: 'Отправить', kk: 'Жіберу' },
  
  // Symptoms page
  symptomChecker: { en: 'Symptom Checker', ru: 'Проверка симптомов', kk: 'Белгілерді тексеру' },
  advancedSymptomAnalysis: { en: 'Advanced Symptom Analysis', ru: 'Расширенный анализ симптомов', kk: 'Кеңейтілген белгілерді талдау' },
  analyzeYourSymptoms: { en: 'Analyze Your Symptoms', ru: 'Проанализируйте свои симптомы', kk: 'Белгілеріңізді талдаңыз' },
  selectSymptoms: { en: 'Select Your Symptoms', ru: 'Выберите симптомы', kk: 'Белгілеріңізді таңдаңыз' },
  symptomDescription: { en: 'Select multiple symptoms for more accurate analysis', ru: 'Выберите несколько симптомов для точного анализа', kk: 'Дәлірек талдау үшін бірнеше белгіні таңдаңыз' },
  analyzeSymptoms: { en: 'Analyze Symptoms', ru: 'Анализ симптомов', kk: 'Белгілерді талдау' },
  analyzingSymptoms: { en: 'Analyzing Symptoms...', ru: 'Анализ симптомов...', kk: 'Белгілер талдануда...' },
  selectedSymptoms: { en: 'Selected symptoms', ru: 'Выбранные симптомы', kk: 'Таңдалған белгілер' },
  describeInDetail: { en: 'Describe in Detail', ru: 'Опишите подробно', kk: 'Толық сипаттаңыз' },
  moreDetailsMoreAccurate: { en: 'The more details you provide, the more accurate the analysis will be.', ru: 'Чем больше подробностей, тем точнее будет анализ.', kk: 'Көбірек мәлімет берсеңіз, талдау дәлірек болады.' },
  describePlaceholder: { en: 'Describe your symptoms in detail: When did they start? How severe are they? Are there any triggers?', ru: 'Опишите симптомы подробно: Когда начались? Насколько сильные? Есть ли триггеры?', kk: 'Белгілеріңізді толық сипаттаңыз: Қашан басталды? Қаншалықты қатты? Триггерлер бар ма?' },
  pleaseSelectSymptom: { en: 'Please select at least one symptom or describe your symptoms.', ru: 'Пожалуйста, выберите хотя бы один симптом или опишите их.', kk: 'Кем дегенде бір белгіні таңдаңыз немесе сипаттаңыз.' },
  possibleConditions: { en: 'Possible Conditions', ru: 'Возможные заболевания', kk: 'Ықтимал аурулар' },
  basedOnSymptoms: { en: 'Based on your symptoms, here are the most likely conditions', ru: 'На основе ваших симптомов, вот наиболее вероятные состояния', kk: 'Белгілеріңізге сүйене отырып, ықтимал жағдайлар' },
  severity: { en: 'Severity', ru: 'Тяжесть', kk: 'Ауырлығы' },
  possibleCause: { en: 'Possible Cause', ru: 'Возможная причина', kk: 'Ықтимал себеп' },
  
  // Symptom names
  headache: { en: 'Headache', ru: 'Головная боль', kk: 'Бас ауруы' },
  fever: { en: 'Fever', ru: 'Лихорадка', kk: 'Қызба' },
  cough: { en: 'Cough', ru: 'Кашель', kk: 'Жөтел' },
  fatigue: { en: 'Fatigue', ru: 'Усталость', kk: 'Шаршау' },
  soreThroat: { en: 'Sore Throat', ru: 'Боль в горле', kk: 'Тамақ ауруы' },
  bodyAches: { en: 'Body Aches', ru: 'Боли в теле', kk: 'Дене ауруы' },
  nausea: { en: 'Nausea', ru: 'Тошнота', kk: 'Жүрек айну' },
  dizziness: { en: 'Dizziness', ru: 'Головокружение', kk: 'Бас айналу' },
  shortnessOfBreath: { en: 'Shortness of Breath', ru: 'Одышка', kk: 'Тыныс қысылу' },
  chestPain: { en: 'Chest Pain', ru: 'Боль в груди', kk: 'Кеуде ауруы' },
  runnyNose: { en: 'Runny Nose', ru: 'Насморк', kk: 'Мұрын ағу' },
  lossOfAppetite: { en: 'Loss of Appetite', ru: 'Потеря аппетита', kk: 'Тәбеттің жоғалуы' },
  
  // AI Doctor
  askDoctor: { en: 'Ask AI Doctor', ru: 'Спросить ИИ Доктора', kk: 'AI Дәрігерден сұрау' },
  typeMessage: { en: 'Type your message...', ru: 'Введите сообщение...', kk: 'Хабарламаңызды жазыңыз...' },
  poweredByAI: { en: 'Powered by Advanced AI', ru: 'На основе продвинутого ИИ', kk: 'Озық AI негізінде' },
  aiDoctorAssistant: { en: 'AI Doctor Assistant', ru: 'ИИ Доктор Ассистент', kk: 'AI Дәрігер Көмекшісі' },
  getComprehensiveHealth: { en: 'Get comprehensive health information from our powerful AI medical assistant.', ru: 'Получите исчерпывающую информацию о здоровье от нашего мощного ИИ медицинского ассистента.', kk: 'Біздің қуатты AI медициналық көмекшісінен денсаулық туралы толық ақпарат алыңыз.' },
  onlineReady: { en: 'Online • Ready to help 24/7', ru: 'Онлайн • Готов помочь 24/7', kk: 'Онлайн • 24/7 көмектесуге дайын' },
  sources: { en: 'Sources', ru: 'Источники', kk: 'Дереккөздер' },
  quickQuestions: { en: 'Quick questions:', ru: 'Быстрые вопросы:', kk: 'Жылдам сұрақтар:' },
  askPlaceholder: { en: 'Ask about symptoms, conditions, treatments, or any health-related questions...', ru: 'Спросите о симптомах, заболеваниях, лечении или любых вопросах о здоровье...', kk: 'Белгілер, аурулар, емдеу немесе денсаулыққа қатысты кез келген сұрақ қойыңыз...' },
  
  // Suggested questions
  suggestQ1: { en: 'What are the symptoms of the flu?', ru: 'Каковы симптомы гриппа?', kk: 'Тұмаудың белгілері қандай?' },
  suggestQ2: { en: 'How can I improve my sleep quality?', ru: 'Как улучшить качество сна?', kk: 'Ұйқы сапасын қалай жақсартуға болады?' },
  suggestQ3: { en: 'What should I do for a headache?', ru: 'Что делать при головной боли?', kk: 'Бас ауырғанда не істеу керек?' },
  suggestQ4: { en: 'When should I see a doctor for a cough?', ru: 'Когда обратиться к врачу при кашле?', kk: 'Жөтелмен қашан дәрігерге бару керек?' },
  
  // AI Analysis
  precisionAIAnalysis: { en: 'Precision AI Analysis', ru: 'Точный ИИ анализ', kk: 'Нақты AI талдау' },
  aiImageAnalysis: { en: 'AI Image Analysis', ru: 'ИИ Анализ изображений', kk: 'AI Сурет талдау' },
  uploadPhotoDescription: { en: 'Upload a photo of skin conditions for detailed AI-powered visual analysis with high accuracy.', ru: 'Загрузите фото состояния кожи для детального ИИ анализа с высокой точностью.', kk: 'Жоғары дәлдікпен AI талдауы үшін тері жағдайының суретін жүктеңіз.' },
  uploadImage: { en: 'Upload Image', ru: 'Загрузить изображение', kk: 'Суретті жүктеу' },
  clickToUpload: { en: 'Click to upload or drag and drop', ru: 'Нажмите для загрузки или перетащите', kk: 'Жүктеу үшін басыңыз немесе сүйреңіз' },
  upTo10MB: { en: 'PNG, JPG, WEBP up to 10MB', ru: 'PNG, JPG, WEBP до 10МБ', kk: 'PNG, JPG, WEBP 10МБ дейін' },
  forBestResults: { en: 'For best results, use clear, well-lit images', ru: 'Для лучших результатов используйте четкие, хорошо освещенные фото', kk: 'Жақсы нәтиже үшін анық, жарық суреттер қолданыңыз' },
  analyzeImage: { en: 'Analyze Image', ru: 'Анализировать изображение', kk: 'Суретті талдау' },
  analyzingImage: { en: 'Analyzing Image...', ru: 'Анализ изображения...', kk: 'Сурет талдануда...' },
  aiObservations: { en: 'AI Observations', ru: 'Наблюдения ИИ', kk: 'AI бақылаулары' },
  aiRecommendation: { en: 'AI Recommendation', ru: 'Рекомендация ИИ', kk: 'AI ұсынысы' },
  likelihood: { en: 'Likelihood', ru: 'Вероятность', kk: 'Ықтималдық' },
  
  // Medicines
  healthMarket: { en: 'Health Market', ru: 'Медицинский магазин', kk: 'Денсаулық дүкені' },
  findMedicinesTitle: { en: 'Find Medicines for Your Condition', ru: 'Найдите лекарства для вашего заболевания', kk: 'Ауруыңызға дәрі табыңыз' },
  medicineShop: { en: 'Medicine Information', ru: 'Информация о лекарствах', kk: 'Дәрілер туралы ақпарат' },
  searchCondition: { en: 'Search by condition or symptom', ru: 'Поиск по заболеванию или симптому', kk: 'Ауру немесе белгі бойынша іздеу' },
  findMedicines: { en: 'Find Medicines', ru: 'Найти лекарства', kk: 'Дәрілерді табу' },
  findingMedicines: { en: 'Finding Medicines...', ru: 'Поиск лекарств...', kk: 'Дәрілер ізделуде...' },
  whatsYourCondition: { en: "What's your condition or disease?", ru: 'Какое у вас заболевание?', kk: 'Сіздің ауруыңыз қандай?' },
  conditionPlaceholder: { en: 'e.g., Headache, Flu, Allergies, Back Pain...', ru: 'например, Головная боль, Грипп, Аллергия...', kk: 'мысалы, Бас ауруы, Тұмау, Аллергия...' },
  medicinesFor: { en: 'Medicines for', ru: 'Лекарства для', kk: 'Дәрілер' },
  foundMedicines: { en: 'recommended medicines', ru: 'рекомендуемых лекарств', kk: 'ұсынылған дәрілер' },
  filters: { en: 'Filters', ru: 'Фильтры', kk: 'Сүзгілер' },
  allPrices: { en: 'All Prices', ru: 'Все цены', kk: 'Барлық бағалар' },
  budget: { en: 'Budget', ru: 'Бюджет', kk: 'Бюджет' },
  medium: { en: 'Medium', ru: 'Средний', kk: 'Орташа' },
  premium: { en: 'Premium', ru: 'Премиум', kk: 'Премиум' },
  genericsOnly: { en: 'Generics Only', ru: 'Только дженерики', kk: 'Тек генериктер' },
  dosage: { en: 'Dosage', ru: 'Дозировка', kk: 'Дозалау' },
  instructions: { en: 'Instructions', ru: 'Инструкции', kk: 'Нұсқаулар' },
  duration: { en: 'Duration', ru: 'Длительность', kk: 'Ұзақтығы' },
  warnings: { en: 'Warnings', ru: 'Предупреждения', kk: 'Ескертулер' },
  inStock: { en: 'In Stock', ru: 'В наличии', kk: 'Қолда бар' },
  outOfStock: { en: 'Out of Stock', ru: 'Нет в наличии', kk: 'Қолда жоқ' },
  generic: { en: 'Generic', ru: 'Дженерик', kk: 'Генерик' },
  analogues: { en: 'Analogues', ru: 'Аналоги', kk: 'Аналогтар' },
  drugInteractionWarning: { en: 'Drug Interaction Warning', ru: 'Предупреждение о взаимодействии', kk: 'Дәрі әрекеттесу ескертуі' },
  mayInteractWith: { en: 'May interact with', ru: 'Может взаимодействовать с', kk: 'Әрекеттесуі мүмкін' },
  nearbyPharmacies: { en: 'Nearby Pharmacies', ru: 'Ближайшие аптеки', kk: 'Жақын аптекалар' },
  generalAdvice: { en: 'General Advice', ru: 'Общие рекомендации', kk: 'Жалпы кеңестер' },
  
  // Hospitals
  pharmaciesHospitals: { en: 'Pharmacies & Hospitals', ru: 'Аптеки и Больницы', kk: 'Дәріханалар мен Ауруханалар' },
  healthcareLocations: { en: 'Healthcare Locations', ru: 'Медицинские учреждения', kk: 'Медициналық мекемелер' },
  pharmaciesHospitalsAstana: { en: 'Pharmacies & Hospitals in Astana', ru: 'Аптеки и Больницы в Астане', kk: 'Астанадағы Дәріханалар мен Ауруханалар' },
  clickForDirections: { en: 'Click on any location to get directions automatically via Google Maps', ru: 'Нажмите на любую локацию для автоматического построения маршрута', kk: 'Маршрутты автоматты түрде алу үшін кез келген орынды басыңыз' },
  getDirections: { en: 'Get Directions', ru: 'Построить маршрут', kk: 'Бағытты көрсету' },
  clickToGetDirections: { en: 'Click to get directions', ru: 'Нажмите для маршрута', kk: 'Маршрут үшін басыңыз' },
  callPharmacy: { en: 'Call', ru: 'Позвонить', kk: 'Қоңырау шалу' },
  emergency: { en: 'Emergency', ru: 'Экстренная помощь', kk: 'Шұғыл көмек' },
  emergencyAmbulance: { en: 'Emergency (Ambulance)', ru: 'Скорая помощь', kk: 'Жедел жәрдем' },
  generalEmergency: { en: 'General Emergency', ru: 'Общая экстренная служба', kk: 'Жалпы шұғыл қызмет' },
  pharmacies: { en: 'Pharmacies', ru: 'Аптеки', kk: 'Дәріханалар' },
  hospitalsTitle: { en: 'Hospitals', ru: 'Больницы', kk: 'Ауруханалар' },
  astanaHealthcareMap: { en: 'Astana Healthcare Map', ru: 'Карта медучреждений Астаны', kk: 'Астана медициналық мекемелер картасы' },
  openFullMap: { en: 'Open Full Map', ru: 'Открыть полную карту', kk: 'Толық картаны ашу' },
  walkTime: { en: 'walk', ru: 'пешком', kk: 'жаяу' },
  driveTime: { en: 'drive', ru: 'на авто', kk: 'көлікпен' },
  
  // About
  ourTeam: { en: 'Our Team', ru: 'Наша команда', kk: 'Біздің команда' },
  developer: { en: 'Developer', ru: 'Разработчик', kk: 'Әзірлеуші' },
  researcher: { en: 'Researcher', ru: 'Исследователь', kk: 'Зерттеуші' },
  assistantResearcher: { en: 'Assistant Researcher', ru: 'Помощник исследователя', kk: 'Зерттеуші көмекшісі' },
  
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
  yourFeedbackHelps: { en: 'Your feedback helps us improve MedAI+', ru: 'Ваш отзыв помогает нам улучшить MedAI+', kk: 'Пікіріңіз MedAI+ жақсартуға көмектеседі' },
  
  // Feedback Stats
  feedbackStats: { en: 'Community Feedback', ru: 'Отзывы сообщества', kk: 'Қауымдастық пікірлері' },
  feedbackStatsDescription: { en: 'See what others are suggesting', ru: 'Посмотрите предложения других', kk: 'Басқалардың ұсыныстарын қараңыз' },
  totalSuggestions: { en: 'Total Suggestions', ru: 'Всего предложений', kk: 'Барлық ұсыныстар' },
  thisWeek: { en: 'This Week', ru: 'За неделю', kk: 'Осы аптада' },
  mostPopular: { en: 'Most Popular', ru: 'Самое популярное', kk: 'Ең танымал' },
  byCategory: { en: 'By Category', ru: 'По категориям', kk: 'Санаттар бойынша' },
  
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
  analysisPersonalized: { en: 'Analysis will consider your profile', ru: 'Анализ учтет ваш профиль', kk: 'Талдау профиліңізді ескереді' },
  responsesPersonalized: { en: 'Responses personalized for your profile', ru: 'Ответы персонализированы для вашего профиля', kk: 'Жауаптар профиліңізге бейімделген' },
  
  // About page
  aboutDescription: { en: 'We are a dedicated team of students from NIS IB (Nazarbayev Intellectual School, International Baccalaureate program) passionate about using technology to improve healthcare accessibility.', ru: 'Мы - команда студентов NIS IB (Назарбаев Интеллектуальная Школа, программа IB), увлечённых использованием технологий для улучшения доступности медицины.', kk: 'Біз денсаулық сақтау қолжетімділігін жақсарту үшін технологияны қолдануға құмар NIS IB (Назарбаев Интеллектуалды Мектебі, IB бағдарламасы) студенттерінің командасымыз.' },
  nisDescription: { en: 'Nazarbayev Intellectual School - International Baccalaureate', ru: 'Назарбаев Интеллектуальная Школа - Международный Бакалавриат', kk: 'Назарбаев Интеллектуалды Мектебі - Халықаралық Бакалавриат' },
  projectDescription: { en: 'This project was developed as part of our educational initiative at NIS IB, combining our passion for technology with a desire to make healthcare information more accessible to everyone.', ru: 'Этот проект был разработан в рамках нашей образовательной инициативы в NIS IB, объединяя нашу страсть к технологиям с желанием сделать медицинскую информацию более доступной.', kk: 'Бұл жоба NIS IB-дегі біздің білім беру бастамамыздың бір бөлігі ретінде әзірленді, технологияға деген құмарлығымызды денсаулық сақтау туралы ақпаратты барлығына қолжетімді ету тілегімен біріктіреді.' },
  sponsorship: { en: 'Sponsorship', ru: 'Спонсорство', kk: 'Демеушілік' },
  sponsorshipDescription: { en: 'This section is reserved for future sponsors and partners who support our mission to improve healthcare accessibility through technology.', ru: 'Этот раздел зарезервирован для будущих спонсоров и партнёров, поддерживающих нашу миссию по улучшению доступности медицины с помощью технологий.', kk: 'Бұл бөлім технология арқылы денсаулық сақтау қолжетімділігін жақсарту миссиямызды қолдайтын болашақ демеушілер мен серіктестерге арналған.' },
  comingSoon: { en: 'Coming Soon', ru: 'Скоро', kk: 'Жақында' },
  
  // Disclaimer
  disclaimer: { en: 'Medical Disclaimer', ru: 'Медицинский отказ от ответственности', kk: 'Медициналық жауапкершіліктен бас тарту' },
  disclaimerText: { en: 'This AI tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.', ru: 'Этот инструмент предоставляет только общую информацию о здоровье и не заменяет профессиональную медицинскую консультацию. Всегда консультируйтесь с врачом.', kk: 'Бұл құрал тек жалпы денсаулық туралы ақпарат береді және кәсіби медициналық кеңестің орнын баспайды. Әрқашан дәрігермен кеңесіңіз.' },
  disclaimerFooterText: { en: 'This website provides general health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.', ru: 'Этот сайт предоставляет общую информацию о здоровье только в образовательных целях. Он не заменяет профессиональную медицинскую консультацию, диагностику или лечение. Всегда обращайтесь к квалифицированному медицинскому специалисту.', kk: 'Бұл веб-сайт тек білім беру мақсатында жалпы денсаулық туралы ақпарат береді. Ол кәсіби медициналық кеңестің, диагностиканың немесе емдеудің орнын баспайды. Әрқашан білікті дәрігерге жүгініңіз.' },
  disclaimerFooterBold: { en: 'If your condition worsens, seek immediate medical attention.', ru: 'Если ваше состояние ухудшится, немедленно обратитесь за медицинской помощью.', kk: 'Жағдайыңыз нашарласа, дереу медициналық көмекке жүгініңіз.' },
  importantNotice: { en: 'Important Notice', ru: 'Важное уведомление', kk: 'Маңызды ескерту' },
  disclaimerBannerText: { en: 'This information is for reference only and does not replace a doctor\'s consultation. If your condition worsens, seek medical help immediately.', ru: 'Эта информация носит справочный характер и не заменяет консультацию врача. Если ваше состояние ухудшится, немедленно обратитесь за медицинской помощью.', kk: 'Бұл ақпарат тек анықтамалық сипатта және дәрігермен кеңесудің орнын баспайды. Жағдайыңыз нашарласа, дереу медициналық көмекке жүгініңіз.' },
  
  // Evidence
  evidenceBased: { en: 'Evidence-Based Sources', ru: 'Научные источники', kk: 'Ғылыми дереккөздер' },
  whatIsThisBased: { en: 'What is this based on?', ru: 'На чём это основано?', kk: 'Бұл неге негізделген?' },
  
  // Conditions (for popular conditions)
  conditionHeadache: { en: 'Headache', ru: 'Головная боль', kk: 'Бас ауруы' },
  conditionColdFlu: { en: 'Cold & Flu', ru: 'Простуда и грипп', kk: 'Суық тию және тұмау' },
  conditionFever: { en: 'Fever', ru: 'Жар', kk: 'Қызба' },
  conditionAllergies: { en: 'Allergies', ru: 'Аллергия', kk: 'Аллергия' },
  conditionStomachPain: { en: 'Stomach Pain', ru: 'Боль в животе', kk: 'Асқазан ауруы' },
  conditionSoreThroat: { en: 'Sore Throat', ru: 'Боль в горле', kk: 'Тамақ ауруы' },
  conditionBackPain: { en: 'Back Pain', ru: 'Боль в спине', kk: 'Арқа ауруы' },
  conditionCough: { en: 'Cough', ru: 'Кашель', kk: 'Жөтел' },
  conditionInsomnia: { en: 'Insomnia', ru: 'Бессонница', kk: 'Ұйқысыздық' },
  conditionMusclePain: { en: 'Muscle Pain', ru: 'Мышечная боль', kk: 'Бұлшықет ауруы' },

  // Footer
  footerDescription: { en: 'AI-powered health information assistant. Get preliminary insights about symptoms, conditions, and medications. Always consult a doctor for proper medical advice.', ru: 'ИИ-помощник по медицинской информации. Получайте предварительные сведения о симптомах, заболеваниях и лекарствах. Всегда консультируйтесь с врачом.', kk: 'AI негізіндегі денсаулық туралы ақпарат көмекшісі. Белгілер, аурулар және дәрілер туралы алдын ала мәліметтер алыңыз. Әрқашан дәрігермен кеңесіңіз.' },
  quickLinks: { en: 'Quick Links', ru: 'Быстрые ссылки', kk: 'Жылдам сілтемелер' },
  symptomsChecker: { en: 'Symptoms Checker', ru: 'Проверка симптомов', kk: 'Белгілерді тексеру' },
  imageAnalysis: { en: 'Image Analysis', ru: 'Анализ изображений', kk: 'Сурет талдау' },
  aboutUs: { en: 'About Us', ru: 'О нас', kk: 'Біз туралы' },
  forInfoOnly: { en: 'For informational purposes only.', ru: 'Только в информационных целях.', kk: 'Тек ақпараттық мақсатта.' },
  madeWithLove: { en: 'Made with ❤️ by NIS IB Team', ru: 'Сделано с ❤️ командой NIS IB', kk: 'NIS IB командасы ❤️ жасаған' },
  
  // Medical Profile Sheet
  basicInformation: { en: 'Basic Information', ru: 'Основная информация', kk: 'Негізгі ақпарат' },
  weight: { en: 'Weight (kg)', ru: 'Вес (кг)', kk: 'Салмақ (кг)' },
  other: { en: 'Other', ru: 'Другой', kk: 'Басқа' },
  recentHistory: { en: 'Recent History', ru: 'Недавняя история', kk: 'Соңғы тарих' },
  clear: { en: 'Clear', ru: 'Очистить', kk: 'Тазалау' },
  profileStoredLocally: { en: 'Your profile is stored locally and helps AI provide more personalized recommendations. No data is sent to external servers.', ru: 'Ваш профиль хранится локально и помогает ИИ давать более персонализированные рекомендации. Данные не отправляются на внешние серверы.', kk: 'Профиліңіз жергілікті түрде сақталады және AI-ға жеке ұсыныстар беруге көмектеседі. Деректер сыртқы серверлерге жіберілмейді.' },

  // Hospital types
  mainHospital: { en: 'Main Hospital', ru: 'Главная больница', kk: 'Басты аурухана' },
  emergencyCenter: { en: 'Emergency Center', ru: 'Центр экстренной помощи', kk: 'Шұғыл көмек орталығы' },
  pediatricHospital: { en: 'Pediatric Hospital', ru: 'Детская больница', kk: 'Балалар ауруханасы' },

  // NotFound
  pageNotFound: { en: 'Oops! Page not found', ru: 'Упс! Страница не найдена', kk: 'Қате! Бет табылмады' },
  returnHome: { en: 'Return to Home', ru: 'Вернуться на главную', kk: 'Басты бетке оралу' },

  // Error messages
  errorSelectImage: { en: 'Please select an image file.', ru: 'Пожалуйста, выберите изображение.', kk: 'Сурет файлын таңдаңыз.' },
  errorImageSize: { en: 'Image size must be less than 10MB.', ru: 'Размер изображения должен быть менее 10МБ.', kk: 'Сурет өлшемі 10МБ-тан аз болуы керек.' },
  errorUploadFirst: { en: 'Please upload an image first.', ru: 'Сначала загрузите изображение.', kk: 'Алдымен суретті жүктеңіз.' },
  errorAnalysisFailed: { en: 'Failed to analyze. Please try again.', ru: 'Не удалось проанализировать. Попробуйте снова.', kk: 'Талдау сәтсіз. Қайта көріңіз.' },
  errorEnterCondition: { en: 'Please enter a condition or disease.', ru: 'Введите заболевание.', kk: 'Ауруды енгізіңіз.' },
  errorFindMedicines: { en: 'Failed to find medicines. Please try again.', ru: 'Не удалось найти лекарства. Попробуйте снова.', kk: 'Дәрілер табылмады. Қайта көріңіз.' },
  errorEnterSuggestion: { en: 'Please enter your suggestion', ru: 'Введите ваше предложение', kk: 'Ұсынысыңызды енгізіңіз' },
  errorSubmitFailed: { en: 'Failed to submit feedback. Please try again.', ru: 'Не удалось отправить отзыв. Попробуйте снова.', kk: 'Пікір жіберілмеді. Қайта көріңіз.' },
  rateLimitError: { en: 'Rate limit exceeded. Please try again later.', ru: 'Превышен лимит запросов. Попробуйте позже.', kk: 'Сұраныс лимиті асып кетті. Кейінірек қайталаңыз.' },
  serviceUnavailable: { en: 'Service temporarily unavailable. Please try again later.', ru: 'Сервис временно недоступен. Попробуйте позже.', kk: 'Қызмет уақытша қолжетімсіз. Кейінірек көріңіз.' },

  // Feedback public list
  allSuggestions: { en: 'All Suggestions', ru: 'Все предложения', kk: 'Барлық ұсыныстар' },
  allSuggestionsDesc: { en: 'Browse and like suggestions from the community', ru: 'Просматривайте и голосуйте за предложения сообщества', kk: 'Қауымдастық ұсыныстарын қараңыз және дауыс беріңіз' },
  anonymous: { en: 'Anonymous', ru: 'Аноним', kk: 'Анонім' },
  likes: { en: 'likes', ru: 'голосов', kk: 'дауыс' },
  noSuggestionsYet: { en: 'No suggestions yet. Be the first!', ru: 'Пока нет предложений. Будьте первым!', kk: 'Әлі ұсыныстар жоқ. Бірінші болыңыз!' },
  addSuggestion: { en: 'Add Suggestion', ru: 'Добавить предложение', kk: 'Ұсыныс қосу' },
  viewAllSuggestions: { en: 'View All Suggestions', ru: 'Все предложения', kk: 'Барлық ұсыныстар' },

  // Auth
  login: { en: 'Sign In', ru: 'Войти', kk: 'Кіру' },
  signup: { en: 'Sign Up', ru: 'Регистрация', kk: 'Тіркелу' },
  password: { en: 'Password', ru: 'Пароль', kk: 'Құпия сөз' },
  continueWithGoogle: { en: 'Continue with Google', ru: 'Продолжить через Google', kk: 'Google арқылы кіру' },
  noAccount: { en: "Don't have an account?", ru: 'Нет аккаунта?', kk: 'Аккаунт жоқ па?' },
  hasAccount: { en: 'Already have an account?', ru: 'Уже есть аккаунт?', kk: 'Аккаунт бар ма?' },
  logout: { en: 'Sign Out', ru: 'Выйти', kk: 'Шығу' },

  // About mission
  ourMission: { en: 'Our Mission', ru: 'Наша миссия', kk: 'Біздің миссия' },
  missionText: { en: 'We believe that access to reliable health information should be available to everyone. Our AI-powered platform bridges the gap between medical knowledge and everyday users, providing instant, accurate, and personalized health guidance in multiple languages.', ru: 'Мы верим, что доступ к надёжной медицинской информации должен быть у каждого. Наша платформа на базе ИИ устраняет разрыв между медицинскими знаниями и обычными пользователями, предоставляя мгновенные, точные и персонализированные медицинские рекомендации на нескольких языках.', kk: 'Біз сенімді денсаулық ақпаратына қол жеткізу барлығына қолжетімді болуы керек деп сенеміз. Біздің AI платформамыз медициналық білім мен күнделікті пайдаланушылар арасындағы алшақтықты жояды, бірнеше тілде лезде, дәл және жеке денсаулық кеңестерін ұсынады.' },
  problemWeResolve: { en: 'The Problem We Solve', ru: 'Проблема, которую мы решаем', kk: 'Біз шешетін мәселе' },
  problemText: { en: 'In Kazakhstan, many people face barriers to accessing quality healthcare information — language barriers, long waiting times, and limited access to specialists. MedAI+ provides 24/7 AI-powered medical guidance in Kazakh, Russian, and English, making healthcare knowledge accessible to everyone.', ru: 'В Казахстане многие сталкиваются с барьерами при получении качественной медицинской информации — языковые барьеры, долгое ожидание и ограниченный доступ к специалистам. MedAI+ предоставляет круглосуточную медицинскую помощь на базе ИИ на казахском, русском и английском языках.', kk: 'Қазақстанда көптеген адамдар сапалы денсаулық сақтау ақпаратына қол жеткізуде кедергілерге тап болады — тіл кедергілері, ұзақ күту және мамандарға шектеулі қол жеткізу. MedAI+ қазақ, орыс және ағылшын тілдерінде тәулік бойы AI негізіндегі медициналық көмек ұсынады.' },

  // Health Dashboard
  healthScore: { en: 'Health Score', ru: 'Показатель здоровья', kk: 'Денсаулық көрсеткіші' },
  riskScore: { en: 'Risk Score', ru: 'Показатель риска', kk: 'Тәуекел көрсеткіші' },
  generalVerdict: { en: 'General Verdict', ru: 'Общий вердикт', kk: 'Жалпы үкім' },
  shortTermMeasures: { en: 'Short-term Measures', ru: 'Краткосрочные меры', kk: 'Қысқа мерзімді шаралар' },
  longTermMeasures: { en: 'Long-term Measures', ru: 'Долгосрочные меры', kk: 'Ұзақ мерзімді шаралар' },
  healthy: { en: 'Healthy', ru: 'Здоров', kk: 'Сау' },
  critical: { en: 'Critical', ru: 'Критично', kk: 'Сыни' },
  lowRisk: { en: 'Low Risk', ru: 'Низкий риск', kk: 'Төмен тәуекел' },
  highRisk: { en: 'High Risk', ru: 'Высокий риск', kk: 'Жоғары тәуекел' },

  // Lifestyle Questions
  lifestyleQuestions: { en: 'Lifestyle & Nutrition', ru: 'Образ жизни и питание', kk: 'Өмір салты және тамақтану' },
  dietQuestion: { en: 'How would you describe your diet?', ru: 'Как бы вы описали своё питание?', kk: 'Тамақтануыңызды қалай сипаттар едіңіз?' },
  dietPlaceholder: { en: 'e.g., I eat mostly fast food, skip breakfast, drink little water...', ru: 'например, Ем в основном фастфуд, пропускаю завтрак, пью мало воды...', kk: 'мысалы, Негізінен фастфуд жеймін, таңғы асты жібереді, аз су ішемін...' },
  exerciseQuestion: { en: 'How active are you physically?', ru: 'Насколько вы физически активны?', kk: 'Физикалық белсенділігіңіз қандай?' },
  exercisePlaceholder: { en: 'e.g., Sedentary work, walk 30 min daily, gym 3x/week...', ru: 'например, Сидячая работа, хожу 30 мин в день, зал 3 раза/нед...', kk: 'мысалы, Отырып жұмыс, күніне 30 мин жаяу, спорт залы аптасына 3 рет...' },
  sleepQuestion: { en: 'How is your sleep quality?', ru: 'Как у вас качество сна?', kk: 'Ұйқы сапасыңыз қандай?' },
  sleepPlaceholder: { en: 'e.g., I sleep 5-6 hours, wake up often, feel tired in the morning...', ru: 'например, Сплю 5-6 часов, часто просыпаюсь, утром чувствую усталость...', kk: 'мысалы, 5-6 сағат ұйықтаймын, жиі оянамын, таңертең шаршаймын...' },

  // 2GIS
  clickForDirections2gis: { en: 'Click on any location to open it in 2GIS', ru: 'Нажмите на любую локацию для открытия в 2ГИС', kk: '2ГИС-те ашу үшін кез келген орынды басыңыз' },
  openIn2gis: { en: 'Open in 2GIS', ru: 'Открыть в 2ГИС', kk: '2ГИС-те ашу' },
};

// Language names for system prompts
export const languageNames: Record<Language, string> = {
  en: 'English',
  ru: 'Russian',
  kk: 'Kazakh',
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
