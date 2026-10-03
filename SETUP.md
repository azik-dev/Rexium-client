# Rexium Client Saytini O'rnatish Bo'yicha Qo'llanma

## 1-Qadam: GitHub Repository yaratish

### Repository yaratish

1. GitHub.com ga kiring
2. O'ng yuqori burchakda "+" belgisini bosing
3. "New repository" ni tanlang
4. Repository ma'lumotlari:
   - **Repository name:** `rexium-client-data`
   - **Description:** Rexium Client foydalanuvchi ma'lumotlari
   - **Visibility:** **Private** (muhim!)
   - README.md qo'shmaslik kerak
5. "Create repository" tugmasini bosing

### Repository sozlamalari

1. Settings > General
2. "Features" bo'limida Issues va Projects ni o'chirib qo'yish mumkin
3. "Danger Zone" da "Change repository visibility" ni tekshiring (Private bo'lishi kerak)

## 2-Qadam: Personal Access Token olish

### Token yaratish

1. GitHub profilingizga o'ting
2. Settings > Developer settings > Personal access tokens > Tokens (classic)
3. "Generate new token (classic)" tugmasini bosing
4. Token ma'lumotlari:
   - **Note:** `Rexium Client Website`
   - **Expiration:** No expiration (yoki 1 yil)
   - **Select scopes:**
     - ✅ `repo` (to'liq ruxsat)
     - ✅ `user:email` (email o'qish)
5. "Generate token" tugmasini bosing
6. **MUHIM:** Token ni nusxalang va xavfsiz joyda saqlang (bir marta ko'rsatiladi!)

## 3-Qadam: Sayt fayllarini sozlash

### auth.js faylini tahrirlash

`auth.js` faylini oching va quyidagilarni o'zgartiring:

```javascript
// 4-5 qatorlar
const GITHUB_OWNER = 'sizning_username'; // GitHub username ni yozing
const GITHUB_REPO = 'rexium-client-data'; // Repository nomini tasdiqlang
const GITHUB_TOKEN = 'ghp_xxxxxxxxxxxxxxxxxxxx'; // Token ni joylashtiring
```

**Misol:**
```javascript
const GITHUB_OWNER = 'johndoe';
const GITHUB_REPO = 'rexium-client-data';
const GITHUB_TOKEN = 'ghp_1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R';
```

### app.js faylini tahrirlash

`app.js` faylida download URL ni o'zgartiring (140-qator):

```javascript
const downloadUrl = 'https://github.com/USERNAME/REPO/releases/latest/download/rexium-client.jar';
```

**Misol:**
```javascript
const downloadUrl = 'https://github.com/johndoe/rexium-client/releases/latest/download/rexium-client.jar';
```

## 4-Qadam: Saytni GitHub Pages ga joylashtirish

### Yangi repository yaratish (sayt uchun)

1. GitHub da yana bir repository yarating:
   - **Name:** `rexium-client` (yoki `username.github.io`)
   - **Visibility:** Public
   - README.md qo'shmaslik
2. "Create repository" tugmasini bosing

### Fayllarni yuklash

#### Variant 1: GitHub Web Interface orqali

1. Repository sahifasida "uploading an existing file" ni bosing
2. Barcha sayt fayllarini tanlang:
   - `index.html`
   - `style.css`
   - `auth.js`
   - `app.js`
   - `README.md`
3. "Commit changes" tugmasini bosing

#### Variant 2: Git orqali (agar Git o'rnatilgan bo'lsa)

```bash
cd C:\Users\User\Desktop\DeltaClient-main\sayt
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/rexium-client.git
git push -u origin main
```

### GitHub Pages ni yoqish

1. Repository > Settings > Pages
2. **Source:** "Deploy from a branch"
3. **Branch:** `main` / root
4. "Save" tugmasini bosing
5. 1-2 daqiqa kuting
6. Sahifa yangilangan joyda sayt URL ko'rinadi: `https://username.github.io/rexium-client/`

## 5-Qadam: Mod faylini yuklash

### Release yaratish

1. Rexium Client repository da (sayt repository)
2. "Releases" bo'limiga o'ting
3. "Create a new release" tugmasini bosing
4. Release ma'lumotlari:
   - **Choose a tag:** `v3.0.14` (yangi tag yaratish)
   - **Release title:** `Rexium Client 3.0.14`
   - **Description:**
     ```
     # Rexium Client 3.0.14
     
     ## Yangiliklar
     - To'liq uzbekcha interfeys
     - Zamonaviy dizayn
     - Ko'plab yangi funksiyalar
     
     ## Yuklab olish
     Yuklab olish uchun quyidagi faylni tanlang.
     ```
5. "Attach binaries" bo'limida mod jar faylini yuklang
6. **MUHIM:** Fayl nomi `rexium-client.jar` bo'lishi kerak
7. "Publish release" tugmasini bosing

## 6-Qadam: Saytni tekshirish

### Asosiy funksiyalarni test qilish

1. Sayt URL ni oching: `https://username.github.io/rexium-client/`
2. **Admin kirish:**
   - "Kirish" tugmasini bosing
   - Email: `negrkarlo@gmail.com`
   - Parol: `azimjonuzbek`
   - Admin panel paydo bo'lishi kerak
3. **Yangilik qo'shish:**
   - Admin panelda yangilik qo'shing
   - Sahifani yangilang
   - Yangilik ko'rinishi kerak
4. **Ro'yxatdan o'tish:**
   - Chiqish qiling
   - Yangi akkount yarating
   - Kirish qiling
5. **Yuklab olishni test qilish:**
   - "Yuklab olish" tugmasini bosing
   - "Sotib olish kerak" xabari ko'rinishi kerak
   - "Sotib olish" tugmasini bosing
   - Tasdiqlash
   - Yuklab olish tugmasi ishlashi kerak

## Muammolarni hal qilish

### Sayt ochilmayapti

**Sabab:** GitHub Pages hali faollashmagan
**Yechim:** 5-10 daqiqa kuting, keyin sahifani yangilang

### Admin kirish ishlamayapti

**Sabab 1:** LocalStorage ma'lumotlari buzilgan
**Yechim:** Browser DevTools > Application > LocalStorage > Clear

**Sabab 2:** Email/parol noto'g'ri
**Yechim:** Email va parolni to'g'ri kiriting

### GitHub sinxronizatsiya ishlamayapti

**Sabab 1:** Token xato
**Yechim:** `auth.js` da token to'g'riligini tekshiring

**Sabab 2:** Repository nomi xato
**Yechim:** `GITHUB_OWNER` va `GITHUB_REPO` to'g'riligini tekshiring

**Sabab 3:** Token ruxsati yetarli emas
**Yechim:** Yangi token yarating va `repo` ruxsatini bering

### Yuklab olish ishlamayapti

**Sabab 1:** Release yaratilmagan
**Yechim:** 5-qadam bo'yicha release yarating

**Sabab 2:** Fayl nomi noto'g'ri
**Yechim:** Fayl nomini `rexium-client.jar` ga o'zgartiring

**Sabab 3:** URL xato
**Yechim:** `app.js` da download URL ni to'g'rilang

## Xavfsizlik bo'yicha tavsiyalar

1. ✅ `rexium-client-data` repository ni **Private** qiling
2. ✅ GitHub Token ni hech kimga ko'rsatmang
3. ✅ Token ni kodda qoldiring (GitHub Pages uchun xavfsiz)
4. ✅ Muntazam ravishda ma'lumotlarni backup qiling
5. ⚠️ Token ni public repository ga yuklMANG!

## Qo'shimcha

### Custom Domain qo'shish (ixtiyoriy)

Agar o'z domeningiz bo'lsa:

1. Repository > Settings > Pages
2. "Custom domain" ga domen nomini kiriting
3. DNS sozlamalarida CNAME yozuvini qo'shing:
   ```
   CNAME  www  username.github.io
   ```
4. "Enforce HTTPS" ni yoqing

### SSL/HTTPS

GitHub Pages avtomatik HTTPS ni yoqadi. Siz hech narsa qilishingiz shart emas.

## Yordam

Agar muammo yechilmasa:
1. Browser Console ni tekshiring (F12 > Console)
2. GitHub Actions logs ni ko'ring
3. README.md faylini qaytadan o'qing

---

**Muvaffaqiyatli o'rnatish!** 🎉
