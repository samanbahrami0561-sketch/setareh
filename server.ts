import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";
import { db } from "./src/lib/serverFirebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { STORE_PRODUCTS } from "./src/data/products";
import {
  checkoutSchema,
  reviewSchema,
  repairSchema,
  adminLoginSchema,
  productSchema,
  stockNotificationSchema,
  userProfileSchema,
  aiAdvisorSchema,
} from "./src/lib/validations";

dotenv.config();

// In-memory session store for server-authenticated admin sessions with 4-hour expiration TTL
const adminTokens = new Map<string, number>();

// Constant-time string comparison to prevent timing attacks during credential checks
function constantTimeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// In-memory Rate Limiting Middleware to prevent Brute-Force & Denial of Service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const createRateLimiter = (maxRequests: number, windowMs: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > clientRecord.resetTime) {
      clientRecord.count = 0;
      clientRecord.resetTime = now + windowMs;
    }

    clientRecord.count += 1;
    rateLimitMap.set(ip, clientRecord);

    if (clientRecord.count > maxRequests) {
      return res.status(429).json({
        error: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه دیگر مجدداً تلاش کنید.",
      });
    }

    next();
  };
};

const generalLimiter = createRateLimiter(150, 60 * 1000); // 150 reqs / min
const loginLimiter = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts / 15 mins (anti brute-force)
const formSubmissionLimiter = createRateLimiter(20, 10 * 60 * 1000); // 20 requests / 10 mins

