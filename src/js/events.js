import { log } from "./logger.js";
import { replacePlaceholders } from "./globals.js";

let socket;

export function setSocket(socketInstance) {
  socket = socketInstance;
}

export function emitThisEvent(btn) {
  const block = btn.closest(".event-block");
  const eventName = block.querySelector(".event-name").value;
  const payloadText = block.querySelector(".json-editor").CodeMirror.getValue();

  try {
    let payload = JSON.parse(payloadText);
    const payloadString = JSON.stringify(payload);
    const replacedPayloadString = replacePlaceholders(payloadString);
    payload = JSON.parse(replacedPayloadString);

    socket.emit(eventName, payload);
    log(`📤 ${eventName}: ${JSON.stringify(payload)}`, "event");
  } catch (err) {
    log(`❗ Erro no JSON: ${err.message}`, "error");
  }
}

export function addEvent(name = "", payload = '{ "texto": "teste" }') {
  const wrapper = document.createElement("div");
  wrapper.className = "event-block bg-slate-800 p-4 rounded space-y-2 border border-slate-700";

  wrapper.innerHTML = `
    <label class="block text-sm font-medium">Nome do evento</label>
    <input type="text" class="event-name w-full p-2 rounded bg-slate-700 border border-slate-600 focus:ring-2 focus:ring-green-500 focus:outline-none" placeholder="ex: mensagem" value="${name}" />

    <label class="block text-sm font-medium">Payload (JSON)</label>
    <div class="json-editor" style="height: 150px;"></div>

    <div class="flex gap-2 pt-2">
      <button class="emit-event btn bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded shadow-md">Emitir</button>
      <button class="remove-event btn bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded shadow-md">Remover</button>
    </div>
  `;

  wrapper.querySelector(".emit-event", (e) => emitThisEvent(e.target));
  wrapper.querySelector(".remove-event", (e) => removeEvent(e.target));

  document.getElementById("events").appendChild(wrapper);

  let formattedPayload = payload;
  try {
    formattedPayload = JSON.stringify(JSON.parse(payload), null, 2);
  } catch {}

  const editor = CodeMirror(wrapper.querySelector(".json-editor"), {
    value: formattedPayload,
    mode: "application/json",
    theme: "default",
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    autoCloseBrackets: true,
    matchBrackets: true,
  });

  editor.on("change", saveEventsToLocalStorage);
  wrapper.querySelector(".event-name").addEventListener("input", saveEventsToLocalStorage);

  wrapper.querySelector(".json-editor").CodeMirror = editor;
  saveEventsToLocalStorage();
}

export function removeEvent(btn) {
  btn.closest(".event-block").remove();
  saveEventsToLocalStorage();
}

function saveEventsToLocalStorage() {
  const blocks = [...document.querySelectorAll(".event-block")];
  const data = blocks.map((block) => {
    const name = block.querySelector(".event-name").value;
    const payload = block.querySelector(".json-editor").CodeMirror.getValue();
    return { name, payload };
  });
  localStorage.setItem("socketio_events", JSON.stringify(data));
}

export function restoreEvents() {
  const saved = localStorage.getItem("socketio_events");
  if (saved) {
    try {
      const events = JSON.parse(saved);
      events.forEach((ev) => addEvent(ev.name, ev.payload));
    } catch {
      addEvent();
    }
  } else {
    addEvent();
  }
}
