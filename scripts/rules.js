function applyOverrideMode() {
  memoryStore.overrideMode = true;
  addReminder("Override mode active.");
  saveMemory();
}

function getMemorySummary() {
  return `👤 You are ${memoryStore.name}.
🧬 Traits: ${memoryStore.traits.join(", ")}
📌 Reminders: ${memoryStore.reminders.join("\n")}`;
}