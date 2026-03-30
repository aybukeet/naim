import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SDUIEngine from './components/SDUIEngine';
import uiData from './ui.json';
import { generateMentorResponse, generateEuropassCV } from './services/aiService';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: 'red', fontSize: 24, fontWeight: 'bold' }}>UI Çizim Hatası!</Text>
          <Text style={{ color: '#333', marginTop: 10 }}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [profileData, setProfileData] = useState({});
  const [themeName, setThemeName] = useState('light');
  
  const [persona, setPersona] = useState('academic');
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Hedefini ($HEDEF$) inceledim. Sana nasıl yardım edebilirim Akademi Öğrencisi?' }
  ]);

  useEffect(() => {
    const loadMemory = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@careermate_profile');
        if (savedData !== null) setProfileData(JSON.parse(savedData));
        const savedTheme = await AsyncStorage.getItem('@careermate_theme');
        if (savedTheme !== null) setThemeName(savedTheme);
      } catch (err) { console.error("Hafıza hatası:", err); }
    };
    loadMemory();
  }, []);

  const handleAction = async (action, formPayload) => {
    if (action.type === 'NAVIGATE') {
      if (uiData.screens[action.target]) setCurrentScreen(action.target);
    } 
    else if (action.type === 'SAVE_PROFILE') {
      const newData = { ...profileData, ...formPayload };
      await AsyncStorage.setItem('@careermate_profile', JSON.stringify(newData));
      setProfileData(newData);
      if (action.target && uiData.screens[action.target]) setCurrentScreen(action.target);
    } 
    else if (action.type === 'TOGGLE_THEME') {
      const newTheme = themeName === 'light' ? 'dark' : 'light';
      setThemeName(newTheme);
      await AsyncStorage.setItem('@careermate_theme', newTheme);
    } else if (action.type === 'GENERATE_CV_ACTION') {
      setCurrentScreen('cv_result');
      
      // Form verilerini yedekle ve Yükleniyor durumunu geçici CV metni yap
      const currentProfileData = { ...profileData, ...formPayload, europass_cv: "Yapay zeka verilerini analiz edip sana özel o ATS uyumlu kusursuz CV'yi yazıyor.\n\nLütfen formu terk etmeden 10-15 saniye kadar bekle! 🚀..." };
      setProfileData(currentProfileData);
      
      // AI'ın donmasını engellemek için isteği hafif bir bekleme ile yolla
      setTimeout(async () => {
         const generatedCV = await generateEuropassCV(formPayload);
         const finalProfile = { ...currentProfileData, europass_cv: generatedCV };
         await AsyncStorage.setItem('@careermate_profile', JSON.stringify(finalProfile));
         setProfileData(finalProfile);
      }, 500);

    }
    else if (action.type === 'SET_PERSONA') {
      setPersona(action.value);
      let greeting = 'Merhaba, ben profesyonel mentörün.';
      if (action.value === 'fun') greeting = 'Hey dostum! Hedefine ($HEDEF$) bayıldım. Birlikte çok eğlenip harika işler çıkaracağız! Ne sormak istiyorsun?';
      if (action.value === 'relaxed') greeting = 'Selam. Hedefin ($HEDEF$) fena durmuyor. Hiç acele etmeden, tadını çıkararak adım adım ilerleyelim. Nasıl yardımcı olayım?';
      if (action.value === 'academic') greeting = 'Merhaba. Belirttiğiniz ($HEDEF$) hedefinin gerçekleştirilmesi için yapılandırılmış, akademik bir eğitim rotası şarttır. Konuyu detaylandırabilir miyiz?';
      
      setMessages([{ id: Date.now(), role: 'ai', text: greeting }]);
    }
    else if (action.type === 'SEND_MESSAGE') {
      if (!formPayload.chat_input || formPayload.chat_input.trim() === '') return;
      
      const userMessage = { id: Date.now(), role: 'user', text: formPayload.chat_input };
      const waitMessage = { id: Date.now() + 1, role: 'ai', text: 'Yapay Zeka (LLM) Düşünüyor...' };
      
      // Kullanıcı mesajını ve yükleniyor ibaresini anında ekle
      setMessages(prev => [...prev, userMessage, waitMessage]);

      const goal = profileData.career_goal || "Bilinmiyor";
      // O anki gerçek geçmiş mesajları temizlemeden aiService'ye gönder (Loading'i dahil etme)
      const messageHistory = messages.filter(m => m.id !== waitMessage.id && m.text !== waitMessage.text);
      
      // ITERATION 8: GERÇEK API ÇAĞRISI
      try {
        const aiResponseText = await generateMentorResponse(persona, goal, messageHistory, formPayload.chat_input);
        
        // Loading mesajını bulup, gerçeğiyle değiştir
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== waitMessage.id);
          return [...filtered, { id: Date.now() + 2, role: 'ai', text: aiResponseText }];
        });
      } catch (e) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== waitMessage.id);
          return [...filtered, { id: Date.now() + 2, role: 'ai', text: "(Sunucu Hatası: Geri dönüş alınamadı)" }];
        });
      }
    }
  };

  const getThemeInjectedLayout = () => {
    if (!uiData.screens[currentScreen]) return null;
    
    const baseLayout = JSON.parse(JSON.stringify(uiData.screens[currentScreen]));

    if (currentScreen === 'chat') {
      const chatHistoryContainer = baseLayout.elements.find(e => e.id === 'chatHistory');
      if (chatHistoryContainer) {
        chatHistoryContainer.children = messages.map(msg => ({
          type: "container",
          id: `msg_${msg.id}`,
          style: {
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.role === 'user' ? '$CHAT_BUBBLE_USER$' : '$CHAT_BUBBLE_AI$',
            padding: 15,
            borderRadius: 20,
            borderBottomRightRadius: msg.role === 'user' ? 0 : 20,
            borderBottomLeftRadius: msg.role === 'ai' ? 0 : 20,
            marginBottom: 10,
            maxWidth: '85%',
            borderWidth: 1, borderColor: '$BORDER$'
          },
          children: [
            { type: "text", content: msg.text, style: { fontSize: 16, color: msg.role === 'user' ? '$PRIMARY_TXT$' : '$TEXT$' } }
          ]
        }));
      }
    }

    let layoutStr = JSON.stringify(baseLayout);
    
    // Uygulama Teması Değişken Taraması
    const currentTheme = uiData.themes[themeName] || uiData.themes['light'];
    for (const key in currentTheme) {
      layoutStr = layoutStr.split(key).join(currentTheme[key]);
    }

    let avatarName = 'Zihin Mentoru'; let avatarIcon = '🤖';
    if (persona === 'fun') { avatarName = 'Eğlenceli Mentör'; avatarIcon = '🥳'; }
    if (persona === 'relaxed') { avatarName = 'Rahat Mentör'; avatarIcon = '😎'; }
    if (persona === 'academic') { avatarName = 'Akademik Mentör'; avatarIcon = '🎓'; }

    layoutStr = layoutStr.split('$MENTOR_TYPE_TEXT$').join(avatarName);
    layoutStr = layoutStr.split('$MENTOR_AVATAR$').join(avatarIcon);
    
    const userGoal = profileData.career_goal ? profileData.career_goal.substring(0, 50) + '...' : 'bilinmeyen hedef';
    
    // CV Oluşturucu Regex (Hataların json parse etmesini önle)
    const europassText = profileData.europass_cv ? profileData.europass_cv : "Henüz bir CV üretilmedi.";
    const safeEuropassText = europassText.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    layoutStr = layoutStr.split('$EUROPASS_CV_TEXT$').join(safeEuropassText);
    
    // JSON.parse() çökmesini önlemek için kullanıcı girdisini güvenli hale getiriyoruz (Tırnak ve Alt Satır koruması)
    const safeUserGoal = userGoal.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    layoutStr = layoutStr.split('$HEDEF$').join(safeUserGoal);
    
    try {
      return JSON.parse(layoutStr);
    } catch (e) {
      console.error("JSON Çizim Hatası:", e, " \n\n Sorunlu string:", layoutStr);
      return null;
    }
  };

  const currentLayout = getThemeInjectedLayout();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: uiData.themes[themeName]['$BG$'] }}>
      <ErrorBoundary>
        {currentLayout ? (
          <SDUIEngine 
            layout={currentLayout} 
            onAction={handleAction} 
            initialState={profileData} 
          />
        ) : (
          <Text>Yükleniyor...</Text>
        )}
      </ErrorBoundary>
      <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}
