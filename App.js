
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DetailScreen from './screens/DetailScreen';
import SavedScreen from './screens/SavedScreen';
import AboutScreen from './screens/AboutScreen';
import { themes } from './theme';

// Görev 19: API Query Parametresi
// limit=250, API'den en fazla 250 film ister.
const API_URL =
  'https://ghibliapi.vercel.app/films?limit=250';

const FILMS_KEY = 'ghibli_saved_films';
const THEME_KEY = 'ghibli_theme';
const SEARCH_KEY = 'ghibli_last_search';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen({
  navigation,
  colors,
  isDark,
  onToggleTheme,
}) {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState('');
  const [searchReady, setSearchReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortAZ, setSortAZ] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [gridMode, setGridMode] = useState(false);

  // Görev 29: Son aramayı yükle
  useEffect(() => {
    let active = true;

    const loadLastSearch = async () => {
      try {
        const storedSearch =
          await AsyncStorage.getItem(SEARCH_KEY);

        if (active && storedSearch !== null) {
          setSearch(storedSearch);
        }
      } catch (err) {
        console.log('Son arama yüklenemedi:', err);
      } finally {
        if (active) {
          setSearchReady(true);
        }
      }
    };

    loadLastSearch();

    return () => {
      active = false;
    };
  }, []);

  // Görev 29: Son aramayı kaydet
  useEffect(() => {
    if (!searchReady) return;

    AsyncStorage.setItem(
      SEARCH_KEY,
      search
    ).catch((err) => {
      console.log('Son arama kaydedilemedi:', err);
    });
  }, [search, searchReady]);

  // Görev 19: Parametreli API isteği
  const getFilms = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('API bağlantı hatası');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Geçersiz API verisi');
      }

      // Varyant A: 2000 ve öncesi
      const selected = data
        .filter((film) => {
          return Number(film.release_date) <= 2000;
        })
        .sort((a, b) => {
          return (
            Number(b.release_date) -
            Number(a.release_date)
          );
        });

      setFilms(selected);
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError ||
        String(err?.message || '')
          .toLowerCase()
          .includes('network request failed');

      setError(
        isNetworkError
          ? 'Bağlantı yok. İnternet bağlantını kontrol et.'
          : 'Filmler yüklenemedi. Lütfen tekrar dene.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFilms();
  }, []);

  const filteredFilms = films.filter((film) =>
    String(film.title || '')
      .toLocaleLowerCase('tr-TR')
      .includes(
        search.toLocaleLowerCase('tr-TR')
      )
  );

  const displayedFilms = [...filteredFilms];

  // Görev 18: Alfabetik sıralama
  if (sortAZ) {
    displayedFilms.sort((a, b) =>
      String(a.title || '').localeCompare(
        String(b.title || ''),
        'tr-TR'
      )
    );
  }

  // Görev 13: Orijinal diziyi değiştirmeden ters çevir
  if (reverseOrder) {
    displayedFilms.reverse();
  }

  const formatDuration = (minutes) => {
    const total = Number(minutes);

    if (!Number.isFinite(total)) {
      return 'Bilinmiyor';
    }

    return `${Math.floor(total / 60)} sa ${
      total % 60
    } dk`;
  };

  const openDetail = (film) => {
    navigation.getParent()?.navigate('Detail', {
      film,
    });
  };

  // Görev 1: Zebra satırlar
  const getRowColor = (index) => {
    if (index % 2 === 0) {
      return colors.card;
    }

    return isDark ? '#253247' : '#E8F0FA';
  };

  const renderFilm = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        gridMode && styles.gridCard,
        {
          backgroundColor: getRowColor(index),
          shadowColor: isDark
            ? '#000000'
            : '#334155',
        },
      ]}
      activeOpacity={0.7}
      onPress={() => openDetail(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} detayını aç`}
    >
      {/* Görev 14: Sıra numarası */}
      <View
        style={[
          styles.numberBadge,
          gridMode && styles.gridNumberBadge,
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

      {/* Görev 3 ve 10: Görsel */}
      {showImages &&
        (item.image ? (
          <Image
            source={{ uri: item.image }}
            style={[
              styles.poster,
              gridMode && styles.gridPoster,
            ]}
          />
        ) : (
          <View
            style={[
              styles.poster,
              styles.placeholder,
              gridMode && styles.gridPoster,
              {
                backgroundColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.placeholderLetter,
                { color: colors.text },
              ]}
            >
              {String(item.title || '?')
                .charAt(0)
                .toLocaleUpperCase('tr-TR')}
            </Text>
          </View>
        ))}

      <View
        style={[
          styles.filmInfo,
          gridMode && styles.gridFilmInfo,
          !showImages &&
            !gridMode &&
            styles.filmInfoWithoutImage,
        ]}
      >
        {/* Görev 2 ve 4: Başlık */}
        <Text
          style={[
            styles.filmTitle,
            gridMode && styles.gridFilmTitle,
            {
              color: isDark
                ? '#93C5FD'
                : '#1D4ED8',
            },
          ]}
          numberOfLines={gridMode ? 2 : 1}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>

        {/* Görev 2: Orijinal ad */}
        {!!item.original_title && (
          <Text
            style={[
              styles.originalTitle,
              gridMode && styles.gridOriginalTitle,
              {
                color: colors.secondary,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.original_title}
          </Text>
        )}

        <Text
          style={[
            styles.filmMeta,
            gridMode && styles.gridFilmMeta,
            { color: colors.secondary },
          ]}
        >
          Yayın yılı: {item.release_date}
        </Text>

        <Text
          style={[
            styles.filmMeta,
            gridMode && styles.gridFilmMeta,
            { color: colors.secondary },
          ]}
        >
          Süre: {formatDuration(item.running_time)}
        </Text>

        <Text
          style={[
            styles.score,
            gridMode && styles.gridScore,
            {
              color:
                Number(item.rt_score) >= 90
                  ? colors.green
                  : colors.secondary,
            },
          ]}
        >
          ★ {item.rt_score} / 100
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
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            🎬 Ghibli Arşivi
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondary },
            ]}
          >
            2000 ve Öncesi Filmler
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.themeButton,
            { backgroundColor: colors.card },
          ]}
          onPress={onToggleTheme}
          accessibilityRole="button"
        >
          <Text style={styles.themeIcon}>
            {isDark ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Görev 29: Kalıcı arama */}
      <View style={styles.searchRow}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder={
            searchReady
              ? 'Film ara...'
              : 'Arama yükleniyor...'
          }
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
          editable={searchReady}
          autoCorrect={false}
        />

        {search.length > 0 && (
          <TouchableOpacity
            style={[
              styles.clearButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSearch('')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.clearButtonText,
                { color: colors.text },
              ]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />

          <Text
            style={[
              styles.loadingText,
              { color: colors.secondary },
            ]}
          >
            Yükleniyor…
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <Text style={styles.errorIcon}>📡</Text>

          <Text
            style={[
              styles.error,
              { color: colors.danger },
            ]}
          >
            {error}
          </Text>

          <TouchableOpacity
            style={[
              styles.retry,
              { backgroundColor: colors.accent },
            ]}
            onPress={getFilms}
            accessibilityRole="button"
          >
            <Text
              style={{
                color: colors.accentText,
                fontWeight: 'bold',
              }}
            >
              Tekrar Dene
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.listToolbar}>
            <Text
              style={[
                styles.totalCount,
                { color: colors.secondary },
              ]}
            >
              Toplam {displayedFilms.length} kayıt
            </Text>

            <TouchableOpacity
              style={[
                styles.sortButton,
                {
                  backgroundColor: sortAZ
                    ? colors.accent
                    : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                setSortAZ((current) => !current)
              }
            >
              <Text
                style={[
                  styles.sortButtonText,
                  {
                    color: sortAZ
                      ? colors.accentText
                      : colors.text,
                  },
                ]}
              >
                {sortAZ ? '✓ A → Z' : 'A → Z'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Görev 8: Liste / Izgara */}
          <TouchableOpacity
            style={[
              styles.layoutButton,
              {
                backgroundColor: gridMode
                  ? colors.accent
                  : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              setGridMode((current) => !current)
            }
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.layoutButtonText,
                {
                  color: gridMode
                    ? colors.accentText
                    : colors.text,
                },
              ]}
            >
              {gridMode
                ? '☰ Liste Görünümü'
                : '▦ Izgara Görünümü'}
            </Text>
          </TouchableOpacity>

          {/* Görev 13: Sırayı ters çevir */}
          <TouchableOpacity
            style={[
              styles.reverseButton,
              {
                backgroundColor: reverseOrder
                  ? colors.accent
                  : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() =>
              setReverseOrder(
                (current) => !current
              )
            }
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.reverseButtonText,
                {
                  color: reverseOrder
                    ? colors.accentText
                    : colors.text,
                },
              ]}
            >
              {reverseOrder
                ? '↩ Normal Sıra'
                : '⇅ Sırayı Ters Çevir'}
            </Text>
          </TouchableOpacity>

          {/* Görev 10: Görselleri gizle / göster */}
          <View
            style={[
              styles.switchContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.switchLabel,
                { color: colors.text },
              ]}
            >
              🖼️ Film görsellerini göster
            </Text>

            <Switch
              value={showImages}
              onValueChange={setShowImages}
              trackColor={{
                false: colors.border,
                true: colors.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <FlatList
            key={gridMode ? 'grid-2' : 'list-1'}
            data={displayedFilms}
            numColumns={gridMode ? 2 : 1}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderFilm}
            extraData={{
              showImages,
              reverseOrder,
              sortAZ,
              isDark,
              gridMode,
            }}
            columnWrapperStyle={
              gridMode ? styles.gridRow : undefined
            }
            ItemSeparatorComponent={() => (
              <View
                style={[
                  styles.separator,
                  {
                    backgroundColor: gridMode
                      ? 'transparent'
                      : colors.border,
                  },
                ]}
              />
            )}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text
                style={[
                  styles.empty,
                  { color: colors.secondary },
                ]}
              >
                Sonuç bulunamadı.
              </Text>
            }
          />
        </>
      )}
    </View>
  );
}

function TabsScreen({
  savedFilms,
  onClearSaved,
  colors,
  isDark,
  onToggleTheme,
}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor:
          colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Filmler"
        options={{
          tabBarIcon: () => (
            <Text style={styles.tabIcon}>🎬</Text>
          ),
        }}
      >
        {(props) => (
          <HomeScreen
            {...props}
            colors={colors}
            isDark={isDark}
            onToggleTheme={onToggleTheme}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Favorilerim"
        options={{
          tabBarIcon: () => (
            <Text style={styles.tabIcon}>⭐</Text>
          ),
        }}
      >
        {(props) => (
          <SavedScreen
            {...props}
            savedFilms={savedFilms}
            onClearSaved={onClearSaved}
            colors={colors}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Hakkında"
        options={{
          tabBarIcon: () => (
            <Text style={styles.tabIcon}>ℹ️</Text>
          ),
        }}
      >
        {(props) => (
          <AboutScreen {...props} colors={colors} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [savedFilms, setSavedFilms] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [storageReady, setStorageReady] =
    useState(false);

  const colors = isDark
    ? themes.dark
    : themes.light;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedFilms, storedTheme] =
          await Promise.all([
            AsyncStorage.getItem(FILMS_KEY),
            AsyncStorage.getItem(THEME_KEY),
          ]);

        if (storedFilms !== null) {
          const parsedFilms = JSON.parse(storedFilms);

          if (Array.isArray(parsedFilms)) {
            setSavedFilms(parsedFilms);
          }
        }

        if (storedTheme === 'dark') {
          setIsDark(true);
        }
      } catch (err) {
        console.log('Kayıtlar yüklenemedi:', err);
      } finally {
        setStorageReady(true);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    AsyncStorage.setItem(
      FILMS_KEY,
      JSON.stringify(savedFilms)
    ).catch((err) => {
      console.log('Favoriler kaydedilemedi:', err);
    });
  }, [savedFilms, storageReady]);

  useEffect(() => {
    if (!storageReady) return;

    AsyncStorage.setItem(
      THEME_KEY,
      isDark ? 'dark' : 'light'
    ).catch((err) => {
      console.log('Tema kaydedilemedi:', err);
    });
  }, [isDark, storageReady]);

  // Görev 28: Kayıt tarihi ekle
  const toggleSave = (film) => {
    setSavedFilms((current) => {
      const exists = current.some(
        (item) => item.id === film.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== film.id
        );
      }

      return [
        ...current,
        {
          ...film,
          savedAt: new Date().toISOString(),
        },
      ];
    });
  };

  // Görev 27: Tüm favorileri temizle
  const clearSavedFilms = () => {
    setSavedFilms([]);
  };

  const toggleTheme = () => {
    setIsDark((current) => !current);
  };

  if (!storageReady) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />

        <Text
          style={{
            color: colors.text,
            marginTop: 12,
          }}
        >
          Uygulama hazırlanıyor...
        </Text>
      </View>
    );
  }

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark
        ? DarkTheme.colors
        : DefaultTheme.colors),
      primary: colors.accent,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />

      <Stack.Navigator
        screenOptions={{
          headerTintColor: colors.text,
          headerStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Tabs"
          options={{ headerShown: false }}
        >
          {(props) => (
            <TabsScreen
              {...props}
              savedFilms={savedFilms}
              onClearSaved={clearSavedFilms}
              colors={colors}
              isDark={isDark}
              onToggleTheme={toggleTheme}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Detail"
          options={({ route }) => ({
            title:
              route.params?.film?.title ||
              'Film Detayı',
          })}
        >
          {(props) => (
            <DetailScreen
              {...props}
              savedFilms={savedFilms}
              onToggleSave={toggleSave}
              colors={colors}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 65,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 14,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#64748B',
  },
  themeIcon: {
    fontSize: 24,
  },
  tabIcon: {
    fontSize: 21,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  clearButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  listToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortButton: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  layoutButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  layoutButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reverseButton: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  reverseButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  list: {
    paddingBottom: 30,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
  },
  gridCard: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    minHeight: 250,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  gridNumberBadge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginRight: 0,
  },
  numberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  poster: {
    width: 88,
    height: 88,
    borderRadius: 44,
    resizeMode: 'cover',
  },
  gridPoster: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderLetter: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  filmInfo: {
    flex: 1,
    paddingLeft: 15,
  },
  filmInfoWithoutImage: {
    paddingLeft: 6,
  },
  gridFilmInfo: {
    flex: 0,
    width: '100%',
    paddingLeft: 0,
    marginTop: 10,
    alignItems: 'center',
  },
  filmTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gridFilmTitle: {
    fontSize: 15,
    textAlign: 'center',
    minHeight: 38,
  },
  originalTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  gridOriginalTitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 6,
    width: '100%',
  },
  filmMeta: {
    fontSize: 14,
    marginBottom: 5,
  },
  gridFilmMeta: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 3,
  },
  score: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
  },
  gridScore: {
    fontSize: 13,
    marginTop: 3,
  },
  separator: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  error: {
    textAlign: 'center',
    marginBottom: 18,
    fontSize: 16,
    fontWeight: '600',
  },
  retry: {
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
  },
});
