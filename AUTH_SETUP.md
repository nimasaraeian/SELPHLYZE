# 🔐 راهنمای نصب احراز هویت با Google و Facebook

## 📋 پیش‌نیازها

### 1. نصب پکیج‌های مورد نیاز
```bash
npm install next-auth @auth/core @auth/nextjs
```

### 2. ایجاد فایل Environment Variables
فایل `.env.local` را در ریشه پروژه ایجاد کنید (کپی از `env.example`):

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-change-this
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

**نکته مهم:** فایل `env.example` را به `.env.local` تغییر نام دهید و مقادیر واقعی را وارد کنید.

## 🚀 راه‌اندازی Google OAuth

### 1. ایجاد Google Cloud Project
1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. پروژه جدید ایجاد کنید یا پروژه موجود را انتخاب کنید
3. Google+ API را فعال کنید

### 2. ایجاد OAuth 2.0 Credentials
1. به بخش "Credentials" بروید
2. "Create Credentials" > "OAuth 2.0 Client IDs" را انتخاب کنید
3. Application type را "Web application" قرار دهید
4. Authorized redirect URIs را اضافه کنید:
   - `http://localhost:3000/api/auth/callback/google` (برای development)
   - `https://yourdomain.com/api/auth/callback/google` (برای production)

### 3. کپی کردن Client ID و Secret
- Client ID و Client Secret را کپی کرده و در `.env.local` قرار دهید

## 📘 راه‌اندازی Facebook OAuth

### 1. ایجاد Facebook App
1. به [Facebook Developers](https://developers.facebook.com/) بروید
2. "Create App" را کلیک کنید
3. نوع اپلیکیشن را "Consumer" انتخاب کنید

### 2. اضافه کردن Facebook Login
1. در داشبورد اپلیکیشن، "Add Product" را کلیک کنید
2. "Facebook Login" را انتخاب کنید
3. Platform را "Website" انتخاب کنید
4. Site URL را وارد کنید:
   - `http://localhost:3000` (برای development)
   - `https://yourdomain.com` (برای production)

### 3. تنظیم Valid OAuth Redirect URIs
در Facebook Login settings:
- `http://localhost:3000/api/auth/callback/facebook` (برای development)
- `https://yourdomain.com/api/auth/callback/facebook` (برای production)

### 4. کپی کردن App ID و App Secret
- App ID و App Secret را کپی کرده و در `.env.local` قرار دهید

## 🔧 تنظیمات NextAuth

### 1. فایل API Route
فایل `app/api/auth/[...nextauth]/route.ts` ایجاد شده است و شامل:
- Google Provider
- Facebook Provider
- JWT و Session callbacks
- Custom sign-in logic

### 2. SessionProvider
در `app/layout.tsx` اضافه شده است تا session ها در کل اپلیکیشن در دسترس باشند.

### 3. کامپوننت SocialLoginButtons
کامپوننت `components/SocialLoginButtons.tsx` شامل:
- دکمه‌های ورود با Google و Facebook
- مدیریت session
- نمایش اطلاعات کاربر
- دکمه خروج

## 🎯 نحوه استفاده

### 1. در صفحات Login
```tsx
import SocialLoginButtons from '@/components/SocialLoginButtons';

<SocialLoginButtons 
  onSuccess={(user) => {
    console.log('Login successful:', user);
    router.push('/dashboard');
  }}
/>
```

### 2. بررسی وضعیت ورود
```tsx
import { useSession } from 'next-auth/react';

const { data: session, status } = useSession();

if (status === "loading") {
  return <div>Loading...</div>;
}

if (session) {
  return <div>Welcome {session.user.name}!</div>;
}
```

### 3. خروج از حساب
```tsx
import { signOut } from 'next-auth/react';

const handleSignOut = () => {
  signOut({ callbackUrl: '/' });
};
```

## 🚨 نکات مهم

### 1. امنیت
- `NEXTAUTH_SECRET` را حتماً تغییر دهید
- از HTTPS در production استفاده کنید
- Client Secret ها را در کد قرار ندهید

### 2. Redirect URIs
- حتماً URIs صحیح را در Google و Facebook تنظیم کنید
- برای production، دامنه اصلی را اضافه کنید

### 3. Testing
- ابتدا در localhost تست کنید
- سپس در production deploy کنید

## 🔍 عیب‌یابی

### مشکل: "Invalid redirect_uri"
- URIs در Google/Facebook را بررسی کنید
- دامنه‌ها را مطابقت دهید
- حتماً `http://localhost:3000/api/auth/callback/google` را اضافه کنید

### مشکل: "Client ID not found"
- فایل `.env.local` را بررسی کنید
- سرور را restart کنید
- از `env.example` کپی کنید و به `.env.local` تغییر نام دهید

### مشکل: "OAuth consent screen"
- Google+ API را فعال کنید
- OAuth consent screen را تنظیم کنید
- App را از حالت "Testing" خارج کنید

### مشکل: "Redirect loop"
- `NEXTAUTH_URL` را درست تنظیم کنید
- `callbackUrl` در `signIn` را بررسی کنید
- سرور را restart کنید

### مشکل: "Provider not found"
- NextAuth را درست نصب کنید
- `npm install next-auth` را اجرا کنید
- SessionProvider را در layout اضافه کنید

## 📚 منابع بیشتر

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
