// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const letterWindow = document.querySelector(".letter-window");

// Evita drag raro en iOS
noBtn.draggable = false;
yesBtn.draggable = false;

// ===== Helpers =====
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

let noInitialized = false;

function initNoAbsolutePosition() {
  if (noInitialized) return;

  // Convertimos el NO a absolute dentro de la letter-window
  const wRect = letterWindow.getBoundingClientRect();
  const bRect = noBtn.getBoundingClientRect();

  const startLeft = bRect.left - wRect.left;
  const startTop = bRect.top - wRect.top;

  noBtn.style.transform = "none";
  noBtn.style.position = "absolute";
  noBtn.style.left = `${startLeft}px`;
  noBtn.style.top = `${startTop}px`;
  noBtn.style.zIndex = "10";

  noInitialized = true;
}

function moveNoInsideWindow() {
  if (!letterWindow) return;

  // Asegura que ya esté en absolute antes de mover
  initNoAbsolutePosition();

  const padding = 12;

  const w = letterWindow.getBoundingClientRect();

  // Tamaño real del botón
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  // Área permitida (dentro del marco)
  const maxLeft = Math.max(padding, w.width - padding - btnW);

  // Banda inferior (donde están los botones), para que se vea como tu imagen
  const bandHeight = Math.min(170, w.height * 0.35);
  const minTop = Math.max(padding, w.height - bandHeight);
  const maxTop = Math.max(minTop, w.height - padding - btnH);

  // Random dentro de límites
  const newLeft = clamp(rand(padding, maxLeft), padding, maxLeft);
  const newTop = clamp(rand(minTop, maxTop), minTop, maxTop);

  // Movemos con left/top (NO translate), así nunca se recorta por overflow
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

    // Espera a que el layout exista en pantalla y luego inicializa el NO
    requestAnimationFrame(() => {
      initNoAbsolutePosition();
    });
  }, 50);
});

// Desktop: hover
noBtn.addEventListener("pointerenter", moveNoInsideWindow);

// Mobile: tap (lo movemos al tocar)
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoInsideWindow();
});

// iOS Safari extra (por si pointer no dispara bien)
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoInsideWindow();
  },
  { passive: false }
);

// Recalcula al rotar / resize
window.addEventListener("resize", () => {
  noInitialized = false;
  if (letter.style.display === "flex") {
    requestAnimationFrame(() => initNoAbsolutePosition());
  }
});

// YES is clicked
yesBtn.addEventListener("click", () => {
  title.textContent = "Yippeeee!";
  catImg.src = "cat_dance.gif";
  letterWindow.classList.add("final");
  buttons.style.display = "none";
  finalText.style.display = "block";
});
