import { log } from "./logger.js";

const globalVariables = {};

export function setGlobalVariable(key, value) {
  globalVariables[key] = value;
  log(`🌐 Variável global definida: ${key} = ${value}`, "success");
}

export function replacePlaceholders(payload) {
  return payload.replace(/\$(\w+)/g, (_, key) => {
    if (globalVariables[key] !== undefined) {
      return globalVariables[key];
    }
    log(`⚠️ Placeholder ${key} não encontrado nas variáveis globais`, "warning");
    return `$${key}`;
  });
}

export function addGlobalInput(key = "", value = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "flex gap-2 items-center";

  wrapper.innerHTML = `
    <input type="text" placeholder="chave" value="${key}" class="key-input w-1/3 p-2 rounded bg-slate-700 border border-slate-600" />
    <input type="text" placeholder="valor" value="${value}" class="value-input w-2/3 p-2 rounded bg-slate-700 border border-slate-600" />
    <button class="remove-global btn text-red-400 hover:text-red-300 text-sm px-2 py-1">🗑️</button>
  `;

  document.getElementById("globals").appendChild(wrapper);

  wrapper.querySelector(".key-input").addEventListener("input", saveGlobalsToLocalStorage);
  wrapper.querySelector(".value-input").addEventListener("input", saveGlobalsToLocalStorage);
  wrapper.querySelector(".remove-global").addEventListener("click", (e) => removeGlobalInput(e.target));

  saveGlobalsToLocalStorage();
}

export function removeGlobalInput(btn) {
  btn.closest("div").remove();
  saveGlobalsToLocalStorage();
}

function saveGlobalsToLocalStorage() {
  const items = [...document.querySelectorAll("#globals > div")];
  const vars = {};

  items.forEach((row) => {
    const key = row.querySelector(".key-input").value;
    const value = row.querySelector(".value-input").value;
    if (key) {
      vars[key] = value;
    }
  });

  localStorage.setItem("socketio_globals", JSON.stringify(vars));

  Object.entries(vars).forEach(([k, v]) => setGlobalVariable(k, v));
}

export function restoreGlobals() {
  const saved = localStorage.getItem("socketio_globals");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([key, value]) => {
        addGlobalInput(key, value);
        setGlobalVariable(key, value);
      });
    } catch {
      addGlobalInput();
    }
  } else {
    addGlobalInput();
  }
}
