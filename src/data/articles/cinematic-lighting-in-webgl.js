export const articleCinematicLightingInWebgl = {
  slug: 'cinematic-lighting-in-webgl',
  title: 'Cinematic Lighting Techniques for Web Browser Environments',
  titleFa: 'تکنیک‌های نورپردازی سینمایی در محیط‌های مرورگر و وب‌جی‌ال (WebGL)',
  date: 'JUL 2026',
  dateFa: 'تیر ۱۴۰۵',
  category: '3D Motion',
  categoryFa: 'انیمیشن و مووشن سه‌بعدی',
  readTime: '8 min read',
  readTimeFa: 'زمان مطالعه: ۸ دقیقه',
  excerpt: 'How to optimize shadow cascades and post-processing bloom without dropping frame rates on mobile devices.',
  excerptFa: 'چگونه سایه‌های زنجیره‌ای (Shadow Cascades) و افکت بلوم (Bloom) را در رندرینگ وب‌جی‌ال بهینه‌سازی کنیم بدون اینکه فریم‌ریت در موبایل افت کند.',
  coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  
  metaTitle: 'Cinematic Lighting in WebGL & WebGPU | SIAVASH Insights',
  metaTitleFa: 'نورپردازی سینمایی در WebGL و WebGPU | مقالات استودیو سیاوش',
  metaDescription: 'Techniques for optimizing shadow cascades, bloom post-processing, and specular accuracy while maintaining 60 FPS in browser environments.',
  metaDescriptionFa: 'تکنیک‌های بهینه‌سازی سایه‌های دینامیک، افکت‌های پست پروسس و رندرینگ سه‌بعدی رئال‌تایم با نرخ ۶۰ فریم در ثانیه در مرورگر.',
  keywords: [
    'WebGL', 
    'Cinematic Lighting', 
    '3D Motion', 
    'Shadow Cascades', 
    'GPU Optimization',
    'نورپردازی سینمایی',
    'رندرینگ سه‌بعدی',
    'انیمیشن سه‌بعدی',
    'رندر رئال‌تایم',
    'بهینه‌سازی وب‌جی‌ال'
  ],
  
  author: {
    name: 'SIAVASH Studio',
    nameFa: 'استودیو سیاوش',
    role: '3D Motion & Visual Engineering',
    roleFa: 'تیم انیمیشن سه‌بعدی و مهندسی بصری',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },

  content: [
    {
      type: 'lead',
      text: 'Creating cinematic atmospheres on the web demands balancing GPU memory budgets with rich lighting effects.',
      textFa: 'خلق فضاهای سینمایی و رندرینگ رئال‌تایم در وب نیازمند ایجاد تعادل بین مصرف حافظه کارت گرافیک (GPU) و افکت‌های نورپردازی سنگین است.'
    },
    {
      type: 'heading',
      text: '01. Shadow Cascades & Performance',
      textFa: '۰۱. سایه‌های زنجیره‌ای (Shadow Cascades) و عملکرد رندرینگ'
    },
    {
      type: 'paragraph',
      text: 'By restricting shadow cascades to key dynamic focal points, we maintain 60 FPS while preserving specular reflection accuracy.',
      textFa: 'با محدود کردن محاسبات سایه‌های زنجیره‌ای به نقاط کانون پویای صحنه، نرخ ۶۰ فریم بر ثانیه ثبت شده و دقت بازتاب‌های نور (Specular) به‌طور کامل حفظ می‌شود.'
    }
  ]
};