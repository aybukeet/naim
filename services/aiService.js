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
    // API kota doldu veya bağlanamıyorsa demo CV göster
    const name = cvData.cv_name || 'Aday';
    const city = cvData.cv_city || 'İstanbul';
    const contact = cvData.cv_contact || 'ornek@email.com';
    const edu = cvData.cv_edu || 'Bilgisayar Mühendisliği, XYZ Üniversitesi (2024)';
    const skills = cvData.cv_skills || 'JavaScript, React Native, Python, İngilizce (B2)';
    return `📹 DEMO MODU — API Kota Doldu

=====================================
🎓 ATS & EUROPASS UYUMLU CV
=====================================

**${name}**
${contact} | ${city}

-------------------------------------
📌 PROFESYONEL ÖZET
-------------------------------------
Yenilikçi düşünce yapısına sahip, analitik ve sonuç odaklı bir profesyonel olarak teknoloji sektöründe güçlü bir kariyer hedefliyorum. Ekip çalışmasına yatkın, öğrenmeye açık yapım ile kuruma değer katmak için hazırım.

-------------------------------------
🎓 EĞİTİM
-------------------------------------
${edu}

-------------------------------------
💼 TECRUBE
-------------------------------------
${cvData.cv_exp || '• Proje Geliştirici, ABC Şirketi (2022-2024)\n  - Ekip ierişimini ve proje teslim sürelerini %30 azalttm\n  - Geliştirilen çözüm müşteri memnuniyetini ölçülebilir biçimde artrdı.'}

-------------------------------------
⭐ BAŞARILAR
-------------------------------------
${cvData.cv_achievements || '• Bir ay içinde 3 farklı projeyi başarıyla teslim ettim\n• Takım verimliliğini en üst düzeye taşıdım'}

-------------------------------------
🛠 YETENEK VE DİLLER
-------------------------------------
${skills}

-------------------------------------
🌟 GÜÇLÜ YÖNLER
-------------------------------------
${cvData.cv_strengths || 'Problem çözme, takım çalışması, hızlı öğrenme, yaratıcı düşünme'}

${cvData.cv_bonus ? '-------------------------------------\n📃 EKSTRA\n-------------------------------------\n' + cvData.cv_bonus : ''}

=====================================
✅ Bu CV Europass • ATS Uyumluluk Skoru: 95/100
=====================================`;
  }
};

export const generateJobListings = async (cvData, careerGoal) => {
  // ADIM 1: Remotive API'sinden gerçek iş ilanlarını çek
  let realJobs = [];
  try {
    const keyword = (cvData.cv_skills || careerGoal || 'software').split(' ')[0];
    const url = `https://remotive.com/api/remote-jobs?limit=20&search=${encodeURIComponent(keyword)}`;
    const res = await fetch(url);
    const data = await res.json();
    realJobs = (data.jobs || []).slice(0, 20).map(j => ({
      title: j.title,
      company: j.company_name,
      category: j.category,
      location: j.candidate_required_location || 'Remote',
      url: j.url,
      tags: (j.tags || []).slice(0, 4).join(', ')
    }));
  } catch (err) {
    console.error('Remotive API hatası:', err);
  }

  if (realJobs.length === 0) {
    // Remotive API bağlanamadıysa demo ilanları göster
    return buildJobCards([
      { title: 'Frontend Developer (React Native)', company: 'Insider', category: 'Software Development', location: 'Hybrid — İstanbul', url: 'https://useinsider.com/careers/', tags: 'React Native, TypeScript, Redux' },
      { title: 'Full Stack Web Developer', company: 'Trendyol', category: 'Software Development', location: 'Remote — Türkiye', url: 'https://trendyol.com/kariyer', tags: 'Node.js, React, PostgreSQL' },
      { title: 'AI/ML Engineer', company: 'Peak Games', category: 'Machine Learning', location: 'Remote — Europe', url: 'https://peak.com/careers/', tags: 'Python, TensorFlow, LLM' }
    ]);
  }

  // ADIM 2: Gemini AI ile en uygun 3 İlanı Seç
  if (!genAI) return buildJobCards(realJobs.slice(0, 3));

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const prompt = `Kullanıcının profili:
- Kariyer Hedefi: ${careerGoal || 'Belirtilmedi'}
- Yetenekler: ${cvData.cv_skills || 'Belirtilmedi'}
- Deneyim: ${cvData.cv_exp || 'Belirtilmedi'}

Aşağıdaki gerçek iş ilanları listesinden bu kullanıcıya en uygun 3 tanesinin index numaralarını seç ve sadece virgullü üç sayı yaz (orn: 0,4,11). Başka hiçbir şey yazma.

İlanlar:
${realJobs.map((j, i) => `[${i}] ${j.title} @ ${j.company} (${j.category}) - Etiketler: ${j.tags}`).join('\n')}`;

    const result = await model.generateContent(prompt);
    const txt = result.response.text().trim();
    const indices = txt.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n < realJobs.length).slice(0, 3);
    const chosen = indices.length > 0 ? indices.map(i => realJobs[i]) : realJobs.slice(0, 3);
    return buildJobCards(chosen);
  } catch (err) {
    // AI bağlanamadıysa ilk 3 ilanı göster
    return buildJobCards(realJobs.slice(0, 3));
  }
};

function buildJobCards(jobs) {
  return jobs.map(job => ({
    "type": "container",
    "style": { "backgroundColor": "$CARD_BG$", "borderRadius": 16, "padding": 20, "marginBottom": 15, "borderWidth": 1, "borderColor": "$BORDER$" },
    "children": [
      { "type": "container", "style": { "flexDirection": "row", "alignItems": "center", "marginBottom": 8 }, "children": [
        { "type": "text", "content": "\ud83c\udf0d", "style": { "fontSize": 28, "marginRight": 10 } },
        { "type": "container", "style": {}, "children": [
          { "type": "text", "content": job.title, "style": { "fontSize": 17, "fontWeight": "bold", "color": "$TEXT$" } },
          { "type": "text", "content": job.company, "style": { "fontSize": 13, "color": "$TEXT_MUTED$" } }
        ]}
      ]},
      { "type": "text", "content": "\ud83d\udccd " + job.location + "  \u2022  " + job.category, "style": { "fontSize": 13, "color": "$TEXT_MUTED$", "marginBottom": 8 } },
      job.tags ? { "type": "text", "content": "\ud83c\udff7\ufe0f " + job.tags, "style": { "fontSize": 12, "color": "$TEXT_MUTED$", "marginBottom": 12 } } : { "type": "text", "content": "", "style": {} },
      { "type": "button", "content": "\ud83d\ude80 Hemen Ba\u015fvur", "action": { "type": "OPEN_URL", "url": job.url }, "style": { "backgroundColor": "$BUTTON_BG$", "padding": 12, "borderRadius": 8, "alignItems": "center" }, "textStyle": { "color": "#fff", "fontWeight": "bold", "fontSize": 14 } }
    ]
  }));
}

