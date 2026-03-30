import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import SDUIEngine from './components/SDUIEngine';
import uiData from './ui.json'; // JSON modelini veritabanı gibi içeri aktarıyoruz

export default function App() {
  // Uygulamanın bütün karmaşık yapısı SDUIEngine içine atıldı.
  // App.js sadece o anki ekranı çizmekle yükümlü.
  return (
    <SafeAreaView style={styles.container}>
      <SDUIEngine layout={uiData.screen} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // JSON'da tanımlanmamışsa default arkaplan
  },
});
