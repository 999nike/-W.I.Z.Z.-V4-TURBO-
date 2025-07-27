const memoryStore = {
  name: "DevMaster",
  traits: ["Project Commander", "Builder"],
  reminders: ["Always follow DevMaster"],
  overrideMode: false
};

function loadMemory() {
  const raw = localStorage.getItem("cloudWizzMemory");
  if (raw) Object.assign(memoryStore, JSON.parse(raw));
}

function saveMemory() {
  localStorage.setItem("cloudWizzMemory", JSON.stringify(memoryStore));
}

function rememberName(name) {
  memoryStore.name = name;
  saveMemory();
  return `✅ Got it. I'll call you ${name}.`;
}

function addTrait(trait) {
  if (!memoryStore.traits.includes(trait)) memoryStore.traits.push(trait);
  saveMemory();
}

function addReminder(note) {
  memoryStore.reminders.push(note);
  saveMemory();
}