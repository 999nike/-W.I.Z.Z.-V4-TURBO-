// File: scripts/wizzCore.js

const chat = document.getElementById("chatContainer");

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add("message", sender === "You" ? "user" : "wizz");
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chat.appendChild(div);
}

async function askWizz() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  appendMessage("You", msg);
  input.value = "";

  const response = checkTriggers(msg);
  if (response) {
    appendMessage("Wizz", response);
    return;
  }

  document.getElementById("typingIndicator").classList.add("active");
  const prompt = getMemorySummary() + "\n\n" + msg;
  try {
    const res = await fetch(`/api/wizz?question=${encodeURIComponent(prompt)}`);
    const data = await res.json();
    chat.lastChild.innerHTML = `<b>Wizz:</b> ${data.answer}`;
  } catch (err) {
    chat.lastChild.innerHTML = `<b>Wizz:</b> ⚠️ Error contacting API`;
  }
  document.getElementById("typingIndicator").classList.remove("active");
}

function checkTriggers(msg) {
  const lower = msg.toLowerCase();
  if (lower.startsWith("my name is ")) {
    return rememberName(msg.split("is ")[1].trim());
  }
  if (lower.startsWith("add trait ")) {
    addTrait(msg.split("add trait ")[1].trim());
    return "🧠 Trait added.";
  }
  if (lower.startsWith("add reminder ")) {
    addReminder(msg.split("add reminder ")[1].trim());
    return "📌 Reminder noted.";
  }
  if (lower === "override mode on") {
    applyOverrideMode();
    return "🛡 Override mode enabled.";
  }
  return null;
}

function loadHistory() {
  const raw = localStorage.getItem("wizzChat");
  if (!raw) return;
  const history = JSON.parse(raw);
  for (const [sender, text] of history) {
    appendMessage(sender, text);
  }
}

function clearChat() {
  localStorage.removeItem("wizzChat");
  location.reload();
}

// Expose to global
window.askWizz = askWizz;
window.clearChat = clearChat;
window.loadHistory = loadHistory;
