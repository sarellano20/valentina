// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Click Envelope
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    document.querySelector(".letter-window").classList.add("open");
  }, 50);
});

// Helpers
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Move NO but NEVER leave the buttons box (perfect for mobile)
function moveNoSafely() {
  const container = buttons; // the safe box
  const pad = 8; // padding inside the box so it never touches the edge

  const containerRect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // How much we can move without leaving container
  const minDx = (containerRect.left + pad) - btnRect.left;
  const maxDx = (containerRect.right - pad) - btnRect.right;

  const minDy = (containerRect.top + pad) - btnRect.top;
  const maxDy = (containerRect.bottom - pad) - btnRect.bottom;

  // Original “random jump” feel (like your code), but clamped
  const distance = 200; // keep your vibe
  const angle = Math.random() * Math.PI * 2;

  let dx = Math.cos(angle) * distance;
  let dy = Math.sin(angle) * distance;

  dx = clamp(dx, minDx, maxDx);
  dy = clamp(dy, minDy, maxDy);

  noBtn.style.transition = "transform 0.22s ease";
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
}

/**
 * Desktop: hover -> moves
 * Mobile: touch/press -> moves
 */
noBtn.addEventListener("pointerenter", (e) => {
  // pointerenter for mouse/pen; in touch it might not fire consistently
  if (e.pointerType !== "touch") moveNoSafely();
});

noBtn.addEventListener("pointerdown", (e) => {
  // When you try to tap NO in mobile, it escapes but stays inside frame
  if (e.pointerType === "touch") moveNoSafely();
});

// YES is clicked
yesBtn.addEventListener("click", () => {
  title.textContent = "Yippeeee!";
  catImg.src = "cat_dance.gif";
  document.querySelector(".letter-window").classList.add("final");
  buttons.style.display = "none";
  finalText.style.display = "block";
});
