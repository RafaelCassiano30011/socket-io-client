import './styles/main.css';
import { connectSocket } from './js/socket';
import { addEvent, restoreEvents } from './js/events';
import { addGlobalInput, restoreGlobals } from './js/globals';

// Expor funções para o escopo global
window.connectSocket = connectSocket;
window.addEvent = addEvent;
window.addGlobalInput = addGlobalInput;

// Inicializar
window.onload = () => {
  restoreGlobals();
  restoreEvents();
}; 