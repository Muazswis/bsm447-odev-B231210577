
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

  // Görev 11: Açıklamayı genişletme
  const [showFullDescription, setShowFullDescription] =
    useState(false);

  // Görev 7: Beğeni sayacı
  const [likeCount, setLikeCount] = useState(0);

  const isSaved = savedFilms.some(
    (item) => item.id === film.id
  );

  const formatDuration = (minutes) => {
    const total = Number(minutes);
    return `${Math.floor(total / 60)} sa ${total % 60} dk`;
  };

  // Görev 5: İki sütunlu bilgi
  const renderInfoRow = (label, value) => (
    <View
      style={[
        styles.infoRow,
        { borderBottomColor: colors.border },
      ]}
    >
      <Text
        style={[
          styles.infoLabel,
          { color: colors.secondary },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.infoValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );

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
          {renderInfoRow(
            '🎬 Yönetmen',
            film.director || 'Bilinmiyor'
          )}

          {!!film.producer &&
            renderInfoRow(
              '🎞️ Yapımcı',
              film.producer
            )}

          {renderInfoRow(
            '📅 Yayın Yılı',
            film.release_date || 'Bilinmiyor'
          )}

          {renderInfoRow(
            '⏱ Süre',
            formatDuration(film.running_time)
          )}

          {renderInfoRow(
            '⭐ Puan',
            `${film.rt_score} / 100`
          )}

          {/* Görev 22: API'den yeni alan */}
          {!!film.original_title_romanised &&
            renderInfoRow(
              '🌸 Latin Harfleriyle',
              film.original_title_romanised
            )}

          {Number(film.rt_score) >= 90 && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    colors.greenBackground,
                },
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

        {/* Görev 7: Beğeni sayacı */}
        <View
          style={[
            styles.likeContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() =>
              setLikeCount((current) => current + 1)
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Beğeni sayısını artır"
          >
            <Text style={styles.likeIcon}>
              ❤️
            </Text>

            <Text
              style={[
                styles.likeButtonText,
                { color: colors.text },
              ]}
            >
              Beğen
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.likeCount,
              { color: colors.accent },
            ]}
          >
            {likeCount} beğeni
          </Text>
        </View>

        {/* Favorilere kaydet */}
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

        {/* Görev 11: İlk üç satır */}
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
          {film.description ||
            'Açıklama bulunamadı.'}
        </Text>

        {!!film.description && (
          <TouchableOpacity
            style={[
              styles.descriptionButton,
              { backgroundColor: colors.card },
            ]}
            onPress={() =>
              setShowFullDescription(
                (current) => !current
              )
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

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  infoLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    marginRight: 12,
  },

  infoValue: {
    flex: 1.25,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
  },

  badge: {
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 14,
  },

  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },

  likeIcon: {
    fontSize: 25,
    marginRight: 10,
  },

  likeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  likeCount: {
    fontSize: 17,
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
