import { z } from 'zod';

// Helper function to sanitize string inputs (remove HTML/script tags)
export const sanitizeString = (str: string) => {
  return str.replace(/<[^>]*>?/gm, '').trim();
};

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').transform(sanitizeString),
  phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  deliveryAddress: z.string().min(5, 'آدرس تحویل باید حداقل ۵ حرف باشد').transform(sanitizeString),
  items: z.array(
    z.object({
      productId: z.string().min(1, 'شناسه کالا نامعتبر است'),
      quantity: z.number().int().min(1, 'تعداد باید حداقل ۱ باشد'),
      color: z.string().optional(),
    })
  ).min(1, 'سبد خرید نمی‌تواند خالی باشد'),
  discountCode: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  userId: z.string().optional(),
  userEmail: z.string().email('ایمیل معتبر نیست').optional().or(z.literal('')),
});

export const reviewSchema = z.object({
  productId: z.string().min(1, 'شناسه محصول الزامی است'),
  userName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').transform(sanitizeString),
  userPhone: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'متن نظر باید حداقل ۵ کاراکتر باشد').max(500, 'متن نظر حداکثر ۵۰۰ کاراکتر است').transform(sanitizeString),
});

export const repairSchema = z.object({
  customerName: z.string().min(2, 'نام باید حداقل ۲ حرف باشد').transform(sanitizeString),
  phone: z.string().regex(/^09[0-9]{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  deviceModel: z.string().min(2, 'مدل دستگاه الزامی است').transform(sanitizeString),
  issue: z.string().min(3, 'شرح مشکل الزامی است').transform(sanitizeString),
  userId: z.string().optional(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

export const productSchema = z.object({
  title: z.string().min(2, 'عنوان انگلیسی الزامی است').transform(sanitizeString),
  titleFa: z.string().min(2, 'عنوان فارسی الزامی است').transform(sanitizeString),
  brand: z.string().min(1, 'برند الزامی است').transform(sanitizeString),
  price: z.number().min(0, 'قیمت نامعتبر است'),
  originalPrice: z.number().optional(),
  discount: z.number().min(0).max(100).default(0),
  image: z.string().url('لینک تصویر نامعتبر است').or(z.string().min(1)),
  category: z.string().min(1, 'دسته بندی الزامی است'),
  stockCount: z.number().int().min(0, 'موجودی نامعتبر است'),
  inStock: z.boolean().default(true),
  description: z.string().optional().transform((val) => val ? sanitizeString(val) : ''),
  specs: z.record(z.string(), z.string()).optional(),
  features: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
});
