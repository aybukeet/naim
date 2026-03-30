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
  const [themeName, setThemeName] = useState('light'); // ITERATION 6: TEMA

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
      if (uiData.screens[action.target]) {
        setCurrentScreen(action.target);
      }
    } 
    else if (action.type === 'SAVE_PROFILE') {
      const newData = { ...profileData, ...formPayload };
      await AsyncStorage.setItem('@careermate_profile', JSON.stringify(newData));
      setProfileData(newData);
      if (action.target && uiData.screens[action.target]) setCurrentScreen(action.target);
    } 
    else if (action.type === 'TOGGLE_THEME') {
      // ITERASYON 6: Temayı Değiştir
      const newTheme = themeName === 'light' ? 'dark' : 'light';
      setThemeName(newTheme);
      await AsyncStorage.setItem('@careermate_theme', newTheme);
    }
  };

  // SİHİRLİ SDUI THEME MOTORU: JSON İçindeki Renk Kodlarını Dinamik (Anlık) Değiştirir
  const getThemeInjectedLayout = () => {
    if (!uiData.screens[currentScreen]) return null;
    let layoutStr = JSON.stringify(uiData.screens[currentScreen]);
    
    // 1. Theme Değişkenleri Değiştir ($BG$ -> #1a1a2e)
    const currentTheme = uiData.themes[themeName] || uiData.themes['light'];
    for (const key in currentTheme) {
      layoutStr = layoutStr.split(key).join(currentTheme[key]);
    }

    // 2. Profil Verisi Değişkenleri Değiştir ($USER_HEDEF$ -> Girilen Metin)
    layoutStr = layoutStr.split('$USER_HEDEF$').join(profileData.career_goal || 'Henüz bir hedef girilmedi.');
    
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
