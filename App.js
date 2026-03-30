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

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: 'red', fontSize: 24, fontWeight: 'bold' }}>UI Çizim Hatası!</Text>
          <Text style={{ color: '#333', marginTop: 10 }}>{this.state.error?.message}</Text>
          <Text style={{ color: '#666', marginTop: 10, fontSize: 10 }}>Lütfen resmi Antigravity'ye raporla.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [profileData, setProfileData] = useState({});

  // Uygulama açıldığında cihaz hafızasından kayıtlı kariyer hedefini çeker.
  useEffect(() => {
    const loadMemory = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@careermate_profile');
        if (savedData !== null) {
          setProfileData(JSON.parse(savedData));
        }
      } catch (err) {
        console.error("Hafıza okuma hatası:", err);
      }
    };
    loadMemory();
  }, []);

  // UI Engine'den gelen aksiyonları dinliyoruz. formPayload içinde kullanıcının yazdıkları var.
  const handleAction = async (action, formPayload) => {
    if (action.type === 'NAVIGATE') {
      if (uiData.screens[action.target]) {
        setCurrentScreen(action.target);
      } else {
        alert("Hedef sayfa JSON içinde bulunamadı: " + action.target);
      }
    } 
    // 5. İterasyon: Veriyi cihaz hafızasına kaydet ve sayfayı değiştir
    else if (action.type === 'SAVE_PROFILE') {
      try {
        const newData = { ...profileData, ...formPayload };
        await AsyncStorage.setItem('@careermate_profile', JSON.stringify(newData));
        setProfileData(newData);
        
        alert("Harika! Kariyer hedefini hafızama kazıdım 🧠");
        
        // Kayıt başarılıysa hedefe git
        if (action.target && uiData.screens[action.target]) {
          setCurrentScreen(action.target);
        }
      } catch (err) {
        alert("Kaydetme Hatası: " + err.message);
      }
    } 
    else {
      alert("Bilinmeyen Aksiyon Türü!");
    }
  };

  const currentLayout = uiData.screens[currentScreen];

  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary>
        {currentLayout ? (
          <SDUIEngine 
            layout={currentLayout} 
            onAction={handleAction} 
            initialState={profileData} 
          />
        ) : (
          <Text>Sayfa Yükleniyor veya Bulunamadı...</Text>
        )}
      </ErrorBoundary>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