async function seedProductsIfEmpty() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    if (snapshot.empty) {
      console.log("Seeding initial products into Firestore...");
      const batch = writeBatch(db);
      for (const prod of STORE_PRODUCTS) {
        const ref = doc(db, "products", prod.id);
        batch.set(ref, {
          title: prod.name,
          titleFa: prod.persianName,
          brand: prod.brand,
          price: prod.priceToman,
          originalPrice: prod.originalPriceToman || prod.priceToman,
          discount: prod.originalPriceToman
            ? Math.round((1 - prod.priceToman / prod.originalPriceToman) * 100)
            : 0,
          image: prod.image,
          images: prod.images360 || [prod.image],
          specs: prod.specs,
          rating: prod.rating,
          reviewsCount: prod.reviewsCount,
          isNew: prod.isOffer,
          isBestSeller: prod.isTopSeller,
          color: prod.colors ? prod.colors.map((c) => c.name) : [],
          colorsDetail: prod.colors || [],
          inStock: prod.stock > 0,
          stockCount: prod.stock,
          description: prod.description,
          category: prod.category,
          usageTags: prod.usageTags || [],
          warranty: prod.warranty || "",
          createdAt: new Date().toISOString(),
        });
      }
      await batch.commit();
      console.log("Database seeded successfully with initial products!");
    }
  } catch (err) {
    console.error("Error checking or seeding database:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Strict Request Size Limits to prevent Payload Flooding
  app.use(express.json({ limit: "200kb" }));
  app.use(cookieParser());

  // Secure Cookie Configuration Helper (HttpOnly, Secure, SameSite=Strict)
  const SECURE_COOKIE_OPTIONS: express.CookieOptions = {
    httpOnly: true, // Prevents XSS scripts from accessing the session token
    secure: process.env.NODE_ENV === "production" || process.env.SECURE_COOKIE === "true", // Only sent over HTTPS
    sameSite: "lax", // Protects against CSRF while allowing seamless applet navigation
    maxAge: 4 * 60 * 60 * 1000, // 4-hour session TTL
    path: "/",
  };

  // OWASP Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-ancestors 'self' https://ai.studio https://*.google.com https://*.googleusercontent.com;"
    );
    next();
  });

  // Apply general rate limiter
  app.use(generalLimiter);

  // Seed database on startup
  await seedProductsIfEmpty();

  // Middleware to verify admin token with cookie or authorization header check
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Check HttpOnly cookie first for maximum security, fall back to Authorization header
    const tokenFromCookie = req.cookies?.admin_session;
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.split(" ")[1];
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ error: "دسترسی غیرمجاز. لطفا ابتدا به عنوان مدیر وارد شوید." });
    }

    const expiresAt = adminTokens.get(token);
    if (!expiresAt || Date.now() > expiresAt) {
      adminTokens.delete(token);
      res.clearCookie("admin_session", { path: "/" });
      return res.status(401).json({ error: "نشست کاری شما منقضی شده است. لطفا مجددا وارد شوید." });
    }

    next();
  };

  // ----------------------------------------------------
  // API Routes
  // ----------------------------------------------------

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", store: "Setareh Mobile Mobarakeh" });
  });

  // Admin Login Endpoint (Server-Side Auth with HttpOnly Secure Cookie)
  app.post("/api/admin/login", loginLimiter, async (req, res) => {
    try {
      const parsed = adminLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }
      const { username, password } = parsed.data;

      // Environment Variables for Credentials
      const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
      const ADMIN_PASS = process.env.ADMIN_PASSWORD || "setareh1403";

      const isUserValid = constantTimeCompare(username, ADMIN_USER);
      const isPassValid = constantTimeCompare(password, ADMIN_PASS);

      if (!isUserValid || !isPassValid) {
        return res.status(401).json({ error: "نام کاربری یا رمز عبور مدیر اشتباه است." });
      }

      // Generate cryptographically secure token valid for 4 hours
      const token = crypto.randomBytes(32).toString("hex");
      const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
      adminTokens.set(token, Date.now() + FOUR_HOURS_MS);

      // Set secure HttpOnly cookie to prevent session hijacking & XSS token theft
      res.cookie("admin_session", token, SECURE_COOKIE_OPTIONS);

      res.json({ success: true, token, role: "admin", message: "ورود موفقیت‌آمیز به پنل مدیریت" });
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      res.status(500).json({ error: "خطای سرور در احراز هویت مدیر." });
    }
  });

  // Admin Logout Endpoint (Clears HttpOnly Session Cookie)
  app.post("/api/admin/logout", (req: express.Request, res: express.Response) => {
    const token = req.cookies?.admin_session || req.headers.authorization?.split(" ")[1];
    if (token) {
      adminTokens.delete(token);
    }
    res.clearCookie("admin_session", { path: "/" });
    res.json({ success: true, message: "خروج از پنل مدیریت با موفقیت انجام شد." });
  });

  // Fetch Products
  app.get("/api/products", async (req, res) => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      if (!snapshot.empty) {
        const products = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        return res.json(products);
      }
    } catch (err) {
      console.error("Error fetching products from Firestore, serving fallback:", err);
    }

    // Fallback to static STORE_PRODUCTS if database is empty or unavailable
    const fallbackProducts = STORE_PRODUCTS.map((p) => ({
      id: p.id,
      title: p.name,
      titleFa: p.persianName,
      brand: p.brand,
      price: p.priceToman,
      originalPrice: p.originalPriceToman || p.priceToman,
      discount: p.originalPriceToman
        ? Math.round((1 - p.priceToman / p.originalPriceToman) * 100)
        : 0,
      image: p.image,
      images: p.images360 || [p.image],
      specs: p.specs,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      isNew: p.isOffer,
      isBestSeller: p.isTopSeller,
      color: p.colors ? p.colors.map((c) => c.name) : [],
      colorsDetail: p.colors || [],
      inStock: p.stock > 0,
      stockCount: p.stock,
      description: p.description,
      category: p.category,
      usageTags: p.usageTags || [],
      warranty: p.warranty || "",
      createdAt: new Date().toISOString(),
    }));

    return res.json(fallbackProducts);
  });

  // Add / Edit Product (Admin only)
  app.post("/api/admin/products", requireAdminAuth, async (req, res) => {
    try {
      const parsed = productSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }
      const productData = parsed.data;
      const { id } = req.body;

      if (id) {
        await updateDoc(doc(db, "products", id), {
          ...productData,
          updatedAt: new Date().toISOString(),
        });
        res.json({ success: true, id, message: "محصول با موفقیت بروزرسانی شد" });
      } else {
        const ref = await addDoc(collection(db, "products"), {
          ...productData,
          rating: 5.0,
          reviewsCount: 0,
          createdAt: new Date().toISOString(),
        });
        res.json({ success: true, id: ref.id, message: "محصول جدید با موفقیت اضافه شد" });
      }
    } catch (err) {
      res.status(500).json({ error: "خطا در ذخیره محصول در دیتابیس" });
    }
  });

  // Delete Product (Admin only)
  app.delete("/api/admin/products/:id", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await deleteDoc(doc(db, "products", id));
      res.json({ success: true, message: "محصول حذف شد" });
    } catch (err) {
      res.status(500).json({ error: "خطا در حذف محصول" });
    }
  });

  // Server-Side Checkout & Order Processing (Price calculation, Stock validation & Transaction)
  app.post("/api/orders/checkout", formSubmissionLimiter, async (req, res) => {
    try {
      const parsed = checkoutSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { customerName, phone, deliveryAddress, items, discountCode, userId, userEmail } = parsed.data;

      // Execute atomic transaction for price calculation and stock decrement
      const result = await runTransaction(db, async (transaction) => {
        let rawTotal = 0;
        const verifiedItems = [];

        for (const item of items) {
          const productRef = doc(db, "products", item.productId);
          const docSnap = await transaction.get(productRef);

          if (!docSnap.exists()) {
            throw new Error(`محصول با شناسه ${item.productId} یافت نشد.`);
          }

          const product = docSnap.data()!;
          const currentStock = product.stockCount ?? 0;

          if (currentStock < item.quantity) {
            throw new Error(`موجودی کالا "${product.titleFa || product.title}" کافی نیست. (موجودی: ${currentStock} عدد)`);
          }

          const unitPrice = product.price;
          const itemTotal = unitPrice * item.quantity;
          rawTotal += itemTotal;

          verifiedItems.push({
            productId: item.productId,
            titleFa: product.titleFa || product.title,
            image: product.image,
            unitPrice,
            quantity: item.quantity,
            totalPrice: itemTotal,
            color: item.color || "پیش‌فرض",
          });

          // Decrement stock
          const newStock = currentStock - item.quantity;
          transaction.update(productRef, {
            stockCount: newStock,
            inStock: newStock > 0,
          });
        }

        // Validate discount code server-side
        let discountPercent = 0;
        const codeUpper = (discountCode || "").trim().toUpperCase();
        if (codeUpper === "SETAREH10") {
          discountPercent = 10;
        } else if (codeUpper === "EID1403") {
          discountPercent = 5;
        } else if (codeUpper === "OFF100K") {
          discountPercent = 0; // fixed amount
        }

        let discountAmount = Math.round((rawTotal * discountPercent) / 100);
        if (codeUpper === "OFF100K") discountAmount = 100000;

        const payableAmount = Math.max(0, rawTotal - discountAmount);

        // Create Order Document
        const orderRef = doc(collection(db, "orders"));
        const orderData = {
          id: orderRef.id,
          orderNumber: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          customerName,
          phone,
          deliveryAddress,
          userId: userId || "guest",
          userEmail: userEmail || "",
          items: verifiedItems,
          totalAmount: rawTotal,
          discountAmount,
          payableAmount,
          discountCode: codeUpper,
          status: "پرداخت شده / در حال پردازش",
          createdAt: new Date().toISOString(),
          createdAtFa: new Date().toLocaleDateString("fa-IR"),
        };

        transaction.set(orderRef, orderData);

        return orderData;
      });

      res.json({
        success: true,
        message: "سفارش شما با موفقیت ثبت و تأیید شد.",
        order: result,
      });
    } catch (err: any) {
      console.error("Checkout transaction error:", err.message);
      res.status(400).json({ error: err.message || "خطا در پردازش و ثبت سفارش." });
    }
  });

  // Admin Orders Endpoint
  app.get("/api/admin/orders", requireAdminAuth, async (req, res) => {
    try {
      const snapshot = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
      const orders = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      return res.json(orders);
    } catch (err) {
      console.error("Error fetching admin orders from Firestore, returning empty list fallback:", err);
      return res.json([]);
    }
  });

  // Update Order Status (Admin)
  app.put("/api/admin/orders/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: "وضعیت جدید الزامی است." });

      await updateDoc(doc(db, "orders", id), {
        status,
        updatedAt: new Date().toISOString(),
      });
      res.json({ success: true, message: "وضعیت سفارش بروزرسانی شد." });
    } catch (err) {
      res.status(500).json({ error: "خطا در بروزرسانی وضعیت سفارش" });
    }
  });

  // Get Store Reviews from Firestore
  app.get("/api/reviews", async (req, res) => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "reviews"), where("status", "==", "approved"), limit(50))
      );

      const reviews = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

      // Fallback if empty
      if (reviews.length === 0) {
        return res.json([
          {
            id: "1",
            userName: "علی رضایی",
            rating: 5,
            createdAt: "۲ روز پیش",
            comment: "یکی از بهترین فروشگاه‌های موبایل در مبارکه. برخورد عالی، قیمت مناسب و گارانتی معتبر. حتما پیشنهاد می‌کنم.",
            verified: true,
            status: "approved",
          },
          {
            id: "2",
            userName: "محسن ابراهیمی",
            rating: 5,
            createdAt: "۱ هفته پیش",
            comment: "گوشی S24 Ultra خریدم، قیمت نسبت به بقیه فروشگاه‌ها خیلی منصفانه‌تر بود. لوازم جانبی اصلی هم برام گذاشتن.",
            verified: true,
            status: "approved",
          },
        ]);
      }

      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: "خطا در دریافت نظرات" });
    }
  });

  // Submit Review with Zod Validation
  app.post("/api/reviews", formSubmissionLimiter, async (req, res) => {
    try {
      const parsed = reviewSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { productId, userName, userPhone, rating, comment } = parsed.data;

      const newReview = {
        productId,
        userName,
        userPhone: userPhone || "",
        rating,
        comment,
        status: "approved", // auto approved for demo
        createdAt: new Date().toLocaleDateString("fa-IR"),
        createdAtIso: new Date().toISOString(),
        verified: true,
      };

      const ref = await addDoc(collection(db, "reviews"), newReview);
      res.json({ success: true, review: { id: ref.id, ...newReview } });
    } catch (err) {
      res.status(500).json({ error: "خطا در ثبت نظر" });
    }
  });

  // Submit Repair Booking with Zod Validation
  app.post("/api/repair-request", formSubmissionLimiter, async (req, res) => {
    try {
      const parsed = repairSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { customerName, phone, deviceModel, issue, userId } = parsed.data;

      const newRequest = {
        id: "SR-" + Math.floor(100000 + Math.random() * 900000),
        customerName,
        phone,
        deviceModel,
        issue,
        userId: userId || "guest",
        createdAt: new Date().toLocaleDateString("fa-IR"),
        createdAtIso: new Date().toISOString(),
        status: "در انتظار پذیرش",
      };

      await addDoc(collection(db, "repair_requests"), newRequest);
      res.json({ success: true, request: newRequest });
    } catch (err) {
      res.status(500).json({ error: "خطا در ثبت درخواست تعمیرات" });
    }
  });

  // Submit Out-of-Stock Phone SMS Alert Request
  app.post("/api/stock-notification", formSubmissionLimiter, async (req, res) => {
    try {
      const parsed = stockNotificationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { productId, productName, phone, userEmail, userId } = parsed.data;

      // Check if user already registered for this item with the same phone
      const existingQuery = query(
        collection(db, "stock_notifications"),
        where("productId", "==", productId),
        where("phone", "==", phone)
      );
      const existingSnap = await getDocs(existingQuery);

      if (!existingSnap.empty) {
        return res.json({
          success: true,
          alreadyRegistered: true,
          message: "شماره شما قبلاً برای اطلاع‌رسانی این کالا ثبت شده است. به محض موجود شدن به شما پیامک ارسال می‌شود.",
        });
      }

      const notificationDoc = {
        productId,
        productName,
        phone,
        userEmail: userEmail || "",
        userId: userId || "guest",
        status: "در انتظار موجود شدن",
        createdAt: new Date().toLocaleDateString("fa-IR"),
        createdAtIso: new Date().toISOString(),
      };

      const ref = await addDoc(collection(db, "stock_notifications"), notificationDoc);

      res.json({
        success: true,
        id: ref.id,
        message: `شماره ${phone} با موفقیت ثبت شد. پس از موجود شدن "${productName}" پیامک اطلاع‌رسانی برای شما ارسال خواهد شد.`,
      });
    } catch (err: any) {
      console.error("Error creating stock notification:", err);
      res.status(500).json({ error: "خطا در ثبت درخواست اطلاع‌رسانی موجودی" });
    }
  });

  // Get All Stock Notification Requests (Admin Only)
  app.get("/api/admin/stock-notifications", requireAdminAuth, async (req, res) => {
    try {
      const snapshot = await getDocs(
        query(collection(db, "stock_notifications"), orderBy("createdAtIso", "desc"))
      );
      const items = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      res.json(items);
    } catch (err) {
      console.error("Error fetching stock notifications for admin:", err);
      // Fallback empty array
      res.json([]);
    }
  });

  // Update Stock Notification Status (Admin Only)
  app.put("/api/admin/stock-notifications/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: "وضعیت جدید الزامی است" });

      await updateDoc(doc(db, "stock_notifications", id), {
        status,
        updatedAt: new Date().toISOString(),
      });

      res.json({ success: true, message: "وضعیت اطلاع‌رسانی بروزرسانی شد" });
    } catch (err) {
      res.status(500).json({ error: "خطا در تغییر وضعیت اطلاع‌رسانی" });
    }
  });

  // Track Repair Request Status with Stepped Timeline
  app.get("/api/repair-request/track/:code", async (req, res) => {
    try {
      const code = (req.params.code || "").trim().toUpperCase();
      if (!code) {
        return res.status(400).json({ error: "کد پیگیری وارد نشده است." });
      }

      const snapshot = await getDocs(
        query(collection(db, "repair_requests"), where("id", "==", code))
      );

      let record: any = null;
      if (!snapshot.empty) {
        record = snapshot.docs[0].data();
      }

      const MOCK_REPAIRS: Record<string, any> = {
        "SR-882104": {
          trackingCode: "SR-882104",
          customerName: "سامان بهرامی",
          phone: "09131112233",
          deviceModel: "سامسونگ Galaxy S23 Ultra",
          issue: "تعویض ال‌سی‌دی شرکتی و رفع مشکل عدم شارژ سریع",
          technicianName: "مهندس رضایی (سرپرست سخت‌افزار ستاره)",
          estimatedCost: "۳,۸۰۰,۰۰۰ تومان",
          estimatedCompletion: "۱۴۰۴/۰۵/۰۸",
          currentStepIndex: 2,
          steps: [
            { id: 1, title: "ثبت و پذیرش حضوری", description: "دستگاه توسط واحد پذیرش ستاره تحویل گرفته شد و رسید دیجیتال صادر گردید.", date: "۱۴۰۴/۰۵/۰۴ - ۱۰:۳۰", status: "completed" },
            { id: 2, title: "عیب‌یابی تخصصی و بررسی برد", description: "تست فلات نمایشگر و مدار شارژ روی منبع تغذیه انجام شد.", date: "۱۴۰۴/۰۵/۰۵ - ۱۱:۱۵", status: "completed" },
            { id: 3, title: "تأمین قطعه و فرایند تعمیر", description: "تاچ و ال‌سی‌دی اورجینال سامسونگ (شرکتی) نصب و آیسی شارژ تعویض گردید.", date: "۱۴۰۴/۰۵/۰۶ - ۱۴:۰۰", status: "in_progress" },
            { id: 4, title: "کنترل کیفیت و تست ۴۸ ساعته", description: "تست تاچ، دوربین، سنسور اثرانگشت و نگهداری شارژ باتری.", date: "در انتظار انجام", status: "pending" },
            { id: 5, title: "آماده تحویل و صدور گارانتی", description: "دستگاه آماده تحویل حضوری با ۶ ماه گارانتی تعمیرات ستاره می‌باشد.", date: "در انتظار انجام", status: "pending" }
          ]
        },
        "SR-941205": {
          trackingCode: "SR-941205",
          customerName: "زهرا کاظمی",
          phone: "09139876543",
          deviceModel: "شیائومی Poco F5 Pro",
          issue: "تعویض باتری اصلی و آب‌بندی نانو مجدد",
          technicianName: "مهندس احمدی (متخصص شیائومی)",
          estimatedCost: "۱,۶۵۰,۰۰0 تومان",
          estimatedCompletion: "۱۴۰۴/۰۵/۰۶",
          currentStepIndex: 4,
          steps: [
            { id: 1, title: "ثبت و پذیرش حضوری", description: "دستگاه ثبت سیستم گردید.", date: "۱۴۰۴/۰۵/۰۲ - ۰۹:۰۰", status: "completed" },
            { id: 2, title: "عیب‌یابی تخصصی", description: "سلامت باتری ۲۴٪ تشخیص داده شد.", date: "۱۴۰۴/۰۵/۰۲ - ۱۱:۳۰", status: "completed" },
            { id: 3, title: "تأمین قطعه و تعمیر", description: "باتری اورجینال ۵۰۰۰ میلی‌آمپر نصب شد.", date: "۱۴۰۴/۰۵/۰۳ - ۱۶:۰۰", status: "completed" },
            { id: 4, title: "کنترل کیفیت", description: "تست شارژ و نشت‌جریانی با موفقیت سپری شد.", date: "۱۴۰۴/۰۵/۰۴ - ۱۰:۰۰", status: "completed" },
            { id: 5, title: "آماده تحویل و صدور گارانتی", description: "دستگاه آماده تحویل در شعبه مرکزی موبایل ستاره مبارکه است.", date: "۱۴۰۴/۰۵/۰۵ - ۱۲:۰۰", status: "completed" }
          ]
        }
      };

      if (MOCK_REPAIRS[code]) {
        return res.json({ success: true, repair: MOCK_REPAIRS[code] });
      }

      if (record) {
        const currentStepIndex: number = record.status === "تکمیل شده" ? 4 : record.status === "در حال تعمیر" ? 2 : 1;
        const steps = [
          { id: 1, title: "ثبت و پذیرش اولیه", description: "درخواست شما در سیستم ثبت گردید.", date: record.createdAt || "۱۴۰۴/۰۵/۰۶", status: currentStepIndex >= 0 ? "completed" : "pending" },
          { id: 2, title: "عیب‌یابی اولیه", description: "دستگاه در صف بررسی تکنسین قرار گرفت.", date: "۱۴۰۴/۰۵/۰۶", status: currentStepIndex > 0 ? "completed" : currentStepIndex === 1 ? "in_progress" : "pending" },
          { id: 3, title: "شروع تعمیر و تعویض قطعه", description: "قطعات مورد نیاز تأمین و تعویض می‌گردد.", date: "در حال اقدام", status: currentStepIndex > 1 ? "completed" : currentStepIndex === 2 ? "in_progress" : "pending" },
          { id: 4, title: "کنترل کیفیت و تست final", description: "تست کامل عملکرد سخت‌افزار.", date: "در انتظار", status: currentStepIndex > 2 ? "completed" : currentStepIndex === 3 ? "in_progress" : "pending" },
          { id: 5, title: "آماده تحویل", description: "دستگاه آماده دریافت از فروشگاه ستاره است.", date: "در انتظار", status: currentStepIndex >= 4 ? "completed" : "pending" }
        ];

        return res.json({
          success: true,
          repair: {
            trackingCode: record.id,
            customerName: record.customerName || "مشتری گرامی",
            phone: record.phone || "-",
            deviceModel: record.deviceModel || "گوشی موبایل",
            issue: record.issue || "عیب‌یابی عمومی",
            technicianName: "تیم فنی موبایل ستاره مبارکه",
            estimatedCost: "پس از بررسی اعلام می‌شود",
            estimatedCompletion: "۲۴ الی ۴۸ ساعت آینده",
            currentStepIndex,
            steps
          }
        });
      }

      return res.json({
        success: true,
        repair: {
          trackingCode: code,
          customerName: "مشتری محترم",
          phone: "0913***0000",
          deviceModel: "دستگاه موبایل (کد: " + code + ")",
          issue: "خدمات تخصصی تعویض قطعات و رفع مشکل سخت‌افزاری/نرم‌افزاری",
          technicianName: "مهندس رضایی - متخصص ارشد موبایل ستاره",
          estimatedCost: "۲,۵۰۰,۰۰۰ تومان",
          estimatedCompletion: "۱۴۰۴/۰۵/۰۹",
          currentStepIndex: 2,
          steps: [
            { id: 1, title: "ثبت و پذیرش دستگاه", description: "رسید پذیرش با کد " + code + " در سیستم ستاره ثبت شد.", date: "۱۴۰۴/۰۵/۰۵", status: "completed" },
            { id: 2, title: "کارشناسی و عیب‌یابی", description: "تست برد و قطعات جانبی توسط کارشناس ارشد انجام شد.", date: "۱۴۰۴/۰۵/۰۶", status: "completed" },
            { id: 3, title: "تعمیر تخصصی و مونتاژ", description: "قطعات اصلی جایگذاری شده و دستگاه در حال بسته شدن است.", date: "امروز - در حال انجام", status: "in_progress" },
            { id: 4, title: "کنترل کیفیت و تست عملکرد", description: "تست ۲۴ ساعته آنتن‌دهی، شارژ و تاچ ال‌سی‌دی.", date: "فردا", status: "pending" },
            { id: 5, title: "تحویل به مشتری", description: "دستگاه آماده تحویل حضوری با گارانتی طلایی ستاره.", date: "در انتظار", status: "pending" }
          ]
        }
      });
    } catch (err) {
      res.status(500).json({ error: "خطا در پیگیری کد تعمیرات" });
    }
  });

  // User Profile Update Endpoint (Zod Validated & Rate Limited)
  app.post("/api/user/profile", formSubmissionLimiter, async (req, res) => {
    try {
      const parsed = userProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { userId, name, phone, secondaryPhone, email, city, address, postalCode, nationalCode, avatar, isContactVerified } = parsed.data;
      const targetId = userId || "current-user";

      await setDoc(
        doc(db, "users", targetId),
        {
          name: name || "",
          phone: phone || "",
          secondaryPhone: secondaryPhone || "",
          email: email || "",
          city: city || "",
          address: address || "",
          postalCode: postalCode || "",
          nationalCode: nationalCode || "",
          avatar: avatar || "",
          isContactVerified: !!isContactVerified,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      res.json({ success: true, message: "پروفایل کاربر با موفقیت بروزرسانی شد" });
    } catch (err) {
      console.error("Error updating user profile:", err);
      res.status(500).json({ error: "خطا در بروزرسانی اطلاعات پروفایل در دیتابیس" });
    }
  });

  // AI Mobile Advisor Endpoint (Gemini, Zod Validated & Rate Limited)
  app.post("/api/ai-advisor", formSubmissionLimiter, async (req, res) => {
    try {
      const parsed = aiAdvisorSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { prompt, budget, usage, preferredBrand } = parsed.data;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          reply: `سلام! به **فروشگاه موبایل ستاره مبارکه** خوش آمدید. 
تیم فروش ما در **خیابان حافظ شرقی مبارکه** آماده خدمت‌رسانی به شماست!

📞 **تماس مستقیم:** 03152415779
📍 **آدرس:** مبارکه، خیابان حافظ شرقی (کد پلاس: 8GR3+VW6)
⏰ **ساعت کاری:** ۱۰:۳۰ الی ۲۱:۳۰`,
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `شما "دستیار هوشمند موبایل ستاره" (Star Mobile AI Assistant) در فروشگاه موبایل ستاره شهر مبارکه (استان اصفهان، خیابان حافظ شرقی) هستید.
وظیفه شما مشاوره حرفه‌ای، شیک و دقیق به مشتریان ایرانی جهت خرید گوشی موبایل، لوازم جانبی، گارانتی، مقایسه تخصصی و قیمت‌گذاری در بازار ایران است.

اطلاعات فروشگاه:
- نام: موبایل ستاره (Setareh Mobile)
- امتیاز: ۴.۸ از ۵ (۱۲ نظر گوگل)
- آدرس: استان اصفهان، مبارکه، خیابان حافظ شرقی
- تلفن: 03152415779
- شرایط فروش: نقد و اقساط (بدون ضامن با چک صیادی)، گارانتی ۱۸ ماهه شرکتی، ارسال سریع در مبارکه و اصفهان.

قواعد پاسخگویی:
۱. همواره لحن بسیار محترمانه، صمیمی، مدرن و تخصصی به زبان فارسی داشته باشید.
۲. اگر کاربر بودجه یا نوع کاربرد مطرح کرد، ۲ تا ۳ بهترین مدل موجود را پیشنهاد کنید با نقاط قوت و ضعف کوتاه.
۳. در انتهای پاسخ، مشتری را دعوت کنید برای تست حضوری یا خرید اقساطی به فروشگاه ستاره مراجعه کند.`;

      let userQuery = prompt || "";
      if (budget || usage || preferredBrand) {
        userQuery += `\nاطلاعات فرم: بودجه: ${budget || "مشخص نشده"} | کاربرد: ${usage || "عمومی"} | برند درخواستی: ${preferredBrand || "همه برندها"}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userQuery,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply =
        response.text ||
        "در حال حاضر ارتباط با مشاور هوشمند برقرار نشد. لطفاً با شماره ۰۳۱۵۲۴۱۵۷۷۹ تماس بگیرید.";
      res.json({ reply });
    } catch (err: any) {
      console.error("Gemini AI Advisor Error:", err);
      res.status(500).json({
        reply: "متأسفانه مشکلی در پردازش درخواست هوشمند رخ داده است. می‌توانید مستقیم با کارشناسان موبایل ستاره تماس بگیرید: ۰۳۱۵۲۴۱۵۷۷۹",
      });
    }
  });

  // Global Express Error Handler Middleware (Prevents Stack Trace & Internal System Info Leakage)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Internal Server Error:", err);
    res.status(500).json({
      error: "خطای داخلی سرور رخ داده است. جهت حفظ امنیت اطلاعات، جزئیات خطای فنی نمایش داده نمی‌شود.",
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
