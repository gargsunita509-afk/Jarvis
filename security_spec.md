# Security Specification & Threat Model — JARVIS AI Ecosystem

## 1. Data Invariants
1. **User Scoping & Isolation**: All user-specific data (profile, preferences, memories, conversations, messages, custom commands, automations, devices) must be stored strictly within the user's root subcollections (`/users/{userId}/*`).
2. **Identity Integrity**: `request.auth.uid` must match `{userId}` in all paths. No authenticated user may read, create, mutate, or delete another user's documents.
3. **Payload Sanitization**: Incoming documents must have validated keys, type checks, and string length caps (e.g. content <= 4096 bytes, names <= 128 chars, IDs conforming to `^[a-zA-Z0-9_\-]+$`).
4. **Immutable Fields**: `userId`, `createdAt`, and document `id` are immutable once created.
5. **No Orphaned Records**: Sub-resources (e.g. conversation messages) must belong to a parent resource owned by the same user.
6. **No Client Query Reliance**: Security cannot assume clients supply `where('userId', '==', ...)` correctly; `allow list` explicitly validates that `{userId} == request.auth.uid`.

## 2. The "Dirty Dozen" Malicious Payloads (Targeting PERMISSION_DENIED)
1. **P1 (Cross-User Read)**: Unauthenticated or user `attacker_123` querying `/users/victim_456/memories`.
2. **P2 (Identity Spoofing on Create)**: User `attacker_123` sending `userId: "victim_456"` to `/users/attacker_123/memories/m1`.
3. **P3 (ID Poisoning Attack)**: Injecting 200KB junk unicode characters into document ID `{memoryId}`.
4. **P4 (Shadow Field Attack)**: Sending `isAdmin: true` or `systemBypass: true` within a `UserProfile` write.
5. **P5 (Volumetric Denial of Wallet)**: Sending a 10MB memory payload exceeding `maxLength: 4096`.
6. **P6 (Immutability Bypass)**: An update to `/users/{userId}/memories/{memoryId}` attempting to rewrite `userId` or `createdAt`.
7. **P7 (Malformed Command Action)**: Creating a `CustomCommand` with invalid `actionIdentifier` or illegal characters.
8. **P8 (Unauthenticated Automation Write)**: Anonymous / unauthenticated request to inject an automation.
9. **P9 (Cross-Tenant Device Pairing)**: Adding an unauthorized `Device` under another user's path.
10. **P10 (Terminal State Tampering)**: Modifying a revoked device status directly back to active without authorized pairing credentials.
11. **P11 (Unauthenticated Catch-all Root Read)**: Reading root collections directly.
12. **P12 (Orphaned Message Injection)**: Writing a message to `/users/user_1/conversations/c1/messages/m1` when `c1` does not exist.

## 3. Test Runner Specification
All 12 malicious payloads must receive `PERMISSION_DENIED` under Firestore Rules version 2.
