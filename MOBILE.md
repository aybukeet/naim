# 📱 MOBILE.md — NAIM Evolution Log

> This file is your autoresearch log. Every iteration gets documented here.
> No log = no lift. No lift = no weight.

---

## 🧬 Identity

**NAIM Name:** `CareerMate AI`  
**Crew:** `Aybüke & Antigravity (Agent)`  
**App Concept:** `Kullanıcının profilini anlayan, CV oluşturan ve iş ilanları sunan yapay zeka kariyer mentoru.`  
**Starting Tool:** `Antigravity`

---

## 📊 Scoreboard

| Metric | Value |
|--------|-------|
| Total Iterations | 0 |
| Total Weight (kg) | 0 |
| Total Time (min) | 0 |
| Failed Attempts | 0 |

---

## 🔁 Iterations

### 🏋️ Iteration 1

| Field | Value |
|-------|-------|
| Feature | `React Native / Expo proje iskeletinin oluşturulması` |
| Weight | `5 kg` |
| Tool Used | `Antigravity` |
| Time | `15 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
naim klasörüne projemizi kurarak başlayalım hazırsan
```

**What happened:**
- Başlangıçtaki klasör çakışması (MOBILE.md'den dolayı) geçici bir kurulum yapıp dosyaları taşıyarak çözüldü.
- **Hata:** `npm run web` komutu "blank" template React Native Web paketi barındırmadığı için hata verdi.
- **Çözüm:** AI, `npx expo install react-dom react-native-web @expo/metro-runtime` çalıştırarak sorunu anında fark edip Web paketlerini kurdu. Bu, Antigravity'nin bir eksiği (blank template web detayını unutması) olarak rapora altın değerinde bir geri bildirim oldu!

**Screenshot:** 📸 Lütfen terminalde `npm run web` çalıştırıp ilk ekranı Screenshot alarak `assets/iter1.png` adıyla kaydet.

**Commit:** `[NAIM: CareerMate] Iterasyon 1: Proje iskeleti - 5kg`

---

### 🏋️ Iteration 2

| Field | Value |
|-------|-------|
| Feature | `Server-Driven UI (JSON Yorumlayıcı/Motoru Tasarımı) - Boss Level` |
| Weight | `25 kg` |
| Tool Used | `Antigravity` |
| Time | `15 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
şimdi sırada 2. iterasyonumuz olan json okutup çizmeye yarayan yorumlayıcı motoru yazmaya geldi hemen kodlayalım bende kontrol etmek için bekliyorum
```

**What happened:**
- Harika bir "vibe design -> vibe code" örneği olarak, sabit sayfa tasarımı tamamen bırakıldı. Sadece `ui.json` diye bir şablon ve `SDUIEngine` isminde bu şablonu algılayan dinamik bir Parser yazıldı. Ekranda görünen mavi "Teste Başla" butonu bile koda değil direkt JSON objesine bakılarak çizildi. Agentic mantığın zirve yaptığı aşama!

**Screenshot:** 📸 Lütfen terminalde `npm run web` çalıştırıp gelen dinamik JSON arayüzünü Screenshot alarak `assets/iter2.png` adıyla kaydet.

**Commit:** `[NAIM: CareerMate] Iterasyon 2: SDUI Engine ve JSON mimarisi - 25kg`

---

### 🏋️ Iteration 3

| Field | Value |
|-------|-------|
| Feature | `Dinamik Navigasyon Sistemi (Multi-screen JSON)` |
| Weight | `15 kg` |
| Tool Used | `Antigravity` |
| Time | `15 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
tamamdır sayfalar arası geçişe geçebiliriz şimdi doğru ilerliyoruz gibi görünüyor
```

**What happened:**
- `ui.json` dosyası büyütülerek içine `screens` objesi eklendi. "home", "profile", "chat" adında 3 farklı ekran yaratıldı. `App.js` sadece bu ekranlar arası state değişimi için güncellendi, her ekranın içeriği ve düğmeler JSON'da tanımlı olan `"action": { "type": "NAVIGATE", "target": "profile" }` komutlarıyla SDUI Engine üzerinden aktarıldı.

**Screenshot:** 📸 Lütfen terminalde Web uygulamanı yenileyip, butonlardan birine basarak sayfalar arası geçişi test et. Gittiğin yeni ekranın fotoğrafını `assets/iter3.png` adıyla kaydet.

**Commit:** `[NAIM: CareerMate] Iterasyon 3: JSON ile Dinamik Navigasyon - 15kg`

---

### 🏋️ Iteration 4

| Field | Value |
|-------|-------|
| Feature | `Stitch Design -> JSON Motoruna Enjeksiyon! (Form / Input)` |
| Weight | `10 kg` |
| Tool Used | `Stitch & Antigravity (Vibe Code)` |
| Time | `15 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
(Google Stitch'den HTML/CSS Çıktısı alındı ve Antigravity'e gönderildi)
```

**What happened:**
- Harika bir "vibe design -> vibe code" pipeline senaryosu çalıştırıldı! Kullanıcı tasarımı kodlama vs bilmeden yalnızca Stitch üzerinden tasarlayıp Antigravity'ye attı. 
- Antigravity, **hiçbir React Native kodu yazmadan**, sadece `SDUIEngine.js` içindeki yorumlayıcıya `container` ve `textInput` desteği ekledi ve ardından o koca neo-brutal/glassmorphism tasarımı sadece JSON verisi `ui.json` yazarak yarattı. İç içe elemanları render edebilmek için algoritma Recursive (Özyinelemeli) hale getirildi.

**Screenshot:** 📸 Lütfen terminalde arayüzü yenile, Ana Ekrandan Profil'e geç, oluşan harika formu Screenshot alarak `assets/iter4.png` adıyla kaydet.

**Commit:** `[NAIM: CareerMate] Iterasyon 4: Stitch Vibe Code ve JSON Form - 10kg`

---

### 🏋️ Iteration 5

| Field | Value |
|-------|-------|
| Feature | `Local Storage Entegrasyonu ve Hafıza Logiği (SDUI)` |
| Weight | `20 kg` |
| Tool Used | `Antigravity` |
| Time | `15 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
sırada 5. iterasyon var local storage kodlayacağız hazırsan hata yakalamak için burdayım
```

**What happened:**
- `@react-native-async-storage/async-storage` kütüphanesi yüklendi.
- `ui.json` kodundaki hedef form alanına (Input) `career_goal` adında bir `id` verildi. JSON'daki Gönder (Mentörle Tanış) butonunun görevi `"NAVIGATE"` yerine `"SAVE_PROFILE"` olarak ayarlandı.
- `SDUIEngine.js` formu içindeki veriyi anlık `useState` ile toplayıp tuşa basıldığında Parent yapı olan `App.js` dosyasına ulaştırma özelliğine kavuştu.
- `App.js` form payload verisini yakaladı, `AsyncStorage`'a kaydetti ve sayfayı değiştirdi. Uygulama baştan açıldığında formun içindeki yazılar otomatik olarak veritabanından çekilip JSON motoruna verildi.

**Screenshot:** 📸 Formu doldurup Mentor sayfasından tekrar form sayfasına geldiğinde yazıların kaybolmadığını veya kaydetildiğinde çalışan uyarı ekranını ekran görüntüsü al (`assets/iter5.png`).

**Commit:** `[NAIM: CareerMate] Iterasyon 5: AsyncStorage ile Kalıcı Hafıza - 20kg`

---

### 🏋️ Iteration 6

| Field | Value |
|-------|-------|
| Feature | `Server-Driven Theme Engine (Dark/Light) ve Tüm Ekran Tasarımları` |
| Weight | `5 kg` |
| Tool Used | `Antigravity` |
| Time | `10 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
iterasyon 6 için koyu modu ayarlayalım ve diğer sayfalalrın tasarımını da aynı düzlemde bitirelim
```

**What happened:**
- `ui.json` kodunun en üstüne `"themes"` objesi eklendi ve içine `light` ile `dark` temalarının renk paleti (CSS değişkeni mantığıyla `$BG$`, `$TEXT$` gibi) yerleştirildi.
- Bütün ekranların (`home`, `chat`) arayüzleri, Stitch üzerinden tasarlanmış o premium Glassmorphism ile birebir uyumlu hale getirildi. 
- Ana Ekrana (`home`) "Gece/Gündüz Modu" butonu eklenip buna `"TOGGLE_THEME"` aksiyonu bağlandı.
- `App.js` içerisine **Sihirli SDUI Theme Motoru** yazıldı. JSON dosyasındaki `$BG$` gibi komutlar anlık olarak ortam temasına göre devredilip React Native'e geçiriliyor.
- Ekstra olarak; Mentor (`chat`) ekranında `$USER_HEDEF$` adında bir etiket sayesinde, bir önceki aşamada Cihaz Hafızasına (Local Storage) kaydedilen metnin oraya anlık yazdırılması sağlandı!

**Screenshot:** 📸 Lütfen Web tarayıcısında Ana Ekrandaki Gece/Gündüz Modu (`TOGGLE_THEME`) butonuna basıp ekranı Koyu Mod'a (Dark Mode) geçir ve o premium Gece Modunun ekran görüntüsünü al (`assets/iter6.png`).

**Commit:** `[NAIM: CareerMate] Iterasyon 6: Server-Driven Gece Modu ve UI Polishing - 5kg`

---

### 🏋️ Iteration 7

| Field | Value |
|-------|-------|
| Feature | `Çoklu Persona'ya Sahip İnteraktif Mentor Sohbet Arayüzü` |
| Weight | `10 kg` |
| Tool Used | `Antigravity` |
| Time | `15 min` |
| Attempts | `1` |
| Status | ✅ Success |

**Prompt given to AI:**
```
sırada 7. iterasyon var mentorle sohbet ekranı tasarlayalımm mentorun kişiliği seçilebilir olucaktı
```

**What happened:**
- `ui.json` koduna Chat (Sohbet) sayfası için özel bir ara katman (Header, Avatar, Mesaj Kutuları) yazıldı.
- `App.js` içerisine **Persona State** özelliği getirildi (Yoda, Elon Musk, Kurumsal CEO). 
- **JSON Mesaj Enjeksiyonu:** JSON'daki `$HEDEF$` tag'leri cihaz hafızasından gelen asıl kariyer hedefiyle, Avatar resimleri de seçilen karaktere göre değiştirilerek ekrana "canlı" olarak yansıtıldı.
- `SDUIEngine.js` kullanıcının mesaj attığı anda klavyeyi/input'u temizlemesi için programlandı (Aksiyon type: `SEND_MESSAGE`).
- Sohbet ekranında sahte (mock) AI bekleme süresi ve role göre (user/ai) değişen Neo-brutal renkli baloncuklar tasarlandı. Bu sayede JSON tamamen interaktif, hareketli bir AI uygulamasına dönüştü.

**Screenshot:** 📸 Mentor ekranına gir, Yoda veya Elon Musk butonlarından birine tıkla, giriş yazısının `$HEDEF$`ine göre değiştiğini gör! Bir mesaj yolla (Sana mock bir cevap verecek), bu şık sohbet pencereni Ss al (`assets/iter7.png`).

**Commit:** `[NAIM: CareerMate] Iterasyon 7: Etkileşimli SDUI Chat ve Persona Modeli - 10kg`

---

### 🏋️ Iteration 8 (Boss Level)

| Field | Value |
|-------|-------|
| Feature | `Multi-Agent Google Gemini AI Entegrasyonu (LLM)` |
| Weight | `25 kg` |
| Tool Used | `Antigravity` |
| Time | `30 min` |
| Attempts | `4` |
| Status | ✅ Success |

**Prompt given to AI:**
```
yapay zekanın şimdi multi agentlarla sorularıma cevap üretmesi için yeni adımı kodlayalım
```

**What happened:**
- `@google/generative-ai` kütüphanesi projeye dahil edildi.
- `.env` gizli dosyası oluşturuldu ve Google AI Studio üzerinden alınan anahtar projeye gömüldü. Arayüz tarafında yanlışlıkla `JSON.parse` çökmesini (Tırnaklar, satırlar vb.) önlemek adına Güvenli String Çevirici (SafeString Regex) yazıldı.
- `services/aiService.js` yazıldı. İçerisinde `academic`, `fun` ve `relaxed` adında 3 farklı Ajan için özel Sistem Komutları (System Prompts) tanımlandı.
- API'ye bağlantı yetki hatalarıyla çakıştığı için (**404**, **503 High Demand** ve **429 Quota**) sürekli zeka savaşı yaşandı. Sistemin 8192 token sınırına vurması veya yarım cümlenin ortasında boğulması engellendi. En son **gemini-flash-latest** modeli üzerinde %100 saf API bağlantısı optimize edildi ve AI'nin geçmiş form hedefini otomatik anlayarak mükemmel tavsiyeler (Yol Haritaları vb.) harfiyen kesilmeden çalıştırıldı.
- API Anahtarı GitHub'da çalınmasın diye `.gitignore` temizlendi.

**Screenshot:** 📸 Yapay Zeka ajanının o şahane, sonuna kadar anlattığı Yol Haritası metnini gösteren bir ekran görüntüsü (`assets/iter8.png`).

**Commit:** `[NAIM: CareerMate] Iterasyon 8: Boss Level - Gerçek LLM ve Multi-Agent Sistemi - 25kg`

---

### 🎓 Iteration 9 (Boss Level II)

| Field | Value |
|-------|-------|
| Feature | `Europass ATS CV Üretici (AI Document Generation)` |
| Weight | `25 kg` |
| Tool Used | `Antigravity` |
| Time | `20 min` |
| Attempts | `3` |
| Status | ✅ Success |

**Prompt given to AI:**
```
geldik artık sonlara cv üretme kısmına belirli sorular yöneltip aldığı cevaplarla ats europass uyumlu cv oluşturan kısmı yazalımm
```

**What happened:**
- `ui.json` dosyasına `cv_form` (Kullanıcı Veri Girişi) ve `cv_result` (AI Çıktısı) adında devasa ve karmaşık iki yeni ekran eklendi.
- `App.js` içerisine **GENERATE_CV_ACTION** entegre edildi. Kullanıcı formu yolladığında geçici yükleniyor mesajı basılarak AI çağrısı asenkron yapıldı.
- `services/aiService.js` içerisine `generateEuropassCV` adında çok özel bir **Sistem Promptu** kullanan yeni bir fonksiyon eklendi ve AI'a saf "İnsan Kaynakları Uzmanı" rolü verildi.

**Screenshot:** 📸 Hazırlanan efsanevi ATS Europass CV'sini gösteren ekran görüntüsü (`assets/iter9.png`).

**Commit:** `[NAIM: CareerMate] Iterasyon 9: Europass ATS CV Generator Modülü - 25kg`

---

## 🧠 Reflection (fill at the end)

**Hardest part:**
> (Doldurulacak)

**What AI did well:**
> (Doldurulacak)

**Where AI failed:**
> (Doldurulacak)

**If I started over, I would:**
> (Doldurulacak)

**Best feature I built:**
> (Doldurulacak)

**Biggest surprise:**
> (Doldurulacak)
