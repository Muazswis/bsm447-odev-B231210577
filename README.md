
# 🎬 Ghibli Arşivi

BSM447 Mobil Uygulama Geliştirme - Dönem Projesi

## Öğrenci Bilgileri

- Ad Soyad: Muaz Swis
- Öğrenci Numarası: B231210577
- Konu: K23 - Ghibli Arşivi
- Varyant: a - 2000 ve öncesi filmler
- Ek Kural: 7 - Kalıcı Karanlık/Aydınlık Tema

## Proje Hakkında

Ghibli Arşivi, React Native ve Expo ile geliştirilmiş bir mobil film arşivi uygulamasıdır.

Studio Ghibli API üzerinden alınan filmler arasından 2000 ve öncesinde yayımlananlar listelenir. Kullanıcılar film arayabilir, ayrıntıları inceleyebilir ve favorilerine kaydedebilir.

## Uygulama Özellikleri

- Studio Ghibli API üzerinden film verilerini çekme
- 2000 ve öncesi filmleri filtreleme
- Film adına göre arama
- Film detaylarını görüntüleme
- Yönetmen, yıl, süre, puan ve açıklama bilgileri
- Süreyi saat ve dakika olarak gösterme
- 90 ve üzeri puanlar için yeşil etiket
- Favorilere ekleme ve çıkarma
- Kaydedilenler ekranı
- AsyncStorage ile kalıcı favoriler
- Kalıcı karanlık ve aydınlık tema

## Kullanılan Teknolojiler

- React Native
- Expo
- JavaScript
- React Navigation (Stack ve Bottom Tabs)
- AsyncStorage
- Fetch API
- FlatList

## API

https://ghibliapi.vercel.app/films

## Ekran Görüntüleri

### Film Listesi

![Film Listesi](screenshots/liste.png)

### Film Detayı

![Film Detayı](screenshots/detay.png)

### Kaydedilenler

![Kaydedilenler](screenshots/kaydedilenler.png)

## Kurulum

Bağımlılıkları yüklemek için:

    npm install

Uygulamayı başlatmak için:

    npx expo start

## Android APK

Android APK, Expo EAS Build ile oluşturulmuş ve Android telefonda test edilmiştir.

- Sürüm: 1.0.0
- Build profili: preview
- Durum: Succeeded

[APK indirme sayfası](https://expo.dev/accounts/muazswis/projects/b231210577-ghibli/builds/a7a1bec6-4448-46c3-bfd3-6d73cdd3a631)

## Tanıtım Videosu

Uygulamanın film listesi, detay, favoriler ve tema değiştirme özelliklerini gösteren 60 saniyeden kısa video hazırlanmıştır.

Video bağlantısı: [GitHub Release bağlantısı eklenecek]

## GitHub

https://github.com/Muazswis/bsm447-odev-B231210577

## Geliştirici

Muaz Swis - B231210577
