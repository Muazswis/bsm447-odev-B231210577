
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

export default function AboutScreen({ colors }) {
  const details = [
    ['Öğrenci', 'Muaz Swis'],
    ['Öğrenci Numarası', 'B231210577'],
    ['Ders', 'BSM447 Mobil Uygulama Geliştirme'],
    ['Proje', 'K23 – Ghibli Arşivi'],
    ['Varyant', 'a – 2000 ve Öncesi Filmler'],
    ['Ek Kural', '7 – Kalıcı Açık/Koyu Tema'],
    ['Uygulama Sürümü', '1.0.1'],
    ['Teknoloji', 'React Native + Expo'],
    ['Veri Kaynağı', 'Studio Ghibli API'],
  ];
  

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>🎬</Text>

        <Text
          style={[styles.title, { color: colors.text }]}
        >
          Ghibli Arşivi
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.secondary },
          ]}
        >
          BSM447 Dönem Projesi
        </Text>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card },
        ]}
      >
        {details.map(([label, value], index) => (
          <View
            key={label}
            style={[
              styles.row,
              {
                borderBottomColor: colors.border,
                borderBottomWidth:
                  index === details.length - 1 ? 0 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: colors.secondary },
              ]}
            >
              {label}
            </Text>

            <Text
              style={[
                styles.value,
                { color: colors.text },
              ]}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={[
          styles.footer,
          { color: colors.secondary },
        ]}
      >
        Sakarya Üniversitesi · 2026–2027 Güz
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  row: {
    paddingVertical: 15,
  },
  label: {
    fontSize: 13,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 13,
  },
});
