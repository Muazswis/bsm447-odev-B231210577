
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
import { themes } from './theme';

const API_URL = 'https://ghibliapi.vercel.app/films';
const FILMS_KEY = 'ghibli_saved_films';
const THEME_KEY = 'ghibli_theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen({ navigation, colors, isDark, onToggleTheme }) {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      const selected = data
        .filter((film) => Number(film.release_date) <= 2000)
        .sort(
          (a, b) =>
            Number(b.release_date) - Number(a.release_date)
        );

      setFilms(selected);
    } catch (err) {
      setError('Filmler yüklenemedi. İnterneti kontrol et.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFilms();
  }, []);

  const filteredFilms = films.filter((film) =>
    film.title.toLocaleLowerCase('tr-TR').includes(
      search.toLocaleLowerCase('tr-TR')
    )
  );

  const formatDuration = (minutes) => {
    const total = Number(minutes);
    return `${Math.floor(total / 60)} sa ${total % 60} dk`;
  };

  const openDetail = (film) => {
    navigation.getParent()?.navigate('Detail', { film });
  };

  const clearSearch = () => {
    setSearch('');
  };

  // Görev 14: FlatList index ile sıra numarası gösterme
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
            styles.poster,
            styles.placeholder,
            { backgroundColor: colors.border },
          ]}
        >
          <Text style={styles.placeholderIcon}>🎬</Text>
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
          Süre: {formatDuration(item.running_time)}
        </Text>

        <Text
          style={[
            styles.score,
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
        { backgroundColor: colors.background },
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
          accessibilityLabel={
            isDark
              ? 'Aydınlık temaya geç'
              : 'Karanlık temaya geç'
          }
        >
          <Text style={styles.themeIcon}>
            {isDark ? '☀️' : '🌙'}
          </Text>
        </TouchableOpacity>
      </View>

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
          placeholder="Film ara..."
          placeholderTextColor={colors.secondary}
          value={search}
          onChangeText={setSearch}
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
            onPress={clearSearch}
            accessibilityRole="button"
            accessibilityLabel="Aramayı temizle"
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
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      ) : error ? (
        <View>
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
          {/* Görev 15: Filtrelenmiş toplam kayıt sayısı */}
          <Text
            style={[
              styles.totalCount,
              { color: colors.secondary },
            ]}
          >
            Toplam {filteredFilms.length} kayıt
          </Text>

          <FlatList
            data={filteredFilms}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderFilm}
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
  colors,
  isDark,
  onToggleTheme,
}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Filmler"
        options={{
          tabBarIcon: () => (
            <Text style={{ fontSize: 22 }}>🎬</Text>
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
        name="Kaydedilenler"
        options={{
          tabBarIcon: () => (
            <Text style={{ fontSize: 22 }}>❤️</Text>
          ),
        }}
      >
        {(props) => (
          <SavedScreen
            {...props}
            savedFilms={savedFilms}
            colors={colors}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [savedFilms, setSavedFilms] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  const colors = isDark ? themes.dark : themes.light;

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
    ).catch((err) =>
      console.log('Favoriler kaydedilemedi:', err)
    );
  }, [savedFilms, storageReady]);

  useEffect(() => {
    if (!storageReady) return;

    AsyncStorage.setItem(
      THEME_KEY,
      isDark ? 'dark' : 'light'
    ).catch((err) =>
      console.log('Tema kaydedilemedi:', err)
    );
  }, [isDark, storageReady]);

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

      return [...current, film];
    });
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
              colors={colors}
              isDark={isDark}
              onToggleTheme={toggleTheme}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Detail"
          options={{ title: 'Film Detayı' }}
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

  totalCount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    marginLeft: 2,
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    borderRadius: 14,
    marginBottom: 12,
    padding: 10,
    alignItems: 'center',
  },

  // Görev 14: Sıra numarası tasarımı
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

  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderIcon: {
    fontSize: 32,
  },

  filmInfo: {
    flex: 1,
    paddingLeft: 15,
  },

  filmTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  filmMeta: {
    fontSize: 14,
    marginBottom: 5,
  },

  score: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 5,
  },

  error: {
    textAlign: 'center',
    margin: 15,
  },

  retry: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: 20,
  },
});
