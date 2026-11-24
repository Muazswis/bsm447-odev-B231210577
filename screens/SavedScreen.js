
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function SavedScreen({
  navigation,
  savedFilms,
  onClearSaved,
  colors,
}) {
  // Görev 30: Varsayılan sıralama en yeni kayıt
  const [sortMode, setSortMode] = useState('recent');

  const formatSavedDate = (dateString) => {
    if (!dateString) {
      return 'Tarih bilgisi yok';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return 'Tarih bilgisi yok';
    }

    const pad = (number) =>
      String(number).padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `${day}.${month}.${year} ${hour}:${minute}`;
  };

  // Görev 30: Son kaydedilen en üstte
  // Görev 28: savedAt alanı üzerinden sıralama
  const sortedFilms = [...savedFilms].sort((a, b) => {
    if (sortMode === 'az') {
      return String(a.title || '').localeCompare(
        String(b.title || ''),
        'tr-TR'
      );
    }

    if (sortMode === 'za') {
      return String(b.title || '').localeCompare(
        String(a.title || ''),
        'tr-TR'
      );
    }

    const dateA = a.savedAt
      ? new Date(a.savedAt).getTime()
      : 0;

    const dateB = b.savedAt
      ? new Date(b.savedAt).getTime()
      : 0;

    const timeA = Number.isFinite(dateA)
      ? dateA
      : 0;

    const timeB = Number.isFinite(dateB)
      ? dateB
      : 0;

    // Büyük tarih değeri önce gelir
    return timeB - timeA;
  });

  // Sıralama türünü sırayla değiştir
  const changeSortMode = () => {
    setSortMode((current) => {
      if (current === 'recent') return 'az';
      if (current === 'az') return 'za';
      return 'recent';
    });
  };

  const getSortLabel = () => {
    if (sortMode === 'recent') {
      return '🕒 En Yeni';
    }

    if (sortMode === 'az') {
      return 'A → Z';
    }

    return 'Z → A';
  };

  const openDetail = (film) => {
    navigation.getParent()?.navigate('Detail', {
      film,
    });
  };

  // Görev 27: Tümünü silmeden önce onay
  const confirmClearSaved = () => {
    if (savedFilms.length === 0) {
      return;
    }

    Alert.alert(
      'Favorileri Sil',
      `Kaydedilen ${savedFilms.length} filmin tamamını silmek istediğine emin misin?`,
      [
        {
          text: 'Vazgeç',
          style: 'cancel',
        },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: onClearSaved,
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const renderFilm = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => openDetail(item)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} detayını aç`}
    >
      <View
        style={[
          styles.numberBadge,
          {
            backgroundColor: colors.accent,
          },
        ]}
      >
        <Text
          style={[
            styles.numberText,
            { color: colors.accentText },
          ]}
        >
          {index + 1}
        </Text>
      </View>

      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.poster}
        />
      ) : (
        <View
          style={[
            styles.poster,
            styles.placeholder,
            {
              backgroundColor: colors.border,
            },
          ]}
        >
          <Text style={styles.placeholderText}>
            🎬
          </Text>
        </View>
      )}

      <View style={styles.filmInfo}>
        <Text
          style={[
            styles.filmTitle,
            { color: colors.text },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        <Text
          style={[
            styles.filmMeta,
            { color: colors.secondary },
          ]}
        >
          Yayın yılı: {item.release_date}
        </Text>

        <Text
          style={[
            styles.filmMeta,
            { color: colors.secondary },
          ]}
        >
          ★ {item.rt_score} / 100
        </Text>

        <Text
          style={[
            styles.savedLabel,
            { color: colors.green },
          ]}
        >
          Kaydedildi ✓
        </Text>

        {/* Görev 28: Kaydetme tarihini göster */}
        <Text
          style={[
            styles.savedDate,
            { color: colors.secondary },
          ]}
        >
          📅 {formatSavedDate(item.savedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        ⭐ Favorilerim
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondary },
        ]}
      >
        Kaydettiğin Ghibli filmleri
      </Text>

      <View style={styles.toolbar}>
        <Text
          style={[
            styles.count,
            { color: colors.secondary },
          ]}
        >
          {savedFilms.length} kayıt
        </Text>

        {/* Görev 30: Sıralama seçenekleri */}
        <TouchableOpacity
          style={[
            styles.sortButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={changeSortMode}
          accessibilityRole="button"
          accessibilityLabel="Favori sıralamasını değiştir"
        >
          <Text
            style={[
              styles.sortText,
              { color: colors.text },
            ]}
          >
            {getSortLabel()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Görev 27: Tüm favorileri sil */}
      {savedFilms.length > 0 && (
        <TouchableOpacity
          style={[
            styles.clearButton,
            {
              borderColor: colors.danger,
              backgroundColor: colors.card,
            },
          ]}
          onPress={confirmClearSaved}
          accessibilityRole="button"
          accessibilityLabel="Bütün favorileri sil"
        >
          <Text
            style={[
              styles.clearText,
              { color: colors.danger },
            ]}
          >
            🗑️ Tümünü Sil
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={sortedFilms}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderFilm}
        contentContainerStyle={[
          styles.list,
          sortedFilms.length === 0 &&
            styles.emptyContainer,
        ]}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              ⭐
            </Text>

            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text },
              ]}
            >
              Henüz kayıt yok
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                { color: colors.secondary },
              ]}
            >
              Beğendiğin filmleri detay ekranından
              kaydedebilirsin.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 65,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },

  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  count: {
    fontSize: 14,
    fontWeight: '600',
  },

  sortButton: {
    borderWidth: 1,
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 10,
  },

  sortText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  clearButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 16,
  },

  clearText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  list: {
    paddingBottom: 35,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },

  numberBadge: {
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  poster: {
    width: 75,
    height: 95,
    borderRadius: 8,
  },

  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    fontSize: 28,
  },

  filmInfo: {
    flex: 1,
    paddingLeft: 13,
  },

  filmTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  filmMeta: {
    fontSize: 13,
    marginBottom: 5,
  },

  savedLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 5,
  },

  savedDate: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyState: {
    alignItems: 'center',
    padding: 24,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
