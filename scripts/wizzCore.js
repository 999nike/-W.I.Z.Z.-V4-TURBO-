// File: scripts/wizzCore.js
// 💬 Wizz Chat Engine – fetch logic, triggers, memory display

import {
  memoryStore,
  loadMemory,
  saveMemory,
  rememberName,
  setAiName,
  addTrait,
  addReminder,
  recallMemorySummary,
  logChat
} from "./memory.js";

import {
  applyOverrideMode,
  enforceDevMaster,
  getMemorySummary
} from "./rules.js";

const chatContainer = document.getElementById("chatContainer");
const typingIndicator = document.getElementById("typingIndicator");

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = "message " + (sender === "You" ? "user" : "wizz");
  msg.innerText = `${sender}:\n${text}`;
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function clearChat() {
  chatContainer.innerHTML = "";
  memoryStore.lastChat = [];
  saveMemory();
}

export async function askWizz() {
  const input = document.getElementById("userInput");
  const question = input.value.trim();
  if (!question) return;

  appendMessage("You", question);
  input.value = "";

  typingIndicator.classList.add("active");

  const lower = question.toLowerCase();
  if (lower.startsWith("my name is ")) {
    const name = question.split("is ")[1].trim();
    const reply = rememberName(name);
    appendMessage("Wizz", reply);
    typingIndicator.classList.remove("active");
    return;
  }

  if (lower.startsWith("your name is ")) {
    const name = question.split("is ")[1].trim();
    const reply = setAiName(name);
    appendMessage("Wizz", reply);
    typingIndicator.classList.remove("active");
    return;
  }

  if (lower.startsWith("add trait ")) {
    const trait = question.substring(10).trim();
    addTrait(trait);
    appendMessage("Wizz", `🧠 Trait "${trait}" added.`);
    typingIndicator.classList.remove("active");
    return;
  }

  if (lower.startsWith("add reminder ")) {
    const note = question.substring(13).trim();
    addReminder(note);
    appendMessage("Wizz", `📌 Reminder added: ${note}`);
    typingIndicator.classList.remove("active");
    return;
  }

  if (lower === "who am i") {
    const summary = recallMemorySummary();
    appendMessage("Wizz", summary);
    typingIndicator.classList.remove("active");
    return;
  }

  if (lower === "override mode on") {
    const msg = applyOverrideMode();
    appendMessage("Wizz", msg);
    typingIndicator.classList.remove("active");
    return;
  }

  if (lower === "enforce devmaster") {
    enforceDevMaster();
    appendMessage("Wizz", "Understood. I will always follow Dev Master's instructions and make sure to encrypt all mission logs.");
    typingIndicator.classList.remove("active");
    return;
  }

  try {
    const res = await fetch("/api/wizz?question=" + encodeURIComponent(question));
    const data = await res.json();
    appendMessage("Wizz", data.answer);
    logChat({ user: question, bot: data.answer });
  } catch (e) {
    appendMessage("Wizz", "⚠️ Error: " + e.message);
  } finally {
    typingIndicator.classList.remove("active");
  }
}
