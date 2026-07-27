// Browser Push Notification Utility for Setareh Mobile
// Supports order updates, repair tracking status, and store alerts

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      sendBrowserNotification('اعلان‌های موبایل ستاره فعال شد ✨', {
        body: 'از این پس وضعیت سفارش‌ها و تعمیرات گوشی شما فوراً اطلاع‌رسانی می‌شود.',
        tag: 'setareh-welcome'
      });
    }
    return permission;
  } catch (e) {
    console.error('Failed to request notification permission:', e);
    return 'denied';
  }
}

export function sendBrowserNotification(
  title: string,
  options?: NotificationOptions & { sound?: boolean }
) {
  if (!isNotificationSupported()) return false;

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        ...({
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          dir: 'rtl',
          lang: 'fa-IR',
          ...options
        } as NotificationOptions)
      });

      notification.onclick = function () {
        window.focus();
        notification.close();
      };
      return true;
    } catch (err) {
      console.warn('Error displaying system notification:', err);
    }
  }
  return false;
}

export function notifyNewOrderPlaced(orderId: string, totalToman: number) {
  const formattedPrice = totalToman.toLocaleString('fa-IR');
  sendBrowserNotification(`🛒 سفارش #${orderId} ثبت شد`, {
    body: `سفارش شما با مبلغ کل ${formattedPrice} تومان در موبایل ستاره مبارکه با موفقیت ثبت گردید و در حال پردازش می‌باشد.`,
    tag: `order-${orderId}`
  });
}

export function notifyRepairStatusUpdated(trackingCode: string, deviceModel: string, status: string) {
  sendBrowserNotification(`🔧 تغییر وضعیت تعمیرات #${trackingCode}`, {
    body: `گوشی ${deviceModel}: وضعیت جدید: "${status}". جهت کسب اطلاعات بیشتر با فروشگاه تماس بگیرید.`,
    tag: `repair-${trackingCode}`
  });
}
