// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");

const letterWindow = document.querySelector(".letter-window");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Evita drag raro en iOS
noBtn.draggable = false;
yesBtn.draggable = false;

// Helpers
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

let noReady = false;

function ensureNoIsChildOfWindow() {
  // NO debe ser hijo directo de letter-window para posicionarlo bien
  if (noBtn.parentElement !== letterWindow) {
    letterWindow.appendChild(noBtn);
  }
}

// Coloca el NO visible SIEMPRE en vertical (sin depender del YES)
function placeNoInitial() {
  if (!letterWindow || !noBtn) return;

  ensureNoIsChildOfWindow();

  // Fuerza estilos base
  noBtn.style.display = "block";
  noBtn.style.position = "absolute";
  noBtn.style.transform = "none";
  noBtn.style.zIndex = "999";
  noBtn.style.pointerEvents = "auto";

  const w = letterWindow.getBoundingClientRect();

  // Si la imagen aún no cargó, reintenta un poquito después
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  if (btnW === 0 || btnH === 0) {
    setTimeout(placeNoInitial, 80);
    return;
  }

  const padding = 12;

  // Queremos que inicie en la banda inferior, a la derecha del centro
  // (como si estuviera al lado del YES)
  const bottom = 18; // coincide con tu CSS móvil (.buttons bottom: 18px)
  const top = clamp(w.height - bottom - btnH, padding, w.height - padding - btnH);

  const gap = 16;
  const centerX = w.width / 2;
  const left = clamp(centerX + gap, padding, w.width - padding - btnW);

  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;

  noReady = true;
}

function moveNoInsideWindow() {
  if (!letterWindow || !noBtn) return;

  if (!noReady) placeNoInitial();

  const w = letterWindow.getBoundingClientRect();
  const padding = 12;

  const btnW = noBtn.offsetWidth || 120;
  const btnH = noBtn.offsetHeight || 60;

  const minLeft = padding;
  const maxLeft = Math.max(minLeft, w.width - padding - btnW);

  // Banda inferior para que se vea natural
  const bandHeight = Math.min(190, w.height * 0.38);
  const minTop = Math.max(padding, w.height - bandHeight);
  const maxTop = Math.max(minTop, w.height - padding - btnH);

  const newLeft = rand(minLeft, maxLeft);
  const newTop = rand(minTop, maxTop);

  noBtn.style.transition = "left 0.18s ease, top 0.18s ease";
  noBtn.style.left = `${newLeft}px`;
  noBtn.style.top = `${newTop}px`;
}

// Click Envelope
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    letterWindow.classList.add("open");

    // Espera a que el layout + imágenes se asienten
    requestAnimationFrame(() => placeNoInitial());
    setTimeout(placeNoInitial, 120);
    setTimeout(placeNoInitial, 250);
  }, 50);
});

// Desktop hover
noBtn.addEventListener("pointerenter", moveNoInsideWindow);

// Mobile tap
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoInsideWindow();
});

// iOS Safari extra
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoInsideWindow();
  },
  { passive: false }
);

// Recalcula si cambia tamaño / rotación
window.addEventListener("resize", () => {
  noReady = false;
  if (letter.style.display === "flex") {
    requestAnimationFrame(() => placeNoInitial());
  }
});

// YES is clicked
yesBtn.addEventListener("click", () => {
  title.textContent = "Yippeeee!";
  catImg.src = "cat_dance.gif";

  letterWindow.classList.add("final");
  buttons.style.display = "none";

  // Oculta NO por si quedó flotando
  noBtn.style.display = "none";

  finalText.style.display = "block";
});
