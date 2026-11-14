import React, { useState } from 'react';
import {
  FileCode2,
  Database,
  Smartphone,
  Lock,
  Share2,
  Copy,
  CheckCircle2,
  Layers,
  Terminal,
  Cpu,
  Info
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

export const ContractView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const schemaSnippet = `// Shared Firestore Collection Schema Contract
// Root path: users/{userId}/

users/{userId}/
  profile/info
    - userId: String (matching request.auth.uid)
    - email: String
    - displayName: String
    - preferredName: String (e.g. "Sir")
    - assistantName: String (e.g. "JARVIS")
    - createdAt: Timestamp
    - updatedAt: Timestamp

  preferences/settings
    - userId: String
    - theme: "cyber-dark" | "deep-navy" | "stark-black"
    - reactorColor: "cyan" | "gold-crimson" | "violet" | "emerald" | "monochrome"
    - reactorStyle: "classic-arc" | "mark-50" | "genesis" | "quantum"
    - voiceName: String
    - speechRate: Float (0.8 - 1.3)
    - speechPitch: Float (0.8 - 1.2)
    - language: "English" | "Hindi" | "Hinglish"
    - personality: "professional" | "friendly" | "concise" | "detailed"
    - autoMemoryEnabled: Boolean
    - cloudSyncEnabled: Boolean
    - soundEffectsEnabled: Boolean
    - updatedAt: Timestamp

  memories/{memoryId}
    - id: String
    - userId: String
    - category: "Personal information" | "Preferences" | "Projects" | "Conversations" | "Routines" | "Knowledge" | "Custom instructions" | "Device information"
    - title: String (max 128)
    - content: String (max 4096)
    - tags: List<String>
    - source: "user_input" | "ai_conversation" | "command_execution" | "manual"
    - isPinned: Boolean
    - createdAt: Timestamp
    - updatedAt: Timestamp

  conversations/{conversationId}
    - id: String
    - userId: String
    - title: String
    - messageCount: Int
    - lastMessageSnippet: String
    - updatedAt: Timestamp
    /messages/{messageId}
      - id: String
      - userId: String
      - role: "user" | "model" | "system"
      - text: String (max 10000)
      - timestamp: Timestamp

  devices/{deviceId}
    - id: String
    - userId: String
    - deviceName: String
    - deviceType: "Android Phone" | "Windows PC" | "Smart Board"
    - status: "online" | "standby" | "pairing" | "revoked"
    - pairingCode: String
    - lastSyncAt: Timestamp`;

  const kotlinHandshakeSnippet = `// Kotlin (Jetpack Compose / Room) Companion Protocol
// Both Web and APK share this Firebase Project ID:
// Project: ${firebaseConfig.projectId}

@Entity(tableName = "local_memories")
data class MemoryEntity(
    @PrimaryKey val id: String,
    val userId: String,
    val category: String,
    val title: String,
    val content: String,
    val isPinned: Boolean,
    val updatedAt: Long
)

// Handshake verification
class JarvisHandshakeManager(private val firestore: FirebaseFirestore) {
    fun verifyPairing(code: String, onVerified: () -> Unit) {
        val uid = FirebaseAuth.getInstance().currentUser?.uid ?: return
        firestore.collection("users").document(uid)
            .collection("devices")
            .whereEqualTo("pairingCode", code)
            .whereEqualTo("status", "online")
            .get()
            .addOnSuccessListener { snapshot ->
                if (!snapshot.isEmpty) {
                    onVerified()
                }
            }
    }
}`;

  return (
    <div className="h-full w-full min-w-0 flex flex-col p-3.5 sm:p-6 lg:p-8 pb-8 space-y-5 max-w-7xl mx-auto overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-cyan-500/20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#050b18]/80 border border-cyan-500/20">
        <div className="min-w-0">
          <div className="text-[11px] sm:text-xs font-mono text-cyan-400/70 tracking-widest uppercase flex items-center gap-2">
            <FileCode2 size={14} className="text-cyan-400 shrink-0" />
            <span className="truncate">INTEROPERABILITY CONTRACT // KOTLIN & PWA</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-slate-100 mt-1">
            Android Companion Integration Contract
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized technical specification ensuring the native Android APK and Web PWA operate as unified clients of one secure JARVIS ecosystem.
          </p>
        </div>
      </div>

      {/* OVERVIEW ARCHITECTURE TIERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <Database size={16} />
            <span>Shared Firebase Core</span>
          </div>
          <p className="text-[11px] font-sans text-slate-400">
            Both apps bind to Firebase Project <code className="text-cyan-300 font-mono">{firebaseConfig.projectId}</code> using Firebase Auth and Cloud Firestore.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <Lock size={16} />
            <span>Attribute-Based Security</span>
          </div>
          <p className="text-[11px] font-sans text-slate-400">
            Enforced by `firestore.rules`. Zero client-side trust. All writes require <code className="text-cyan-300 font-mono">request.auth.uid == userId</code>.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/60 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <Smartphone size={16} />
            <span>Native Android Perimeter</span>
          </div>
          <p className="text-[11px] font-sans text-slate-400">
            Native APK handles wake-word foreground service, Room DB local caching, and Android Accessibility services.
          </p>
        </div>
      </div>

      {/* SCHEMA SPECIFICATION VIEWER */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#050b18] border border-cyan-500/30 space-y-3 font-mono text-xs min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-cyan-400 font-bold flex items-center gap-2 min-w-0">
            <Terminal size={16} className="shrink-0" />
            <span className="truncate">SHARED FIRESTORE SCHEMA</span>
          </div>
          <button
            onClick={() => copyCode(schemaSnippet, 'schema')}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-[11px] transition-colors shrink-0"
          >
            {copiedSection === 'schema' ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedSection === 'schema' ? 'Copied' : 'Copy Schema'}</span>
          </button>
        </div>

        <pre className="w-full max-w-full p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-cyan-500/20 text-slate-300 overflow-x-auto text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-cyan-500/20">
          {schemaSnippet}
        </pre>
      </div>

      {/* KOTLIN COMPANION SAMPLE CODE */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#050b18] border border-cyan-500/30 space-y-3 font-mono text-xs min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-cyan-400 font-bold flex items-center gap-2 min-w-0">
            <Cpu size={16} className="shrink-0" />
            <span className="truncate">KOTLIN COMPANION HANDSHAKE</span>
          </div>
          <button
            onClick={() => copyCode(kotlinHandshakeSnippet, 'kotlin')}
            className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-[11px] transition-colors shrink-0"
          >
            {copiedSection === 'kotlin' ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedSection === 'kotlin' ? 'Copied' : 'Copy Kotlin Code'}</span>
          </button>
        </div>

        <pre className="w-full max-w-full p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-cyan-500/20 text-slate-300 overflow-x-auto text-[11px] leading-relaxed scrollbar-thin scrollbar-thumb-cyan-500/20">
          {kotlinHandshakeSnippet}
        </pre>
      </div>
    </div>
  );
};
