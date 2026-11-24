
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function DetailScreen({
  route,
  savedFilms,
  onToggleSave,
  colors,
}) {
  const { film } = route.params;

  // Görev 11: Açıklamanın açık/kapalı durumu
  const [showFullDescription, setShowFullDescription] =
    useState(false);

  const isSaved = savedFilms.some(
    (item) => item.id === film.id
  );

  const formatDuration = (minutes) => {
    const total = Number(minutes);
    return `${Math.floor(total / 60)} sa ${total % 60} dk`;
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      {film.image ? (
        <Image
          source={{ uri: film.image }}
          style={styles.image}
        />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={{ fontSize: 60 }}>🎬</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          {film.title}
        </Text>

        {!!film.original_title && (
          <Text
            style={[
              styles.originalTitle,
              { color: colors.secondary },
            ]}
          >
            {film.original_title}
          </Text>
        )}

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.info,
              { color: colors.secondary },
            ]}
          >
            🎬 Yönetmen: {film.director}
          </Text>

          {!!film.producer && (
            <Text
              style={[
                styles.info,
                { color: colors.secondary },
              ]}
            >
              🎞️ Yapımcı: {film.producer}
            </Text>
          )}

          <Text
            style={[
              styles.info,
              { color: colors.secondary },
            ]}
          >
            📅 Yayın Yılı: {film.release_date}
          </Text>

          <Text
            style={[
              styles.info,
              { color: colors.secondary },
            ]}
          >
            ⏱ Süre: {formatDuration(film.running_time)}
          </Text>

          <Text
            style={[
              styles.info,
              { color: colors.secondary },
            ]}
          >
            ⭐ Puan: {film.rt_score} / 100
          </Text>

          {Number(film.rt_score) >= 90 && (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.greenBackground },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: colors.green },
                ]}
              >
                ★ Yüksek Puanlı Film
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: isSaved
                ? colors.green
                : colors.accent,
            },
          ]}
          onPress={() => onToggleSave(film)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={
            isSaved
              ? 'Kaydedildi, kaydı kaldır'
              : 'Filmi kaydet'
          }
        >
          <Text
            style={[
              styles.saveButtonText,
              {
                color: isSaved
                  ? '#FFFFFF'
                  : colors.accentText,
              },
            ]}
          >
            {isSaved
              ? 'Kaydedildi ✓'
              : '🤍 Kaydet'}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.heading,
            { color: colors.text },
          ]}
        >
          Film Açıklaması
        </Text>

        {/* Görev 11: Açıklamayı 3 satıra kısalt */}
        <Text
          style={[
            styles.description,
            { color: colors.secondary },
          ]}
          numberOfLines={
            showFullDescription ? undefined : 3
          }
          ellipsizeMode="tail"
        >
          {film.description || 'Açıklama bulunamadı.'}
        </Text>

        {/* Görev 11: Devamını göster / Gizle */}
        {!!film.description && (
          <TouchableOpacity
            style={[
              styles.descriptionButton,
              { backgroundColor: colors.card },
            ]}
            onPress={() =>
              setShowFullDescription((current) => !current)
            }
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.descriptionButtonText,
                { color: colors.accent },
              ]}
            >
              {showFullDescription
                ? 'Gizle ▲'
                : 'Devamını göster ▼'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 35,
  },

  image: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
  },

  imagePlaceholder: {
    width: '100%',
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  originalTitle: {
    fontSize: 16,
    marginBottom: 20,
  },

  infoCard: {
    padding: 18,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 20,
  },

  info: {
    fontSize: 16,
    marginBottom: 12,
  },

  badge: {
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },

  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },

  saveButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    lineHeight: 26,
  },

  descriptionButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 14,
  },

  descriptionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
