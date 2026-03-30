import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SDUIEngine from './components/SDUIEngine';
import uiData from './ui.json';

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
  
  // ITERATION 7: SOHBET STATE'LERİ
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
    }
    // ITERASYON 7: SOHBET AKSİYONLARI
    else if (action.type === 'SET_PERSONA') {
      setPersona(action.value);
      // Karakter değişince karşılama mesajını sıfırla
      let greeting = 'Merhaba, ben profesyonel mentörün.';
      if (action.value === 'fun') greeting = 'Hey dostum! Hedefine ($HEDEF$) bayıldım. Birlikte çok eğlenip harika işler çıkaracağız! Ne sormak istiyorsun?';
      if (action.value === 'relaxed') greeting = 'Selam. Hedefin ($HEDEF$) fena durmuyor. Hiç acele etmeden, tadını çıkararak adım adım ilerleyelim. Nasıl yardımcı olayım?';
      if (action.value === 'academic') greeting = 'Merhaba. Belirttiğiniz ($HEDEF$) hedefinin gerçekleştirilmesi için yapılandırılmış, akademik bir eğitim rotası şarttır. Konuyu detaylandırabilir miyiz?';
      
      setMessages([{ id: Date.now(), role: 'ai', text: greeting }]);
    }
    else if (action.type === 'SEND_MESSAGE') {
      if (!formPayload.chat_input || formPayload.chat_input.trim() === '') return;
      
      const userMessage = { id: Date.now(), role: 'user', text: formPayload.chat_input };
      setMessages(prev => [...prev, userMessage]);
      
      // Şimdilik Sahte AI Yanıtı (Iterasyon 8'de geçek LLM olacak)
      setTimeout(() => {
        const aiMessage = { 
          id: Date.now() + 1, 
          role: 'ai', 
          text: persona === 'fun' ? 'Hahaha harikasın! Hadi durma denemeye devam!' : (persona === 'relaxed' ? 'Tamamdır, yarın bakarız o işe.' : 'Lütfen araştırma metodolojinizi geliştiriniz.')
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const getThemeInjectedLayout = () => {
    if (!uiData.screens[currentScreen]) return null;
    
    // 1. JSON Şablonunu al (Deep Layout)
    const baseLayout = JSON.parse(JSON.stringify(uiData.screens[currentScreen]));

    // 2. Chat Ekranındaysak, Mesajları JSON'a Dinamik (Çocuk) Olarak Enjekte Et!
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

    // 3. Stringify & Değişken Taraması
    let layoutStr = JSON.stringify(baseLayout);
    
    // Tema Kodları
    const currentTheme = uiData.themes[themeName] || uiData.themes['light'];
    for (const key in currentTheme) {
      layoutStr = layoutStr.split(key).join(currentTheme[key]);
    }

    // Persona ve Veri Etiketleri ($MENTOR_AVATAR$, $USER_HEDEF$)
    let avatarName = 'Zihin Mentoru'; let avatarIcon = '🤖';
    if (persona === 'fun') { avatarName = 'Eğlenceli Mentör'; avatarIcon = '🥳'; }
    if (persona === 'relaxed') { avatarName = 'Rahat Mentör'; avatarIcon = '😎'; }
    if (persona === 'academic') { avatarName = 'Akademik Mentör'; avatarIcon = '🎓'; }

    layoutStr = layoutStr.split('$MENTOR_TYPE_TEXT$').join(avatarName);
    layoutStr = layoutStr.split('$MENTOR_AVATAR$').join(avatarIcon);
    
    // AI mesajları içerisindeki $HEDEF$ etiketini, cihaz hafızasından gelen amaçla doldur
    const userGoal = profileData.career_goal ? profileData.career_goal.substring(0, 30) + '...' : 'bilinmeyen hedef';
    layoutStr = layoutStr.split('$HEDEF$').join(userGoal);
    
    return JSON.parse(layoutStr);
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
