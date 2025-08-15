# 🚀 راهنمای کامل SEO و Google Search Console

## مرحله 1: Google Search Console Setup

### 1.1 ثبت‌نام و اضافه کردن سایت
1. وارد [Google Search Console](https://search.google.com/search-console) شوید
2. روی "Add Property" کلیک کنید
3. "URL prefix" را انتخاب کنید
4. آدرس `https://selphlyze.com` را وارد کنید
5. روی "Continue" کلیک کنید

### 1.2 تأیید مالکیت (Verification)
**روش 1 - HTML File Upload:**
1. فایل verification HTML را دانلود کنید
2. در پوشه `public/` پروژه قرار دهید
3. پس از deploy، لینک verification را کلیک کنید

**روش 2 - DNS Verification (پیشنهادی):**
1. TXT record ارائه شده را به DNS دامنه اضافه کنید
2. منتظر propagation بمانید (5-30 دقیقه)
3. روی "Verify" کلیک کنید

### 1.3 Submit کردن Sitemap
1. از منوی چپ "Sitemaps" را انتخاب کنید
2. URL زیر را وارد کنید: `sitemap.xml`
3. روی "Submit" کلیک کنید

## مرحله 2: Google Analytics Setup

### 2.1 ایجاد GA4 Property
1. وارد [Google Analytics](https://analytics.google.com) شوید
2. "Create Account" → "Create Property"
3. نام: "Selphlyze"
4. Country: Iran یا محل خدمات‌رسانی
5. Currency: USD یا IRR

### 2.2 اضافه کردن Tracking Code
```typescript
// app/layout.tsx اضافه کنید:
import Script from 'next/script'

// در head section:
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_TRACKING_ID');
  `}
</Script>
```

## مرحله 3: Bing Webmaster Tools

### 3.1 ثبت‌نام
1. وارد [Bing Webmaster Tools](https://www.bing.com/webmasters) شوید
2. "Add a site" کلیک کنید
3. `https://selphlyze.com` را وارد کنید

### 3.2 Submit Sitemap
1. از منو "Sitemaps" انتخاب کنید
2. `https://selphlyze.com/sitemap.xml` submit کنید

## مرحله 4: Social Media Optimization

### 4.1 Facebook/Meta
1. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. URL سایت را test کنید
3. "Scrape Again" برای refresh

### 4.2 Twitter/X
1. [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. URL سایت را test کنید

### 4.3 LinkedIn
1. [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
2. URL سایت را test کنید

## مرحله 5: Performance Monitoring

### 5.1 PageSpeed Insights
- [Test کنید](https://pagespeed.web.dev/)
- هدف: Core Web Vitals سبز

### 5.2 Schema Testing
- [Rich Results Test](https://search.google.com/test/rich-results)
- Schema markup ما را test کنید

## مرحله 6: بهینه‌سازی محتوا

### 6.1 کلمات کلیدی اصلی
- "AI psychology platform"
- "personality test online" 
- "emotional intelligence assessment"
- "behavioral analysis"
- "psychometric evaluation"

### 6.2 محتوای بلاگ (پیشنهادی)
1. "How AI is Revolutionizing Psychology"
2. "Understanding Your Personality Type"
3. "The Science Behind Emotional Intelligence"
4. "Digital Psychology vs Traditional Methods"

## مرحله 7: Local SEO (اختیاری)

### 7.1 Google My Business
- اگر دفتر فیزیکی دارید
- اطلاعات کامل وارد کنید

### 7.2 Schema Local Business
```json
{
  "@type": "ProfessionalService",
  "name": "Selphlyze",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IR"
  }
}
```

## Timeline انتظارات

### هفته 1-2:
- ✅ Search Console verification
- ✅ Sitemap submission
- ✅ Analytics setup

### هفته 2-4:
- 📈 اولین ایندکس‌های Google
- 📊 اولین داده‌های Analytics
- 🔍 ظاهر شدن در جستجوی برند

### ماه 2-3:
- 🎯 Ranking برای کلمات کلیدی target
- 📈 افزایش organic traffic
- 🔗 Backlink opportunities

## KPIs مهم برای پیگیری

1. **Search Console:**
   - Impressions
   - Clicks
   - Average Position
   - Coverage (Indexed pages)

2. **Analytics:**
   - Organic Sessions
   - Bounce Rate
   - Session Duration
   - Conversion Rate

3. **Technical:**
   - Core Web Vitals
   - Mobile Usability
   - Schema Errors

## نکات مهم

❗ **خیلی مهم:**
- Sitemap را هر ماه update کنید
- محتوای fresh اضافه کنید
- Mobile experience را بهینه نگه‌دارید
- Page speed روی < 3 ثانیه

🎯 **هدف‌گذاری:**
- ماه 1: 100+ organic clicks
- ماه 3: 500+ organic clicks  
- ماه 6: 2000+ organic clicks

## ابزارهای مفید

- **SEO:** Ahrefs, SEMrush, Ubersuggest
- **Analytics:** Google Analytics, Hotjar
- **Performance:** GTMetrix, WebPageTest
- **Schema:** Schema.org validator

---

✅ **سایت شما حالا کاملاً آماده ایندکس شدن است!**
