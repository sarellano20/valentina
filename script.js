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

// Click Envelope
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    letterWindow.classList.add("open");
  }, 50);
});

// ===== NO button: move but NEVER leave the window (mobile + desktop) =====
let noBaseRect = null;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function cacheNoBaseRect() {
  const prev = noBtn.style.transform;
  noBtn.style.transform = "translate(0px, 0px)";
  noBaseRect = noBtn.getBoundingClientRect();
  noBtn.style.transform = prev || "translate(0px, 0px)";
}

function moveNoInsideWindow() {
  if (!letterWindow) return;

  if (!noBaseRect) cacheNoBaseRect();

  const w = letterWindow.getBoundingClientRect();
  const btnW = noBaseRect.width;
  const btnH = noBaseRect.height;

  const margin = 12;

  // Mantén el NO en una "banda" inferior
  const bandHeight = Math.min(160, w.height * 0.35);
  const topMin = Math.max(w.top + margin, w.bottom - bandHeight);
  const topMax = Math.max(topMin, w.bottom - margin - btnH);

  const leftMin = w.left + margin;
  const leftMax = Math.max(leftMin, w.right - margin - btnW);

  const targetLeft = rand(leftMin, leftMax);
  const targetTop = rand(topMin, topMax);

  const moveX = targetLeft - noBaseRect.left;
  const moveY = targetTop - noBaseRect.top;

  noBtn.style.transition = "transform 0.25s ease";
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

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

window.addEventListener("resize", () => {
  noBaseRect = null;
});

// YES is clicked
yesBtn.addEventListener("click", () => {
  title.textContent = "Yippeeee!";
  catImg.src = "cat_dance.gif";

  letterWindow.classList.add("final");
  buttons.style.display = "none";
  finalText.style.display = "block";
});
