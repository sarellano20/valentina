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

// ===== Helpers =====
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

let noReady = false;

function placeNoNextToYes() {
  if (!letterWindow || !yesBtn || !noBtn) return;

  // Mover NO como hijo directo del marco (para controlar bien los límites)
  if (noBtn.parentElement !== letterWindow) {
    letterWindow.appendChild(noBtn);
  }

  // Medidas
  const w = letterWindow.getBoundingClientRect();
  const y = yesBtn.getBoundingClientRect();

  // Estilo absoluto dentro del marco
  noBtn.style.position = "absolute";
  noBtn.style.transform = "none";
  noBtn.style.display = "block";
  noBtn.style.zIndex = "999";

  // Ponlo al lado del YES (misma línea)
  const gap = 16;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  // Left = a la derecha del YES
  let left = (y.left - w.left) + y.width + gap;
  // Top = mismo top que YES
  let top = (y.top - w.top);

  // Clamp para que jamás salga del marco
  const padding = 12;
  const maxLeft = Math.max(padding, w.width - padding - btnW);
  const maxTop = Math.max(padding, w.height - padding - btnH);

  left = clamp(left, padding, maxLeft);
  top  = clamp(top, padding, maxTop);

  noBtn.style.left = `${left}px`;
  noBtn.style.top  = `${top}px`;

  noReady = true;
}

function moveNoInsideWindow() {
  if (!letterWindow) return;
  if (!noReady) placeNoNextToYes();

  const w = letterWindow.getBoundingClientRect();

  const padding = 12;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  // límites horizontales dentro del marco
  const minLeft = padding;
  const maxLeft = Math.max(minLeft, w.width - padding - btnW);

  // banda inferior (zona donde están los botones)
  const bandHeight = Math.min(190, w.height * 0.38);
  const minTop = Math.max(padding, w.height - bandHeight);
  const maxTop = Math.max(minTop, w.height - padding - btnH);

  const newLeft = rand(minLeft, maxLeft);
  const newTop  = rand(minTop, maxTop);

  noBtn.style.transition = "left 0.18s ease, top 0.18s ease";
  noBtn.style.left = `${newLeft}px`;
  noBtn.style.top  = `${newTop}px`;
}

// Click Envelope
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    letterWindow.classList.add("open");

    // cuando ya está visible, colocamos NO al lado del YES
    requestAnimationFrame(() => {
      placeNoNextToYes();
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
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoInsideWindow();
}, { passive: false });

// Recalcula si cambia el tamaño / rotación
window.addEventListener("resize", () => {
  noReady = false;
  if (letter.style.display === "flex") {
    requestAnimationFrame(() => placeNoNextToYes());
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
