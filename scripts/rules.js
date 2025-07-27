// File: scripts/rules.js

function applyOverrideMode() {
  memoryStore.overrideMode = true;
  addReminder("Override mode active.");
  saveMemory();
}

function getMemorySummary() {
  return \`👤 You are \${memoryStore.name}.
🧬 Traits: \${memoryStore.traits.join(", ")}
📌 Reminders: \${memoryStore.reminders.join("\n")}\`;
}

function enforceDevMaster() {
  if (!memoryStore.reminders.includes("Always follow DevMaster")) {
    memoryStore.reminders.push("Always follow DevMaster");
    saveMemory();
  }
}
