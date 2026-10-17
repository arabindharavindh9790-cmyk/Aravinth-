import { StudyMaterial, QuizAttempt } from '../types';

const DB_NAME = 'aae_education_offline_db';
const DB_VERSION = 1;
const STORE_MATERIALS = 'offline_materials';
const STORE_ATTEMPTS = 'quiz_attempts';
const STORE_BOOKMARKS = 'bookmarks';

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_MATERIALS)) {
        db.createObjectStore(STORE_MATERIALS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_ATTEMPTS)) {
        db.createObjectStore(STORE_ATTEMPTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'id' });
      }
    };
  });
}

// Save study material for offline reading
export async function saveMaterialOffline(material: StudyMaterial): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readwrite');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.put({ ...material, isDownloaded: true, savedAt: new Date().toISOString() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Fallback to localStorage for offline material:', err);
    try {
      const existing = JSON.parse(localStorage.getItem('aae_offline_materials') || '{}');
      existing[material.id] = { ...material, isDownloaded: true, savedAt: new Date().toISOString() };
      localStorage.setItem('aae_offline_materials', JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
}

// Remove study material from offline storage
export async function removeMaterialOffline(materialId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readwrite');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.delete(materialId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      const existing = JSON.parse(localStorage.getItem('aae_offline_materials') || '{}');
      delete existing[materialId];
      localStorage.setItem('aae_offline_materials', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }
  }
}

// Get all downloaded offline materials
export async function getOfflineMaterials(): Promise<StudyMaterial[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readonly');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      const existing = JSON.parse(localStorage.getItem('aae_offline_materials') || '{}');
      return Object.values(existing);
    } catch {
      return [];
    }
  }
}

// Check if a specific material is downloaded offline
export async function isMaterialOffline(materialId: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_MATERIALS, 'readonly');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.get(materialId);
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });
  } catch {
    try {
      const existing = JSON.parse(localStorage.getItem('aae_offline_materials') || '{}');
      return !!existing[materialId];
    } catch {
      return false;
    }
  }
}

// Save Quiz Attempt
export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ATTEMPTS, 'readwrite');
      const store = tx.objectStore(STORE_ATTEMPTS);
      const req = store.put(attempt);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      const existing: QuizAttempt[] = JSON.parse(localStorage.getItem('aae_quiz_attempts') || '[]');
      existing.unshift(attempt);
      localStorage.setItem('aae_quiz_attempts', JSON.stringify(existing.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  }
}

// Get All Quiz Attempts
export async function getAllQuizAttempts(): Promise<QuizAttempt[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_ATTEMPTS, 'readonly');
      const store = tx.objectStore(STORE_ATTEMPTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const results: QuizAttempt[] = req.result || [];
        // Sort descending by date
        results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    try {
      const existing: QuizAttempt[] = JSON.parse(localStorage.getItem('aae_quiz_attempts') || '[]');
      existing.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return existing;
    } catch {
      return [];
    }
  }
}

// Clear all quiz attempts
export async function clearAllQuizAttempts(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_ATTEMPTS, 'readwrite');
    tx.objectStore(STORE_ATTEMPTS).clear();
    localStorage.removeItem('aae_quiz_attempts');
  } catch {
    localStorage.removeItem('aae_quiz_attempts');
  }
}

// Clear all offline data
export async function clearAllOfflineData(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction([STORE_MATERIALS, STORE_ATTEMPTS], 'readwrite');
    tx.objectStore(STORE_MATERIALS).clear();
    tx.objectStore(STORE_ATTEMPTS).clear();
    localStorage.removeItem('aae_offline_materials');
    localStorage.removeItem('aae_quiz_attempts');
  } catch {
    localStorage.removeItem('aae_offline_materials');
    localStorage.removeItem('aae_quiz_attempts');
  }
}

// Named alias exports matching component call conventions
export const saveStudyMaterialOffline = saveMaterialOffline;
export const removeStudyMaterialOffline = removeMaterialOffline;
export const getAllOfflineStudyMaterials = getOfflineMaterials;
export const getOfflineStudyMaterial = isMaterialOffline;
