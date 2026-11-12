import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, testFirestoreConnection } from '../lib/firebase.ts';
import {
  PageView,
  ReactorState,
  UserPreferences,
  Memory,
  Conversation,
  ChatMessage,
  CustomCommand,
  Automation,
  Device,
  SyncStatus,
  MemoryCategory
} from '../types/jarvis.ts';
import { StorageService, DEFAULT_PREFERENCES } from '../lib/storage.ts';
import { voiceEngine, sfx } from '../services/voice.ts';

interface JarvisContextType {
  user: User | null;
  authReady: boolean;
  activeView: PageView;
  setActiveView: (view: PageView) => void;
  reactorState: ReactorState;
  setReactorState: (state: ReactorState) => void;
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
  syncStatus: SyncStatus;
  
  // Data State
  memories: Memory[];
  addMemory: (category: MemoryCategory, title: string, content: string, tags?: string[]) => Promise<void>;
  updateMemory: (memory: Memory) => Promise<void>;
  removeMemory: (id: string) => Promise<void>;
  removeCategoryMemories: (cat: MemoryCategory) => Promise<void>;
  exportMemoriesJSON: () => string;
  
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  startNewConversation: (title?: string) => Promise<Conversation>;
  selectConversation: (conv: Conversation) => Promise<void>;
  deleteConversationSession: (id: string) => Promise<void>;
  
  customCommands: CustomCommand[];
  saveCustomCommand: (cmd: Omit<CustomCommand, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, id?: string) => Promise<void>;
  deleteCustomCommand: (id: string) => Promise<void>;
  runCommand: (cmd: CustomCommand) => Promise<string>;
  
  automations: Automation[];
  saveAutomationItem: (auto: Omit<Automation, 'id' | 'userId' | 'createdAt'>, id?: string) => Promise<void>;
  deleteAutomationItem: (id: string) => Promise<void>;
  
  devices: Device[];
  pairNewDevice: (deviceName: string, deviceType: Device['deviceType']) => Promise<Device>;
  revokeConnectedDevice: (deviceId: string) => Promise<void>;
  
  // Voice & AI Chat
  isVoiceListening: boolean;
  isSpeaking: boolean;
  interimTranscript: string;
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  stopSpeakingOutput: () => void;
  sendChatMessage: (text: string) => Promise<void>;
  
  // Auth Controls
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  enterGuestLocalMode: () => void;
  isLocalGuest: boolean;
  systemNotification: string | null;
  clearNotification: () => void;
}

const JarvisContext = createContext<JarvisContextType | undefined>(undefined);

