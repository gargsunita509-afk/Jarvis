import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase.ts';
import {
  UserPreferences,
  Memory,
  Conversation,
  ChatMessage,
  CustomCommand,
  Automation,
  Device,
  MemoryCategory,
  UserProfile
} from '../types/jarvis.ts';

// IndexedDB configuration for Local Mode
const DB_NAME = 'jarvis_ecosystem_db';
const DB_VERSION = 2;

function openLocalDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const idb = event.target.result;
      const stores = [
        'profile',
        'preferences',
        'memories',
        'conversations',
        'messages',
        'customCommands',
        'automations',
        'devices',
        'syncQueue'
      ];
      stores.forEach(name => {
        if (!idb.objectStoreNames.contains(name)) {
          idb.createObjectStore(name, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGet<T>(storeName: string, id: string): Promise<T | null> {
  try {
    const idb = await openLocalDB();
    return new Promise((resolve) => {
      const tx = idb.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function idbGetAll<T>(storeName: string): Promise<T[]> {
  try {
    const idb = await openLocalDB();
    return new Promise((resolve) => {
      const tx = idb.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function idbSet<T extends { id: string }>(storeName: string, item: T): Promise<void> {
  try {
    const idb = await openLocalDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn(`Local IDB write failed for ${storeName}`, e);
  }
}

async function idbDelete(storeName: string, id: string): Promise<void> {
  try {
    const idb = await openLocalDB();
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn(`Local IDB delete failed for ${storeName}`, e);
  }
}

// Default initial preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  userId: 'local_guest',
  assistantName: 'JARVIS',
  preferredName: 'Sir',
  theme: 'cyber-dark',
  reactorColor: 'cyan',
  reactorStyle: 'classic-arc',
  voiceName: 'cinematic-male-default',
  speechRate: 1.0,
  speechPitch: 1.0,
  language: 'English',
  personality: 'professional',
  autoMemoryEnabled: true,
  cloudSyncEnabled: true,
  soundEffectsEnabled: true,
  wakeWordEnabled: true,
  updatedAt: new Date().toISOString()
};

// Initial starter seed memories (User authorized & editable)
export const DEFAULT_STARTER_MEMORIES: Memory[] = [
  {
    id: 'mem-seed-1',
    userId: 'local_guest',
    category: 'Projects',
    title: 'Project NEXORA',
    content: 'Autonomous web agent architecture with distributed task execution and edge telemetry. Milestone 1 scheduled for next sprint.',
    source: 'manual',
    isPinned: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'mem-seed-2',
    userId: 'local_guest',
    category: 'Preferences',
    title: 'Preferred Communication Protocol',
    content: 'Prefers concise, tactical audio briefings in the morning and detailed architectural breakdowns during project queries. Responds to both English and Hinglish.',
    source: 'manual',
    isPinned: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'mem-seed-3',
    userId: 'local_guest',
    category: 'Routines',
    title: 'Morning Diagnostics Protocol',
    content: 'Verify companion Android APK connection, review pending calendar items, check system latency and cloud synchronization state.',
    source: 'manual',
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const DEFAULT_STARTER_COMMANDS: CustomCommand[] = [
  {
    id: 'cmd-1',
    userId: 'local_guest',
    name: 'Open Study Project',
    triggerPhrase: 'Jarvis, open my study project',
    description: 'Retrieves authorized project memory details and displays active resources',
    targetDevice: 'Web App',
    actionIdentifier: 'ACTION_QUERY_PROJECT_NEXORA',
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cmd-2',
    userId: 'local_guest',
    name: 'Start Daily Routine',
    triggerPhrase: 'Jarvis, start my daily routine',
    description: 'Executes morning briefing, checks connected devices and AI core health',
    targetDevice: 'All Connected',
    actionIdentifier: 'ACTION_RUN_MORNING_DIAGNOSTIC',
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cmd-3',
    userId: 'local_guest',
    name: 'Show Saved Notes',
    triggerPhrase: 'Jarvis, show my saved notes',
    description: 'Navigates directly to memory repository filtered by Knowledge notes',
    targetDevice: 'Web App',
    actionIdentifier: 'ACTION_NAVIGATE_MEMORIES',
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_STARTER_AUTOMATIONS: Automation[] = [
  {
    id: 'auto-1',
    userId: 'local_guest',
    name: '08:00 AM Tactical Briefing',
    triggerType: 'Schedule (Time)',
    triggerConfig: '08:00 Daily',
    actionType: 'Daily Briefing',
    actionPayload: 'Audible status of connected devices, memory recall of pending tasks',
    isEnabled: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'auto-2',
    userId: 'local_guest',
    name: 'Companion APK Auto-Sync',
    triggerType: 'Device Connected',
    triggerConfig: 'Android Companion Phone connected',
    actionType: 'Device Routine',
    actionPayload: 'Bidirectional sync of speech triggers and new memories',
    isEnabled: true,
    createdAt: new Date().toISOString()
  }
];

// STORAGE SERVICE API

export const StorageService = {
  // --- PREFERENCES ---
  async getPreferences(userId?: string): Promise<UserPreferences> {
    const uid = userId || auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      try {
        const docRef = doc(db, 'users', uid, 'preferences', 'settings');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as UserPreferences;
          await idbSet('preferences', { id: 'current', ...data });
          return data;
        }
      } catch (err) {
        console.warn('Firestore load preferences error, falling back to local IDB:', err);
      }
    }
    const local = await idbGet<any>('preferences', 'current');
    return local ? { ...DEFAULT_PREFERENCES, ...local } : { ...DEFAULT_PREFERENCES, userId: uid || 'local_guest' };
  },

  async savePreferences(prefs: UserPreferences): Promise<void> {
    const uid = auth.currentUser?.uid;
    const sanitized: UserPreferences = {
      ...prefs,
      userId: uid || 'local_guest',
      updatedAt: new Date().toISOString()
    };

    await idbSet('preferences', { id: 'current', ...sanitized });

    if (uid && auth.currentUser && prefs.cloudSyncEnabled) {
      const path = `users/${uid}/preferences/settings`;
      try {
        await setDoc(doc(db, 'users', uid, 'preferences', 'settings'), sanitized);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  // --- MEMORIES ---
  async getMemories(userId?: string): Promise<Memory[]> {
    const uid = userId || auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/memories`;
      try {
        const colRef = collection(db, 'users', uid, 'memories');
        const snap = await getDocs(colRef);
        const cloudMemories = snap.docs.map(d => d.data() as Memory);
        if (cloudMemories.length > 0) {
          for (const m of cloudMemories) {
            await idbSet('memories', m);
          }
          return cloudMemories;
        }
      } catch (err) {
        console.warn('Firestore memories fetch error, falling back to IDB:', err);
      }
    }

    const localList = await idbGetAll<Memory>('memories');
    if (localList.length === 0) {
      // Seed default memories on first launch
      for (const m of DEFAULT_STARTER_MEMORIES) {
        await idbSet('memories', m);
      }
      return DEFAULT_STARTER_MEMORIES;
    }
    return localList;
  },

  async saveMemory(memory: Memory): Promise<void> {
    const uid = auth.currentUser?.uid;
    const item: Memory = {
      ...memory,
      userId: uid || 'local_guest',
      updatedAt: new Date().toISOString()
    };

    await idbSet('memories', item);

    if (uid && auth.currentUser) {
      const path = `users/${uid}/memories/${item.id}`;
      try {
        await setDoc(doc(db, 'users', uid, 'memories', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async deleteMemory(id: string): Promise<void> {
    await idbDelete('memories', id);

    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/memories/${id}`;
      try {
        await deleteDoc(doc(db, 'users', uid, 'memories', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  },

  async deleteCategoryMemories(category: MemoryCategory): Promise<void> {
    const all = await this.getMemories();
    const toDelete = all.filter(m => m.category === category);
    for (const m of toDelete) {
      await this.deleteMemory(m.id);
    }
  },

  // --- CONVERSATIONS ---
  async getConversations(userId?: string): Promise<Conversation[]> {
    const uid = userId || auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/conversations`;
      try {
        const colRef = collection(db, 'users', uid, 'conversations');
        const snap = await getDocs(colRef);
        const list = snap.docs.map(d => d.data() as Conversation);
        if (list.length > 0) {
          for (const c of list) {
            await idbSet('conversations', c);
          }
          return list;
        }
      } catch (err) {
        console.warn('Firestore conversations load error:', err);
      }
    }
    return await idbGetAll<Conversation>('conversations');
  },

  async saveConversation(conv: Conversation): Promise<void> {
    const uid = auth.currentUser?.uid;
    const item = { ...conv, userId: uid || 'local_guest' };
    await idbSet('conversations', item);

    if (uid && auth.currentUser) {
      const path = `users/${uid}/conversations/${item.id}`;
      try {
        await setDoc(doc(db, 'users', uid, 'conversations', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async deleteConversation(convId: string): Promise<void> {
    await idbDelete('conversations', convId);

    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/conversations/${convId}`;
      try {
        await deleteDoc(doc(db, 'users', uid, 'conversations', convId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  },

  // --- MESSAGES ---
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/conversations/${conversationId}/messages`;
      try {
        const colRef = collection(db, 'users', uid, 'conversations', conversationId, 'messages');
        const snap = await getDocs(colRef);
        const list = snap.docs.map(d => d.data() as ChatMessage);
        if (list.length > 0) {
          return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
      } catch (err) {
        console.warn('Firestore messages load error:', err);
      }
    }

    const localMessages = await idbGetAll<ChatMessage>('messages');
    return localMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  async saveMessage(msg: ChatMessage): Promise<void> {
    const uid = auth.currentUser?.uid;
    const item = { ...msg, userId: uid || 'local_guest' };
    await idbSet('messages', item);

    if (uid && auth.currentUser) {
      const path = `users/${uid}/conversations/${item.conversationId}/messages/${item.id}`;
      try {
        await setDoc(doc(db, 'users', uid, 'conversations', item.conversationId, 'messages', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  // --- CUSTOM COMMANDS ---
  async getCommands(): Promise<CustomCommand[]> {
    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/customCommands`;
      try {
        const colRef = collection(db, 'users', uid, 'customCommands');
        const snap = await getDocs(colRef);
        const list = snap.docs.map(d => d.data() as CustomCommand);
        if (list.length > 0) {
          for (const c of list) {
            await idbSet('customCommands', c);
          }
          return list;
        }
      } catch (err) {
        console.warn('Firestore custom commands error:', err);
      }
    }

    const local = await idbGetAll<CustomCommand>('customCommands');
    if (local.length === 0) {
      for (const cmd of DEFAULT_STARTER_COMMANDS) {
        await idbSet('customCommands', cmd);
      }
      return DEFAULT_STARTER_COMMANDS;
    }
    return local;
  },

  async saveCommand(cmd: CustomCommand): Promise<void> {
    const uid = auth.currentUser?.uid;
    const item = { ...cmd, userId: uid || 'local_guest' };
    await idbSet('customCommands', item);

    if (uid && auth.currentUser) {
      const path = `users/${uid}/customCommands/${item.id}`;
      try {
        await setDoc(doc(db, 'users', uid, 'customCommands', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async deleteCommand(id: string): Promise<void> {
    await idbDelete('customCommands', id);
    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/customCommands/${id}`;
      try {
        await deleteDoc(doc(db, 'users', uid, 'customCommands', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  },

  // --- AUTOMATIONS ---
  async getAutomations(): Promise<Automation[]> {
    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/automations`;
      try {
        const colRef = collection(db, 'users', uid, 'automations');
        const snap = await getDocs(colRef);
        const list = snap.docs.map(d => d.data() as Automation);
        if (list.length > 0) {
          for (const a of list) {
            await idbSet('automations', a);
          }
          return list;
        }
      } catch (err) {
        console.warn('Firestore automations error:', err);
      }
    }

    const local = await idbGetAll<Automation>('automations');
    if (local.length === 0) {
      for (const a of DEFAULT_STARTER_AUTOMATIONS) {
        await idbSet('automations', a);
      }
      return DEFAULT_STARTER_AUTOMATIONS;
    }
    return local;
  },

  async saveAutomation(automation: Automation): Promise<void> {
    const uid = auth.currentUser?.uid;
    const item = { ...automation, userId: uid || 'local_guest' };
    await idbSet('automations', item);

    if (uid && auth.currentUser) {
      const path = `users/${uid}/automations/${item.id}`;
      try {
        await setDoc(doc(db, 'users', uid, 'automations', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async deleteAutomation(id: string): Promise<void> {
    await idbDelete('automations', id);
    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/automations/${id}`;
      try {
        await deleteDoc(doc(db, 'users', uid, 'automations', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  },

  // --- DEVICES ---
  async getDevices(): Promise<Device[]> {
    const uid = auth.currentUser?.uid;
    if (uid && auth.currentUser) {
      const path = `users/${uid}/devices`;
      try {
        const colRef = collection(db, 'users', uid, 'devices');
        const snap = await getDocs(colRef);
        const list = snap.docs.map(d => d.data() as Device);
        if (list.length > 0) {
          for (const dev of list) {
            await idbSet('devices', dev);
          }
          return list;
        }
      } catch (err) {
        console.warn('Firestore devices error:', err);
      }
    }

    return await idbGetAll<Device>('devices');
  },

  async saveDevice(device: Device): Promise<void> {
    const uid = auth.currentUser?.uid;
    const item = { ...device, userId: uid || 'local_guest' };
    await idbSet('devices', item);

    if (uid && auth.currentUser) {
      const path = `users/${uid}/devices/${item.id}`;
      try {
        await setDoc(doc(db, 'users', uid, 'devices', item.id), item);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  },

  async revokeDevice(deviceId: string): Promise<void> {
    const devices = await this.getDevices();
    const dev = devices.find(d => d.id === deviceId);
    if (dev) {
      const updated: Device = { ...dev, status: 'revoked' };
      await this.saveDevice(updated);
    }
  },

  // WIPE DATA METHODS
  async wipeLocalData(): Promise<void> {
    try {
      const idb = await openLocalDB();
      const stores = [
        'profile',
        'preferences',
        'memories',
        'conversations',
        'messages',
        'customCommands',
        'automations',
        'devices',
        'syncQueue'
      ];
      const tx = idb.transaction(stores, 'readwrite');
      stores.forEach(s => tx.objectStore(s).clear());
    } catch (e) {
      console.warn('Error clearing IDB:', e);
    }
  }
};
