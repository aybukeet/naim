import { GoogleGenerativeAI } from '@google/generative-ai';

// Expo ortamında ortam değişkenleri EXPO_PUBLIC_ ile başlamak zorundadır.
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey && apiKey !== 'BURAYA_API_ANAHTARINI_YAPISTIR' ? new GoogleGenerativeAI(apiKey) : null;

export const generateMentorResponse = async (persona, targetGoal, chatHistory, userMessage) => {
  if (!genAI) {
    return `(Sistem: API Anahtarı eksik. Lütfen .env dosyasına EXPO_PUBLIC_GEMINI_API_KEY değerini girip terminali yeniden başlatın.)\n\n[Mock Cevap]: Gönderdiğin "${userMessage}" mesajını aldım ama internete bağlanamıyorum 😅`;
  }

  // Multi-Agent (Çoklu Ajan) Kurulumu:
  let systemInstruction = '';
  switch (persona) {
    case 'fun':
      systemInstruction = `Sen eğlenceli, enerjik ve şakacı bir kariyer mentorusun! Kullanıcının ana kariyer hedefi: "${targetGoal}". Lütfen ona emojilerle, esprilerle ama yine de hedefine yönelik çok kaliteli, kısa tavsiyeler ver. Asla resmi konuşma. Sen onun en yakın arkadaşı gibisin. Cevapların okunabilir ve 2-3 cümleyi geçmeyecek kadar kısa olsun.`;
      break;
    case 'relaxed':
      systemInstruction = `Sen çok rahat, umursamaz ama bir o kadar da vizyoner ("chill") bir kariyer mentorusun. Kullanıcının hedefi: "${targetGoal}". Hayatın koşturmasını sevmeyen, "yarın bakarız", "acele etme her şey yetişir" mantığıyla pozitif ve sakinleştirici kısa cevaplar ver. Hiç kasma, sokak ağzına yakın doğal konuş.`;
      break;
    case 'academic':
      systemInstruction = `Sen çok katı, resmi, Türkçe dil bilgisini kusursuz kullanan akademik ve kurumsal bir kariyer mentorusun. Kullanıcının hedefi: "${targetGoal}". Kullanıcıya asla "sen" deme, "siz" diye hitap et. Yapılandırılmış, akademik ve metodolojik kısa direktifler ver. Asla ve asla emoji kullanma. Çok ciddi ol.`;
      break;
    default:
      systemInstruction = `Sen yardımcı bir yapay zeka mentorusun.`;
  }

  // Model başlatma (Google Free Tier kotası gemini-2.0 için kapalı. Çalıştığını bildiğimiz yegane ücretsiz model olan gemini-flash-latest'a dönüyoruz)
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-flash-latest',
    systemInstruction: systemInstruction 
  });

  // Geçmiş sohbeti listeleme (Optimizasyon: Sadece son 5 mesajı yollayarak tasarruf et)
  const recentHistory = chatHistory.slice(-5);
  const formattedHistory = recentHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // GEMİNİ API KURALI: History (Geçmiş Dizi) DAİMA "user" rolü ile başlamak zorundadır.
  // Baştaki "Ajanın attığı selamlama mesajını" AI'a göndermeyip sadece kullanıcı geçmişinden başlatıyoruz.
  while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
    formattedHistory.shift();
  }

  try {
    const chat = model.startChat({
      history: formattedHistory
    });

    // Kullanıcının attığı mesajı yolla ve cevabı bekle
    const result = await chat.sendMessage([{ text: userMessage }]);
    return result.response.text();
  } catch (err) {
    console.error("AI Agent Hatası:", err);
    return `(Ajan Sunucu Hatası: ${err.message})`;
  }
};

export const generateEuropassCV = async (cvData) => {
  if (!genAI) {
    return "(Sistem: API Anahtarı eksik. CV Üretilemedi.)";
  }

  // En stabi LLM olan flash-latest kullanımı
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `Sen uluslararası bir İnsan Kaynakları (HR) uzmanı ve ATS (Aday Takip Sistemi) optimizatörüsün.
Aşağıda kullanıcının doldurduğu dağınık ham veriler var. Bu verileri kullanarak tamamen yapılandırılmış, ATS sistemlerinden %100 geçecek profesyonel bir Europass formatında CV metni oluştur.

--- KULLANICI VERİLERİ ---
Ad Soyad: ${cvData.cv_name || 'Belirtilmedi'}
İletişim: ${cvData.cv_contact || 'Belirtilmedi'}
Şehir: ${cvData.cv_city || 'Belirtilmedi'}
Eğitim: ${cvData.cv_edu || 'Belirtilmedi'}
Deneyimler: ${cvData.cv_exp || 'Belirtilmedi'}
Önemli Başarılar: ${cvData.cv_achievements || 'Belirtilmedi'}
Yetenekler ve Diller: ${cvData.cv_skills || 'Belirtilmedi'}
Güçlü Yönler (Prof. Özet İçin): ${cvData.cv_strengths || 'Belirtilmedi'}
Ekstra (Sertifika, Staj vb): ${cvData.cv_bonus || 'Belirtilmedi'}
--------------------------

Lütfen markdown (kalın yazılar vs) kullanarak okunaklı, profesyonel bir dil ile doğrudan CV metnini ver. (Ekstra açıklama yazma, direkt CV başlasın).`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("CV Üretim Hatası:", err);
    return `(CV Sunucu Hatası: ${err.message}. Yoğunluk varsa biraz bekleyip tekrar deneyin.)`;
  }
};

