import { log } from './logger.js';
import { setSocket } from './events.js';

export function connectSocket() {
  const url = document.getElementById("url").value;
  const socket = io(url);

  log(`🔌 Conectando a ${url}...`, "event");

  socket.on("connect", () => log("✅ Conectado com ID: " + socket.id, "success"));
  socket.onAny((event, data) => log(`📥 ${event}: ${JSON.stringify(data)}`, "event"));
  socket.on("disconnect", () => log("❌ Desconectado", "error"));

  setSocket(socket);
} 