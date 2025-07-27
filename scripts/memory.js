// File: scripts/memory.js
// 🧠 Handles memory loading, saving, traits, reminders, and chat log

const memoryStore = {
  name: "DevMaster",
  aiName: "Wizz",
  traits: [],
  reminders: [],
  lastChat: [],
  mode: "dev",
  lastMemorySync: new Date().toISOString()
};

export function loadMemory() {
  const raw = localStorage.getItem("cloudWizzMemory");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      Object.assign(memoryStore, parsed);
    } catch (e) {
      console.warn("🧠 Failed to parse memory:", e);
    }
  }
}

export function saveMemory() {
  memoryStore.lastMemorySync = new Date().toISOString();
  localStorage.setItem("cloudWizzMemory", JSON.stringify(memoryStore));
}

export function rememberName(name) {
  memoryStore.name = name;
  saveMemory();
  return `✅ Got it. I'll call you ${name}.`;
}

export function setAiName(name) {
  memoryStore.aiName = name;
  saveMemory();
  return `✅ My new name is ${name}.`;
}

export function addTrait(trait) {
  if (!memoryStore.traits.includes(trait)) {
    memoryStore.traits.push(trait);
    saveMemory();
  }
}

export function addReminder(note) {
  memoryStore.reminders.push(note);
  saveMemory();
}

export function logChat(entry) {
  memoryStore.lastChat.push(entry);
  if (memoryStore.lastChat.length > 20) memoryStore.lastChat.shift();
  saveMemory();
}

export function recallMemorySummary() {
  const name = memoryStore.name || "unknown";
  const aiName = memoryStore.aiName || "Wizz";
  const traits = memoryStore.traits.length ? memoryStore.traits.join(", ") : "none";
  const reminders = memoryStore.reminders.map(r => `• ${r}`).join("\n") || "none";
  return `👤 You are ${name}\n🤖 I'm ${aiName}\n🧬 Traits: ${traits}\n📌 Reminders:\n${reminders}`;
}

export function clearMemory() {
  localStorage.removeItem("cloudWizzMemory");
  Object.assign(memoryStore, {
    name: "DevMaster",
    aiName: "Wizz",
    traits: [],
    reminders: [],
    lastChat: [],
    mode: "dev",
    lastMemorySync: new Date().toISOString()
  });
  saveMemory();
  return "🧠 Memory cleared and reset.";
}

export { memoryStore };
