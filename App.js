import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import SDUIEngine from './components/SDUIEngine';
import uiData from './ui.json';

export default function App() {
  // Başlangıç ekranı 'home'
  const [currentScreen, setCurrentScreen] = useState('home');

  // JSON Motorundan gelen navigasyon veya aksiyon komutlarını dinler
  const handleAction = (action) => {
    if (action.type === 'NAVIGATE') {
      // Eğer hedef ekran JSON dosyamızda tanımlıysa oraya geçiş yap
      if (uiData.screens[action.target]) {
        setCurrentScreen(action.target);
      } else {
        alert("Hedef sayfa JSON içinde bulunamadı: " + action.target);
      }
    } else {
      alert("Bilinmeyen Aksiyon Türü!");
    }
  };

  // Şu anki sayfanın JSON düzenini al
  const currentLayout = uiData.screens[currentScreen];

  return (
    <SafeAreaView style={styles.container}>
      {currentLayout ? (
        <SDUIEngine layout={currentLayout} onAction={handleAction} />
      ) : null}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