export const JarvisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isLocalGuest, setIsLocalGuest] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<PageView>('landing');
  const [reactorState, setReactorState] = useState<ReactorState>('standby');
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local_mode');
  
  const [memories, setMemories] = useState<Memory[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [customCommands, setCustomCommands] = useState<CustomCommand[]>([]);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [systemNotification, setSystemNotification] = useState<string | null>(null);

  const preferencesRef = useRef(preferences);
  preferencesRef.current = preferences;

  const showNotification = (msg: string) => {
    setSystemNotification(msg);
    setTimeout(() => setSystemNotification(null), 4000);
  };

  // 1. Initial Auth & Boot
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (currentUser) {
        setIsLocalGuest(false);
        setSyncStatus('syncing');
        try {
          const loadedPrefs = await StorageService.getPreferences(currentUser.uid);
          setPreferences(loadedPrefs);
          sfx.setEnabled(loadedPrefs.soundEffectsEnabled);

          const [mems, convs, cmds, autos, devs] = await Promise.all([
            StorageService.getMemories(currentUser.uid),
            StorageService.getConversations(currentUser.uid),
            StorageService.getCommands(),
            StorageService.getAutomations(),
            StorageService.getDevices()
          ]);

          setMemories(mems);
          setConversations(convs);
          setCustomCommands(cmds);
          setAutomations(autos);
          setDevices(devs);
          setSyncStatus('cloud_synced');
        } catch (e) {
          console.warn('Initial cloud load error, falling back:', e);
          setSyncStatus('offline_cached');
        }
      } else {
        // Load local data for guest
        const loadedPrefs = await StorageService.getPreferences('local_guest');
        setPreferences(loadedPrefs);
        sfx.setEnabled(loadedPrefs.soundEffectsEnabled);

        const [mems, convs, cmds, autos, devs] = await Promise.all([
          StorageService.getMemories('local_guest'),
          StorageService.getConversations('local_guest'),
          StorageService.getCommands(),
          StorageService.getAutomations(),
          StorageService.getDevices()
        ]);

        setMemories(mems);
        setConversations(convs);
        setCustomCommands(cmds);
        setAutomations(autos);
        setDevices(devs);
        setSyncStatus('local_mode');
      }
    });

    return () => unsubscribe();
  }, []);

  // Update preferences helper
  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs, updatedAt: new Date().toISOString() };
    setPreferences(updated);
    sfx.setEnabled(updated.soundEffectsEnabled);
    await StorageService.savePreferences(updated);
    showNotification('JARVIS personalization calibrated.');
  };

  // --- MEMORY OPERATIONS ---
  const addMemory = async (category: MemoryCategory, title: string, content: string, tags: string[] = []) => {
    const newMem: Memory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: user?.uid || 'local_guest',
      category,
      title,
      content,
      tags,
      source: 'manual',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await StorageService.saveMemory(newMem);
    setMemories(prev => [newMem, ...prev]);
    sfx.playAcknowledgeTone();
    showNotification(`Memory saved to [${category}].`);
  };

  const updateMemory = async (memory: Memory) => {
    await StorageService.saveMemory(memory);
    setMemories(prev => prev.map(m => m.id === memory.id ? memory : m));
    showNotification('Memory updated.');
  };

  const removeMemory = async (id: string) => {
    await StorageService.deleteMemory(id);
    setMemories(prev => prev.filter(m => m.id !== id));
    showNotification('Memory removed.');
  };

  const removeCategoryMemories = async (cat: MemoryCategory) => {
    await StorageService.deleteCategoryMemories(cat);
    setMemories(prev => prev.filter(m => m.category !== cat));
    showNotification(`All memories in [${cat}] cleared.`);
  };

  const exportMemoriesJSON = () => {
    return JSON.stringify(memories, null, 2);
  };

  // --- CONVERSATION SESSIONS ---
  const startNewConversation = async (title: string = 'Session ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: user?.uid || 'local_guest',
      title,
      messageCount: 0,
      lastMessageSnippet: 'Session initiated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await StorageService.saveConversation(newConv);
    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
    setMessages([]);
    return newConv;
  };

  const selectConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    const msgs = await StorageService.getMessages(conv.id);
    setMessages(msgs);
  };

  const deleteConversationSession = async (id: string) => {
    await StorageService.deleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(null);
      setMessages([]);
    }
    showNotification('Conversation record deleted.');
  };

  // --- CUSTOM COMMANDS ---
  const saveCustomCommand = async (cmd: Omit<CustomCommand, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, id?: string) => {
    const fullCmd: CustomCommand = {
      ...cmd,
      id: id || `cmd-${Date.now()}`,
      userId: user?.uid || 'local_guest',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await StorageService.saveCommand(fullCmd);
    setCustomCommands(prev => {
      const idx = prev.findIndex(c => c.id === fullCmd.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = fullCmd;
        return copy;
      }
      return [fullCmd, ...prev];
    });
    showNotification(`Custom command [${fullCmd.name}] saved.`);
  };

  const deleteCustomCommand = async (id: string) => {
    await StorageService.deleteCommand(id);
    setCustomCommands(prev => prev.filter(c => c.id !== id));
    showNotification('Command deleted.');
  };

  // --- AUTOMATIONS ---
  const saveAutomationItem = async (auto: Omit<Automation, 'id' | 'userId' | 'createdAt'>, id?: string) => {
    const fullAuto: Automation = {
      ...auto,
      id: id || `auto-${Date.now()}`,
      userId: user?.uid || 'local_guest',
      createdAt: new Date().toISOString()
    };
    await StorageService.saveAutomation(fullAuto);
    setAutomations(prev => {
      const idx = prev.findIndex(a => a.id === fullAuto.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = fullAuto;
        return copy;
      }
      return [fullAuto, ...prev];
    });
    showNotification(`Automation [${fullAuto.name}] configured.`);
  };

  const deleteAutomationItem = async (id: string) => {
    await StorageService.deleteAutomation(id);
    setAutomations(prev => prev.filter(a => a.id !== id));
    showNotification('Automation removed.');
  };

  // --- DEVICES ---
  const pairNewDevice = async (deviceName: string, deviceType: Device['deviceType']): Promise<Device> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newDevice: Device = {
      id: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: user?.uid || 'local_guest',
      deviceName,
      deviceType,
      status: 'online',
      pairingCode: code,
      lastSyncAt: new Date().toISOString(),
      permissions: {
        microphone: true,
        notifications: true,
        camera: false,
        accessibility: true
      },
      supportedFeatures: [
        'Room Database Sync',
        'Accessibility Listener',
        'Wake-Word Listener',
        'Notification Receiver'
      ],
      createdAt: new Date().toISOString()
    };
    await StorageService.saveDevice(newDevice);
    setDevices(prev => [newDevice, ...prev]);
    sfx.playAcknowledgeTone();
    showNotification(`Device [${deviceName}] securely paired.`);
    return newDevice;
  };

  const revokeConnectedDevice = async (deviceId: string) => {
    await StorageService.revokeDevice(deviceId);
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'revoked' } : d));
    showNotification('Device access revoked.');
  };

  // --- RUN COMMAND ---
  const runCommand = async (cmd: CustomCommand): Promise<string> => {
    setReactorState('executing');
    sfx.playPowerUp();

    let resultMsg = `Executing ${cmd.name}...`;

    if (cmd.actionIdentifier.includes('PROJECT')) {
      const projectMems = memories.filter(m => m.category === 'Projects');
      if (projectMems.length > 0) {
        resultMsg = `Recalling authorized project memory: ${projectMems[0].title}. ${projectMems[0].content}`;
      } else {
        resultMsg = `No active project memory found in authorized archives. Would you like to create one, ${preferences.preferredName || 'Sir'}?`;
      }
    } else if (cmd.actionIdentifier.includes('DIAGNOSTIC')) {
      const activeDevs = devices.filter(d => d.status === 'online').length;
      resultMsg = `Diagnostics complete. Arc Reactor status optimal. ${activeDevs} connected companion devices active. Neural pipelines operating with zero anomalies.`;
    } else if (cmd.actionIdentifier.includes('NAVIGATE')) {
      setActiveView('memory');
      resultMsg = `Displaying memory repository archives.`;
    } else {
      resultMsg = `Action [${cmd.actionIdentifier}] dispatched to target: ${cmd.targetDevice}.`;
    }

    voiceEngine.speak(resultMsg, {
      rate: preferences.speechRate,
      pitch: preferences.speechPitch,
      voiceName: preferences.voiceName,
      language: preferences.language,
      onStart: () => {
        setIsSpeaking(true);
        setReactorState('speaking');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setReactorState('standby');
      }
    });

    return resultMsg;
  };

  // --- CHAT MESSAGE & AI DISPATCH ---
  const sendChatMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Ensure conversation session exists
    let currConv = activeConversation;
    if (!currConv) {
      currConv = await startNewConversation();
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId: user?.uid || 'local_guest',
      conversationId: currConv.id,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    await StorageService.saveMessage(userMsg);

    // Set reactor to thinking state
    setReactorState('thinking');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages.slice(-6),
          userPreferences: preferencesRef.current,
          memories: memories.slice(0, 15)
        })
      });

      if (!response.ok) {
        throw new Error(`AI Gateway responded with status: ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.text || `Understood, ${preferencesRef.current.preferredName || 'Sir'}. Standing by.`;

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userId: user?.uid || 'local_guest',
        conversationId: currConv.id,
        role: 'model',
        text: replyText,
        timestamp: new Date().toISOString(),
        detectedAction: data.suggestedAction ? JSON.stringify(data.suggestedAction) : null
      };

      setMessages(prev => [...prev, aiMsg]);
      await StorageService.saveMessage(aiMsg);

      // Update conversation snippet
      const updatedConv: Conversation = {
        ...currConv,
        messageCount: (currConv.messageCount || 0) + 2,
        lastMessageSnippet: replyText.slice(0, 120),
        updatedAt: new Date().toISOString()
      };
      await StorageService.saveConversation(updatedConv);
      setActiveConversation(updatedConv);

      // Auto-create memory if suggested and setting is enabled
      if (data.suggestedAction?.type === 'CREATE_MEMORY' && preferencesRef.current.autoMemoryEnabled) {
        await addMemory('Personal information', 'Conversation Insight', text.slice(0, 500), ['ai_auto_learned']);
      }

      // Voice output synthesis with cinematic male voice
      voiceEngine.speak(replyText, {
        rate: preferencesRef.current.speechRate,
        pitch: preferencesRef.current.speechPitch,
        voiceName: preferencesRef.current.voiceName,
        language: preferencesRef.current.language,
        onStart: () => {
          setIsSpeaking(true);
          setReactorState('speaking');
        },
        onEnd: () => {
          setIsSpeaking(false);
          setReactorState('standby');
        },
        onError: () => {
          setIsSpeaking(false);
          setReactorState('standby');
        }
      });

    } catch (err: any) {
      console.error('Chat error:', err);
      setReactorState('error');
      sfx.playAlertTone();

      const errMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        userId: user?.uid || 'local_guest',
        conversationId: currConv.id,
        role: 'model',
        text: `My apologies, ${preferencesRef.current.preferredName || 'Sir'}. Neural link encountered an interruption. Operating from local cache.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);

      setTimeout(() => setReactorState('standby'), 3000);
    }
  }, [activeConversation, user, messages, memories]);

  // --- VOICE LISTENING CONTROLS ---
  const startVoiceInput = () => {
    // Stop any ongoing speech output first to enable voice interruption
    voiceEngine.stopSpeaking();
    setIsSpeaking(false);

    setReactorState('listening');
    setIsVoiceListening(true);
    setInterimTranscript('');

    const started = voiceEngine.startListening({
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setIsVoiceListening(false);
          setInterimTranscript('');
          sendChatMessage(transcript);
        } else {
          setInterimTranscript(transcript);
        }
      },
      onError: (err) => {
        console.warn('Voice recognition error:', err);
        setIsVoiceListening(false);
        setReactorState('standby');
      },
      onEnd: () => {
        setIsVoiceListening(false);
        if (reactorState === 'listening') {
          setReactorState('standby');
        }
      }
    }, preferences.language);

    if (!started) {
      setIsVoiceListening(false);
      setReactorState('standby');
      showNotification('Microphone access is unavailable.');
    }
  };

  const stopVoiceInput = () => {
    voiceEngine.stopListening();
    setIsVoiceListening(false);
    if (reactorState === 'listening') {
      setReactorState('standby');
    }
  };

  const stopSpeakingOutput = () => {
    voiceEngine.stopSpeaking();
    setIsSpeaking(false);
    setReactorState('standby');
  };

  // --- AUTH METHODS ---
  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setSyncStatus('syncing');
      await signInWithPopup(auth, provider);
      sfx.playPowerUp();
      showNotification('Authenticated with Firebase. Cloud synchronization active.');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      showNotification(`Authentication error: ${error.message || 'Cancelled'}`);
      setSyncStatus('local_mode');
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsLocalGuest(true);
      setSyncStatus('local_mode');
      showNotification('Signed out. Switched to offline local storage.');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const enterGuestLocalMode = () => {
    setIsLocalGuest(true);
    setActiveView('dashboard');
    sfx.playPowerUp();
    showNotification('Guest Local Mode active. Data saved in IndexedDB.');
  };

  const clearNotification = () => setSystemNotification(null);

  return (
    <JarvisContext.Provider
      value={{
        user,
        authReady,
        activeView,
        setActiveView,
        reactorState,
        setReactorState,
        preferences,
        updatePreferences,
        syncStatus,
        memories,
        addMemory,
        updateMemory,
        removeMemory,
        removeCategoryMemories,
        exportMemoriesJSON,
        conversations,
        activeConversation,
        messages,
        startNewConversation,
        selectConversation,
        deleteConversationSession,
        customCommands,
        saveCustomCommand,
        deleteCustomCommand,
        runCommand,
        automations,
        saveAutomationItem,
        deleteAutomationItem,
        devices,
        pairNewDevice,
        revokeConnectedDevice,
        isVoiceListening,
        isSpeaking,
        interimTranscript,
        startVoiceInput,
        stopVoiceInput,
        stopSpeakingOutput,
        sendChatMessage,
        signInGoogle,
        logout,
        enterGuestLocalMode,
        isLocalGuest,
        systemNotification,
        clearNotification
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
};

export const useJarvis = (): JarvisContextType => {
  const context = useContext(JarvisContext);
  if (!context) {
    throw new Error('useJarvis must be used within a JarvisProvider');
  }
  return context;
};
