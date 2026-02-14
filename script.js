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

// iOS: evita drag de imágenes
noBtn.draggable = false;
yesBtn.draggable = false;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function isMobile() {
  return window.matchMedia("(max-width: 480px)").matches;
}

function ensureNoAbsoluteInArena() {
  // En móvil: el NO se controla dentro de la arena (#letter-buttons)
  if (!isMobile()) {
    // Desktop: vuelve a normal (por si rotaste)
    noBtn.style.position = "";
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.transform = "";
    return;
  }

  // En móvil: fuerza absolute dentro de la arena, sin translate (para mover con left/top)
  noBtn.style.position = "absolute";
  noBtn.style.transform = "translateX(20%)"; // posición inicial a la derecha del centro
  noBtn.style.top = "0px";
  noBtn.style.left = "50%";
  noBtn.style.display = "block";
  noBtn.style.zIndex = "60";
}

function moveNoInsideArena() {
  if (!isMobile()) {
    // Desktop: tu comportamiento original (translate) si quieres
    const distance = 200;
    const angle = Math.random() * Math.PI * 2;
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    return;
  }

  // MOBILE: mover dentro de la arena con left/top (nunca se sale)
  const arena = buttons; // #letter-buttons
  if (!arena) return;

  // IMPORTANT: quitar translate para mover con coordenadas reales
  noBtn.style.transform = "none";

  const pad = 8;
  const arenaW = arena.clientWidth;
  const arenaH = arena.clientHeight;

  const btnW = noBtn.offsetWidth || 120;
  const btnH = noBtn.offsetHeight || 60;

  // limites dentro de la arena
  const minLeft = pad;
  const maxLeft = Math.max(minLeft, arenaW - pad - btnW);

  const minTop = 0;
  const maxTop = Math.max(minTop, arenaH - btnH);

  const newLeft = clamp(rand(minLeft, maxLeft), minLeft, maxLeft);
  const newTop = clamp(rand(minTop, maxTop), minTop, maxTop);

  noBtn.style.transition = "left 0.18s ease, top 0.18s ease";
  noBtn.style.left = `${newLeft}px`;
  noBtn.style.top = `${newTop}px`;
}

// Open letter
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    letterWindow.classList.add("open");

    // Asegura que NO aparezca bien desde el inicio (vertical)
    requestAnimationFrame(() => {
      ensureNoAbsoluteInArena();
    });

    // Reintento extra por iOS (cuando termina de calcular layout)
    setTimeout(() => ensureNoAbsoluteInArena(), 120);
  }, 50);
});

// Desktop hover
noBtn.addEventListener("pointerenter", moveNoInsideArena);

// Mobile tap
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoInsideArena();
});

// iOS Safari extra
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoInsideArena();
  },
  { passive: false }
);

// Si rotas / cambia tamaño: reponer NO
window.addEventListener("resize", () => {
  ensureNoAbsoluteInArena();
});

// YES click
yesBtn.addEventListener("click", () => {
  title.textContent = "Yippeeee!";
  catImg.src = "cat_dance.gif";

  letterWindow.classList.add("final");
  buttons.style.display = "none";
  noBtn.style.display = "none";
  finalText.style.display = "block";
});
