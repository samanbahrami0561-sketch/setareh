import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import { storage, db } from '../lib/firebase';

export interface CustomUserPhoto {
  id: string;
  userId: string;
  itemId: string;
  frontUrl?: string;
  backUrl?: string;
  updatedAt: string;
}

// Get or create persistent device session ID for guest users if not logged in
export function getPersistentUserId(currentUserPhoneOrId?: string): string {
  if (currentUserPhoneOrId && currentUserPhoneOrId.trim() !== '' && currentUserPhoneOrId !== 'مهمان') {
    return currentUserPhoneOrId.replace(/[^a-zA-Z0-9_\-]/g, '_');
  }
  let guestId = localStorage.getItem('setareh_persistent_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('setareh_persistent_guest_id', guestId);
  }
  return guestId;
}

/**
 * Uploads a file to Firebase Storage and persists its download URL to Firestore & localStorage
 */
export async function uploadCustomPhoneImageToStorage(
  userId: string,
  itemId: string,
  side: 'front' | 'back',
  file: File | Blob
): Promise<string> {
  const safeUserId = getPersistentUserId(userId);
  const fileExt = file.type.split('/')[1] || 'jpg';
  const timestamp = Date.now();
  const storagePath = `custom_uploads/${safeUserId}/${itemId}_${side}_${timestamp}.${fileExt}`;
  
  let downloadURL = '';

  try {
    // 1. Upload to Firebase Cloud Storage
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    downloadURL = await getDownloadURL(snapshot.ref);
  } catch (storageErr) {
    console.warn('Firebase Storage direct upload failed or limited, falling back to data URL or Firestore storage:', storageErr);
    // Fallback: convert file to Base64 Data URL so user never loses their file
    downloadURL = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  // 2. Persist to Firestore DB for permanent retrieval across refreshes & logouts
  const docId = `${safeUserId}_${itemId}`;
  const photoDocRef = doc(db, 'custom_photos', docId);

  try {
    const existingSnap = await getDoc(photoDocRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : {};

    const updatedData = {
      ...existingData,
      id: docId,
      userId: safeUserId,
      itemId,
      [side === 'front' ? 'frontUrl' : 'backUrl']: downloadURL,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(photoDocRef, updatedData, { merge: true });
  } catch (firestoreErr) {
    console.error('Error saving custom photo metadata to Firestore:', firestoreErr);
  }

  // 3. Backup to localStorage for instant offline access
  try {
    const localKey = `setareh_custom_photos_${safeUserId}`;
    const rawLocal = localStorage.getItem(localKey);
    const localData = rawLocal ? JSON.parse(rawLocal) : {};
    if (!localData[itemId]) localData[itemId] = {};
    localData[itemId][side] = downloadURL;
    localStorage.setItem(localKey, JSON.stringify(localData));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }

  return downloadURL;
}

/**
 * Loads all custom uploaded phone photos for a user from Firestore (or LocalStorage backup)
 */
export async function loadUserCustomImagesFromStorage(
  userId: string
): Promise<Record<string, { front?: string; back?: string }>> {
  const safeUserId = getPersistentUserId(userId);
  const result: Record<string, { front?: string; back?: string }> = {};

  // First, read local storage backup for instant feedback
  try {
    const localKey = `setareh_custom_photos_${safeUserId}`;
    const rawLocal = localStorage.getItem(localKey);
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal);
      Object.assign(result, parsed);
    }
  } catch (e) {
    console.error('LocalStorage read error:', e);
  }

  // Next, query Firestore for permanent cloud records
  try {
    const q = query(collection(db, 'custom_photos'), where('userId', '==', safeUserId));
    const querySnap = await getDocs(q);

    querySnap.forEach((docSnap) => {
      const data = docSnap.data() as CustomUserPhoto;
      if (data.itemId) {
        result[data.itemId] = {
          ...result[data.itemId],
          ...(data.frontUrl ? { front: data.frontUrl } : {}),
          ...(data.backUrl ? { back: data.backUrl } : {}),
        };
      }
    });

    // Sync updated cloud results back to local storage
    const localKey = `setareh_custom_photos_${safeUserId}`;
    localStorage.setItem(localKey, JSON.stringify(result));
  } catch (firestoreErr) {
    console.warn('Firestore fetch custom photos warning:', firestoreErr);
  }

  return result;
}

/**
 * Removes a custom uploaded photo from Storage and Firestore
 */
export async function deleteCustomPhoneImageFromStorage(
  userId: string,
  itemId: string,
  side: 'front' | 'back'
): Promise<void> {
  const safeUserId = getPersistentUserId(userId);
  const docId = `${safeUserId}_${itemId}`;
  const photoDocRef = doc(db, 'custom_photos', docId);

  try {
    const existingSnap = await getDoc(photoDocRef);
    if (existingSnap.exists()) {
      const data = existingSnap.data();
      const fieldToClear = side === 'front' ? 'frontUrl' : 'backUrl';
      const updatedData = { ...data, [fieldToClear]: null, updatedAt: new Date().toISOString() };
      
      if (!updatedData.frontUrl && !updatedData.backUrl) {
        await deleteDoc(photoDocRef);
      } else {
        await setDoc(photoDocRef, updatedData);
      }
    }
  } catch (err) {
    console.error('Error deleting from Firestore:', err);
  }

  // Update local storage
  try {
    const localKey = `setareh_custom_photos_${safeUserId}`;
    const rawLocal = localStorage.getItem(localKey);
    if (rawLocal) {
      const localData = JSON.parse(rawLocal);
      if (localData[itemId]) {
        delete localData[itemId][side];
        if (!localData[itemId].front && !localData[itemId].back) {
          delete localData[itemId];
        }
        localStorage.setItem(localKey, JSON.stringify(localData));
      }
    }
  } catch (e) {
    console.error('Error deleting from LocalStorage:', e);
  }
}
