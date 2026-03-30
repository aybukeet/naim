# 🚀 CareerMate AI — **N.A.I.M.**

> **N** — *Navigation* • Kariyer yolunda sana özel yol gösterir  
> **A** — *Analysis* • Profilini, becerilerini ve hedeflerini analiz eder  
> **I** — *Intelligence* • Google Gemini AI ile gerçek zamanlı zeka üretir  
> **M** — *Mentorship* • Seçebileceğin 3 farklı karakıterle bire bir rehberlik eder  

**CareerMate AI**, kullanıcının kariyer profilini anlayan, Europass uyumlu CV oluşturan, gerçek iş ilanları getiren ve kullanıcıya özel bir yapay zeka mentörlük deneyimi sunan **Server-Driven UI (SDUI)** tabanlı bir React Native / Expo uygulamasıdır.

---

## 🧠 Mimari

Bu proje, geleneksel "her sayfa için `.tsx` dosyası yaz" yaklaşımı yerine, tüm arayüzü tek bir JSON dosyasından (`ui.json`) okuyan bir **SDUI Motoru** (`SDUIEngine.js`) kullanır. Bu sayede:

- Yeni bir sayfa eklemek = JSON'a bir `screen` objesi yazmak
- Yeni bir buton = JSON'a `button` tipi eklenmek
- Renkler ve temalar = `$BG$`, `$TEXT$` gibi token'lar üzerinden anlık enjekte edilmek

Hiç `.tsx` bileşeni yazmadan **10 tam iterasyon** tamamlandı.

---

## ✨ Özellikler

| Özellik | Açıklama |
|---------|----------|
| 🎯 **SDUI Motoru** | JSON dosyasından okunarak oluşturulan dinamik ve tamamen esnek arayüz |
| 🌗 **Dark/Light Tema** | `ui.json` içindeki `themes` bloğundan anlık tema değişimi |
| 💾 **AsyncStorage** | Kullanıcı verileri kalıcı olarak cihazda saklanır |
| 🤖 **Multi-Agent LLM** | 3 farklı kişilik (Eğlenceli, Rahat, Akademik) ile Google Gemini AI mentörlüğü |
| 📄 **Europass CV Üretici** | 9 soru formonu tamamlayan kullanıcı için ATS uyumlu CV metni üretilir |
| 🌐 **Gerçek İş İlanları** | Remotive.com API → Gemini AI Eşleştirme → SDUI Kart Render Pipeline'ı |
| 🔗 **Başvuru Linki** | İş ilanı kartındaki "Başvur" butonu gerçek ilan sayfasına yönlendirir |

---

## 🛠 Kurulum

### Gereksinimler
- Node.js >= 18
- npm veya yarn
- Google Gemini API Anahtarı (ücretsiz: [ai.google.dev](https://ai.google.dev))

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/aybukeet/naim.git
cd naim

# 2. Bağımlılıkları yükle
npm install

# 3. .env dosyası oluştur (API anahtarını yaz)
echo EXPO_PUBLIC_GEMINI_API_KEY=buraya_api_anahtarini_yaz > .env

# 4. Web için başlat
npm run web
```

> [!WARNING]
> `.env` dosyası Git'e yüklenmez (`.gitignore` ile korunmaktadır). Projeyi başka bir cihaza taşırken mutlaka yeni bir `.env` oluşturun!

---

## 🏗 Proje Yapısı

```
naim/
├── App.js                  # Ana uygulama motoru, tüm aksiyon yönetimi
├── ui.json                 # SDUI şeması — tüm ekranlar, butonlar, inputlar burada
├── components/
│   └── SDUIEngine.js       # JSON'u React Native bileşenlerine çeviren motor
├── services/
│   └── aiService.js        # Google Gemini API bağlantısı (mentor + CV + iş ilanı)
├── assets/                 # İterasyon ekran görüntüleri
├── .env                    # (Git'e yüklenmez!) API anahtarı
└── MOBILE.md               # 10 iterasyonluk detaylı geliştirme günlüğü
```

---

## 🔑 Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google AI Studio'dan alınan Gemini API anahtarı |

---

## 🌐 Kullanılan API'ler

| API | Kullanım |
|-----|----------|
| [Google Gemini](https://ai.google.dev) | Mentor sohbeti, CV üretimi, iş ilanı eşleştirme |
| [Remotive.com API](https://remotive.com/api) | Gerçek remote iş ilanları (ücretsiz, auth gerektirmez) |

---

## 📊 İterasyon Özeti

| # | Özellik | Ağırlık |
|---|---------|---------|
| 1 | Proje iskeleti (Expo + React Native Web) | 5 kg |
| 2 | SDUI Motoru — JSON → Arayüz | 25 kg |
| 3 | Çoklu Ekran & Navigasyon | 15 kg |
| 4 | Stitch Vibe Design → JSON Form | 10 kg |
| 5 | AsyncStorage Kalıcı Hafıza | 20 kg |
| 6 | Server-Driven Tema Motoru (Dark/Light) | 5 kg |
| 7 | İnteraktif Mentor Chat + Persona | 10 kg |
| 8 | Multi-Agent Google Gemini LLM | 25 kg |
| 9 | Europass ATS CV Üretici | 25 kg |
| 10 | Generative SDUI — Gerçek İş İlanları | 25 kg |
| | **TOPLAM** | **165 kg** |

---

## 👩‍💻 Geliştirici

**Aybüke** × **Antigravity AI Agent**  
MOBILE Challenge — 2026
