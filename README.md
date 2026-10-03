# Rexium Client - Rasmiy Sayt

Bu Rexium Client modifikatsiyasining rasmiy sayti. Sayt to'liq uzbek tilida va zamonaviy dizaynga ega.

## Xususiyatlar

- ✅ Foydalanuvchi autentifikatsiyasi (kirish/ro'yxatdan o'tish)
- ✅ Admin paneli
- ✅ Yangiliklar tizimi
- ✅ Sotib olish tizimi
- ✅ GitHub bilan sinxronizatsiya
- ✅ Xavfsiz shifrlash (Base64)
- ✅ To'liq uzbekcha interfeys
- ✅ Responsive dizayn

## O'rnatish

### 1. GitHub Repository yaratish

1. GitHub.com ga kiring
2. Yangi repository yarating: `rexium-client-data`
3. Repository ni private qiling (ma'lumotlar xavfsizligi uchun)
4. `main` branch yarating

### 2. GitHub Token olish

1. GitHub Settings > Developer settings > Personal access tokens
2. "Generate new token (classic)" tugmasini bosing
3. Quyidagi ruxsatlarni bering:
   - `repo` (to'liq ruxsat)
   - `user` (foydalanuvchi ma'lumotlari)
4. Token ni nusxalang (bir marta ko'rsatiladi!)

### 3. Saytni sozlash

`auth.js` faylini oching va quyidagilarni o'zgartiring:

```javascript
const GITHUB_OWNER = 'sizning_username'; // GitHub username
const GITHUB_REPO = 'rexium-client-data'; // Repository nomi
const GITHUB_TOKEN = 'sizning_token'; // Personal Access Token
```

### 4. GitHub Pages ni yoqish

1. Repository Settings > Pages
2. Source: "Deploy from a branch"
3. Branch: `main` / `root`
4. Save tugmasini bosing
5. Sayt manzili: `https://username.github.io/repository-name/`

### 5. Mod faylini yuklash

1. GitHub repository da `releases` bo'limini oching
2. "Create a new release" tugmasini bosing
3. Tag version: v3.0.14
4. Release title: Rexium Client 3.0.14
5. `rexium-client.jar` faylini yuklang
6. "Publish release" tugmasini bosing

## Admin Panel

### Kirish ma'lumotlari

- **Email:** negrkarlo@gmail.com
- **Parol:** azimjonuzbek

### Admin imkoniyatlari

1. **Yangiliklar boshqaruvi**
   - Yangi yangilik qo'shish
   - Yangilikni o'chirish

2. **Foydalanuvchilar boshqaruvi**
   - Barcha foydalanuvchilarni ko'rish
   - Foydalanuvchiga bepul ruxsat berish

## Xavfsizlik

### Ma'lumotlar shifrlash

- Parollar Base64 formatida saqlanadi
- Admin ma'lumotlari shifrlangan holatda kodda
- Foydalanuvchi ma'lumotlari GitHub da private repository ichida

### Private Repository

GitHub repository ni **private** qilishni unutmang! Bu foydalanuvchi ma'lumotlarini himoya qiladi.

## Foydalanish

### Oddiy foydalanuvchi

1. Saytga kiring
2. "Kirish" tugmasini bosing
3. Ro'yxatdan o'tish
4. Modni sotib olish ($9.99)
5. Yuklab olish

### Admin

1. Admin akkount bilan kiring
2. Admin panel avtomatik ochiladi
3. Yangiliklar va foydalanuvchilarni boshqaring

## Texnik ma'lumotlar

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Ma'lumotlar saqlash:** LocalStorage + GitHub API
- **Shifrlash:** Base64
- **Hosting:** GitHub Pages
- **Responsive:** Mobile-first dizayn

## Qo'shimcha sozlamalar

### Download Link ni o'zgartirish

`app.js` faylida `handleDownload` funksiyasini toping va download URL ni o'zgartiring:

```javascript
const downloadUrl = 'https://github.com/USERNAME/REPO/releases/latest/download/rexium-client.jar';
```

### Narxni o'zgartirish

`index.html` va `app.js` da `$9.99` ni kerakli narxga o'zgartiring.

## Muammolarni hal qilish

### GitHub sinxronizatsiya ishlamayapti

1. Token ruxsatlari to'g'riligini tekshiring
2. Repository private emasligini tasdiqlang
3. Browser console da xatolarni ko'ring

### Admin kirish ishlamayapti

1. Email va parol to'g'riligini tekshiring
2. LocalStorage tozalang va qayta urinib ko'ring
3. Browser console da xatolarni tekshiring

## Yangilanishlar

Yangilanishlarni GitHub Releases orqali tarqating:

1. Yangi versiya tayyorlash
2. GitHub Releases da yangi release yaratish
3. Mod faylini yuklash
4. Saytda yangilik e'lon qilish

## Litsenziya

© 2026 Rexium Client. Barcha huquqlar himoyalangan.

## Muallif

Bu sayt Rexium Client jamoasi tomonidan yaratilgan.
