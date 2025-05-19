export function log(text, type = "event") {
  const logDiv = document.getElementById("log");
  const logEntry = document.createElement("div");
  logEntry.className = `log-entry ${type}`;
  logEntry.textContent = text;
  logDiv.appendChild(logEntry);
  logDiv.scrollTop = logDiv.scrollHeight;
} 