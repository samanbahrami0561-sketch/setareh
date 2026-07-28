import { z } from 'zod';

// Helper function to sanitize string inputs (remove HTML/script tags and escape dangerous characters to prevent XSS)
export const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '') // Remove script blocks
    .replace(/<[^>]*>?/gm, '') // Strip remaining HTML tags
    .replace(/javascript:/gi, '') // Strip inline javascript: protocol
    .replace(/on\w+="[^"]*"/gi, '') // Strip event handlers like onload="..."
    .replace(/on\w+='[^']*'/gi, '')
    .trim();
};

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(100, 'نام بیش از حد طولانی است').transform(sanitizeString),
  phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  deliveryAddress: z.string().min(5, 'آدرس تحویل باید حداقل ۵ حرف باشد').max(500, 'آدرس بیش از حد طولانی است').transform(sanitizeString),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'شناسه کالا نامعتبر است').max(100).transform(sanitizeString),
      quantity: z.number().int().min(1, 'تعداد باید حداقل ۱ باشد').max(50, 'تعداد سفارشی بیش از حد مجاز است'),
      color: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
    })
  ).min(1, 'سبد خرید نمی‌تواند خالی باشد'),
  discountCode: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  userId: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  userEmail: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
});

export const reviewSchema = z.object({
  productId: z.string().min(1, 'شناسه محصول الزامی است').transform(sanitizeString),
  userName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(100, 'نام بیش از حد طولانی است').transform(sanitizeString),
  userPhone: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'متن نظر باید حداقل ۵ کاراکتر باشد').max(500, 'متن نظر حداکثر ۵۰۰ کاراکتر است').transform(sanitizeString),
});

export const repairSchema = z.object({
  customerName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').max(100, 'نام بیش از حد طولانی است').transform(sanitizeString),
  phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  deviceModel: z.string().min(2, 'مدل دستگاه الزامی است').max(100).transform(sanitizeString),
  issue: z.string().min(3, 'شرح مشکل الزامی است').max(500, 'شرح مشکل بیش از حد طولانی است').transform(sanitizeString),
  userId: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است').max(50).transform(sanitizeString),
  password: z.string().min(1, 'رمز عبور الزامی است').max(100),
});

export const productSchema = z.object({
  title: z.string().min(2, 'عنوان انگلیسی الزامی است').max(150).transform(sanitizeString),
  titleFa: z.string().min(2, 'عنوان فارسی الزامی است').max(150).transform(sanitizeString),
  brand: z.string().min(1, 'برند الزامی است').max(50).transform(sanitizeString),
  price: z.number().min(0, 'قیمت نامعتبر است'),
  originalPrice: z.number().optional(),
  discount: z.number().min(0).max(100).default(0),
  image: z.string().min(1, 'لینک تصویر نامعتبر است').max(1000).transform(sanitizeString),
  category: z.string().min(1, 'دسته بندی الزامی است').max(50).transform(sanitizeString),
  stockCount: z.number().int().min(0, 'موجودی نامعتبر است'),
  inStock: z.boolean().default(true),
  description: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  specs: z.record(z.string(), z.string()).optional(),
  features: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
});

export const stockNotificationSchema = z.object({
  productId: z.string().min(1, 'شناسه کالا الزامی است').transform(sanitizeString),
  productName: z.string().min(1, 'نام کالا الزامی است').max(150).transform(sanitizeString),
  phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  userEmail: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  userId: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
});

export const userProfileSchema = z.object({
  userId: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  name: z.string().max(100, 'نام بیش از حد طولانی است').optional().transform((val) => val ? sanitizeString(val) : ''),
  phone: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  secondaryPhone: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  email: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
  city: z.string().max(100).optional().transform((val) => val ? sanitizeString(val) : ''),
  address: z.string().max(500).optional().transform((val) => val ? sanitizeString(val) : ''),
  postalCode: z.string().max(20).optional().transform((val) => val ? sanitizeString(val) : ''),
  nationalCode: z.string().max(20).optional().transform((val) => val ? sanitizeString(val) : ''),
  avatar: z.string().max(1000).optional().transform((val) => val ? sanitizeString(val) : ''),
  isContactVerified: z.boolean().optional(),
});

export const aiAdvisorSchema = z.object({
  prompt: z.string().max(1000, 'متن سوال بیش از حد طولانی است').optional().transform((val) => val ? sanitizeString(val) : ''),
  budget: z.string().max(100).optional().transform((val) => val ? sanitizeString(val) : ''),
  usage: z.string().max(100).optional().transform((val) => val ? sanitizeString(val) : ''),
  preferredBrand: z.string().max(100).optional().transform((val) => val ? sanitizeString(val) : ''),
});

