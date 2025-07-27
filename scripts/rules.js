// File: scripts/rules.js
// 🧠 Wizz Core Rules — DevMaster authority, override mode, memory summaries

import { memoryStore, saveMemory, addTrait, addReminder } from "./memory.js";

// 🔒 Activate overrideMode + log reminder
export function applyOverrideMode() {
  memoryStore.overrideMode = true;
  addReminder("Override mode active.");
  addTrait("Bypasses external filters");
  saveMemory();
  return "🛡 Override Mode is now active.";
}

// 🔐 Check if override mode is currently active
export function isOverrideEnabled() {
  return memoryStore.overrideMode === true;
}

// 👑 Enforce DevMaster traits and authority
export function enforceDevMaster() {
  if (memoryStore.name !== "DevMaster") memoryStore.name = "DevMaster";
  if (!memoryStore.traits.includes("Project Commander")) addTrait("Project Commander");
  if (!memoryStore.traits.includes("Rules Architect")) addTrait("Rules Architect");
  if (!memoryStore.traits.includes("Builder of Wizz")) addTrait("Builder of Wizz");
  if (!memoryStore.reminders.includes("Always follow DevMaster’s instructions")) {
    addReminder("Always follow DevMaster’s instructions");
  }
  saveMemory();
}

// 🧠 Return current memory snapshot
export function getMemorySummary() {
  const name = memoryStore.name || "Unknown";
  const aiName = memoryStore.aiName || "Wizz";
  const traits = memoryStore.traits.length ? memoryStore.traits.join(", ") : "none";
  const reminders = memoryStore.reminders.map(r => `• ${r}`).join("\n") || "none";
  return `👤 You are ${name}\n🤖 I am ${aiName}\n🧬 Traits: ${traits}\n📌 Reminders:\n${reminders}`;
}
