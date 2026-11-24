
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function SavedScreen({
  navigation,
  savedFilms,
  colors,
}) {
  const [sortOrder, setSortOrder] = useState('AZ');

  const openDetail = (film) => {
    navigation.getParent()?.navigate('Detail', { film });
  };

  // Favorileri orijinal diziyi değiştirmeden sırala
  const sortedFilms = [...savedFilms].sort((a, b) => {
    const result = a.title.localeCompare(b.title, 'tr-TR');
    return sortOrder === 'AZ' ? result : -result;
  });

  const renderFilm = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card },
      ]}
      activeOpacity={0.7}
      onPress={() => openDetail(item)}
    >
      <View
        style={[
          styles.numberBadge,
          { backgroundColor: colors.accent },
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
            styles.posterPlaceholder,
            { backgroundColor: colors.border },
          ]}
        >
          <Text style={{ fontSize: 32 }}>🎬</Text>
        </View>
      )}

      <View style={styles.filmInfo}>
        <Text
          style={[
            styles.filmTitle,
            { color: colors.text },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        <Text
          style={[
            styles.filmYear,
            { color: colors.secondary },
          ]}
        >
          Yayın yılı: {item.release_date}
        </Text>

        <Text
          style={[
            styles.filmYear,
            { color: colors.secondary },
          ]}
        >
          ⭐ Puan: {item.rt_score} / 100
        </Text>

        <Text
          style={[
            styles.savedText,
            { color: colors.danger },
          ]}
        >
          ❤️ Kaydedildi
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        ❤️ Kaydedilenler
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondary },
        ]}
      >
        {savedFilms.length} film kaydedildi
      </Text>

      <View style={styles.sortRow}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            {
              backgroundColor:
                sortOrder === 'AZ'
                  ? colors.accent
                  : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSortOrder('AZ')}
          accessibilityRole="button"
          accessibilityState={{
            selected: sortOrder === 'AZ',
          }}
        >
          <Text
            style={[
              styles.sortButtonText,
              {
                color:
                  sortOrder === 'AZ'
                    ? colors.accentText
                    : colors.text,
              },
            ]}
          >
            A → Z
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortButton,
            {
              backgroundColor:
                sortOrder === 'ZA'
                  ? colors.accent
                  : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setSortOrder('ZA')}
          accessibilityRole="button"
          accessibilityState={{
            selected: sortOrder === 'ZA',
          }}
        >
          <Text
            style={[
              styles.sortButtonText,
              {
                color:
                  sortOrder === 'ZA'
                    ? colors.accentText
                    : colors.text,
              },
            ]}
          >
            Z → A
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedFilms}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderFilm}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤍</Text>

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
                styles.emptyText,
                { color: colors.secondary },
              ]}
            >
              Filmler sekmesinden bir film seçip
              Kaydet butonuna basabilirsin.
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },

  sortRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },

  sortButton: {
    minWidth: 110,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },

  sortButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  list: {
    paddingBottom: 30,
    flexGrow: 1,
  },

  card: {
    flexDirection: 'row',
    borderRadius: 14,
    marginBottom: 12,
    padding: 10,
    alignItems: 'center',
  },

  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  poster: {
    width: 90,
    height: 125,
    borderRadius: 8,
  },

  posterPlaceholder: {
    width: 90,
    height: 125,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  filmInfo: {
    flex: 1,
    paddingLeft: 15,
  },

  filmTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  filmYear: {
    fontSize: 14,
    marginBottom: 7,
  },

  savedText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
  },
});
