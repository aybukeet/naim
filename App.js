import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
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

  const handleAction = (action) => {
    if (action.type === 'NAVIGATE') {
      if (uiData.screens[action.target]) {
        setCurrentScreen(action.target);
      } else {
        alert("Hedef sayfa JSON içinde bulunamadı: " + action.target);
      }
    } else {
      alert("Bilinmeyen Aksiyon Türü!");
    }
  };

  const currentLayout = uiData.screens[currentScreen];

  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary>
        {currentLayout ? (
          <SDUIEngine layout={currentLayout} onAction={handleAction} />
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
