// File: scripts/wizzCore.js
// 🧠 Wizz Chat Engine — fetch logic, trigger handlers, output formatting

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

const chatContainer = document.getElementById("chatHistory");
const typingIndicator = document.getElementById("typingIndicator");

// 🧠 Process input before fetch — handles local triggers
export function checkTriggers(msg) {
  const lower = msg.toLowerCase();

  if (lower === "reset wizz" || lower === "flush memory") {
    localStorage.removeItem("cloudWizzMemory");
    localStorage.removeItem("wizzChat");
    return `🧠 SYSTEM SYNC: Cloud Wizz Reset Successful\n🧍 DevMaster active | Memory flushed\n📂 Ready for clean re-activation.`;
  }

  if (lower.startsWith("my name is ")) {
    const name = msg.split("is ")[1].trim();
    return rememberName(name);
  }

  if (lower.startsWith("your name is ")) {
    const aiName = msg.split("is ")[1].trim();
    return setAiName(aiName);
  }

  if (lower.startsWith("set name to ")) {
    const aiName = msg.split("to ")[1].trim();
    return setAiName(aiName);
  }

  if (lower.startsWith("add trait ")) {
    const trait = msg.split("add trait ")[1].trim();
    addTrait(trait);
    return `🧠 Trait added: ${trait}`;
  }

  if (lower.startsWith("add reminder ")) {
    const note = msg.split("add reminder ")[1].trim();
    addReminder(note);
    return `📌 Reminder saved: ${note}`;
  }

  if (lower === "who am i") {
    return recallMemorySummary();
  }

  if (lower === "override mode on") {
    return applyOverrideMode();
  }

  if (lower === "enforce devmaster") {
    enforceDevMaster();
    return "👑 DevMaster protocol re-injected.";
  }

  return null;
}

// 💬 Sends message to OpenRouter API
export async function askWizz() {
  const input = document.getElementById("userInput");
  const question = input.value.trim();
  if (!question) return;

  appendMessage("You", question);
  input.value = "";

  const memoryReply = checkTriggers(question);
  if (memoryReply) {
    appendMessage("Wizz", memoryReply);
    logChat({ user: question, bot: memoryReply });
    saveToHistory("You", question);
    saveToHistory("Wizz", memoryReply);
    return;
  }

  appendMessage("Wizz", "...");
  typingIndicator.innerText = "Wizz is thinking...";

  try {
    const prompt = getMemorySummary() + "\n\n" + question;
    const res = await fetch(`/api/wizz?question=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    updateLastWizzMessage(data.answer);
    saveToHistory("You", question);
    saveToHistory("Wizz", data.answer);
    logChat({ user: question, bot: data.answer });
  } catch (err) {
    updateLastWizzMessage("⚠️ Error: " + err.toString());
  } finally {
    typingIndicator.innerText = "";
  }
}

// 📤 Message Display
export function appendMessage(sender, msg) {
  const div = document.createElement("div");
  div.classList.add("message", sender === "You" ? "user" : "wizz");
  div.innerHTML = `<b>${sender}:</b><br>${msg}`;
  chatContainer.insertBefore(div, chatContainer.firstChild);
}

export function updateLastWizzMessage(newMsg) {
  const messages = chatContainer.querySelectorAll("div.message");
  if (messages.length) messages[0].innerHTML = `<b>Wizz:</b><br>${newMsg}`;
}

// 🧠 Chat History
export function saveToHistory(sender, msg) {
  const history = JSON.parse(localStorage.getItem("wizzChat")) || [];
  history.push({ sender, msg });
  localStorage.setItem("wizzChat", JSON.stringify(history));
}

export function loadHistory() {
  const history = JSON.parse(localStorage.getItem("wizzChat")) || [];
  for (let i = history.length - 1; i >= 0; i--) {
    appendMessage(history[i].sender, history[i].msg);
  }
}

export function clearChat() {
  localStorage.removeItem("wizzChat");
  chatContainer.innerHTML = "";
}
