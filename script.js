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

const noWrapper = document.querySelector(".no-wrapper");

// Evita drag raro en iOS
noBtn.draggable = false;
yesBtn.draggable = false;

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

let noInitialized = false;

function initNoAbsolutePosition() {
  if (noInitialized) return;

  // 1) Guardamos la posición actual ANTES de moverlo de lugar en el DOM
  const wRect = letterWindow.getBoundingClientRect();
  const bRect = noBtn.getBoundingClientRect();

  // 2) Mover el NO a ser HIJO DIRECTO del marco (letter-window)
  //    (así position:absolute se calcula dentro del marco)
  if (noBtn.parentElement !== letterWindow) {
    // Oculta el wrapper para que no “reserve espacio” raro
    if (noWrapper) noWrapper.style.display = "none";
    letterWindow.appendChild(noBtn);
  }

  // 3) Convertimos a absolute dentro del marco
  const startLeft = bRect.left - wRect.left;
  const startTop = bRect.top - wRect.top;

  noBtn.style.transform = "none";
  noBtn.style.position = "absolute";
  noBtn.style.left = `${startLeft}px`;
  noBtn.style.top = `${startTop}px`;
  noBtn.style.zIndex = "999";
  noBtn.style.display = "block";

  noInitialized = true;
}

function moveNoInsideWindow() {
  if (!letterWindow) return;

  initNoAbsolutePosition();

  const padding = 12;
  const w = letterWindow.getBoundingClientRect();

  // Tamaño real del botón (ya dentro del marco)
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  // límites horizontales
  const minLeft = padding;
  const maxLeft = Math.max(minLeft, w.width - padding - btnW);

  // banda inferior (zona de botones)
  const bandHeight = Math.min(170, w.height * 0.35);
  const minTop = Math.max(padding, w.height - bandHeight);
  const maxTop = Math.max(minTop, w.height - padding - btnH);

  const newLeft = clamp(rand(minLeft, maxLeft), minLeft, maxLeft);
  const newTop = clamp(rand(minTop, maxTop), minTop, maxTop);

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

    // cuando ya está visible, inicializa posición del NO
    requestAnimationFrame(() => {
      initNoAbsolutePosition();
    });
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

// Recalcular si cambia tamaño / rotación
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

  // también ocultamos NO por si quedó flotando
  noBtn.style.display = "none";

  finalText.style.display = "block";
});
