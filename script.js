// Skim mode: swap the hero for a plain-text, 30-second summary
const skimToggle = document.querySelector(".skim-toggle");
const hero = document.getElementById("hero");

skimToggle.addEventListener("click", () => {
  // The intro animation has done its job; don't replay it when the hero comes back
  hero.classList.add("is-settled");
  const isSkim = document.body.classList.toggle("is-skim");
  skimToggle.setAttribute("aria-pressed", String(isSkim));
});

// Workstation: clickable things on the desk illustration in the Work section
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const scrollBehavior = () => (reduceMotion.matches ? "auto" : "smooth");

// Touch has no hover, so tap-and-hold peeks at a hotspot's label instead of activating it
document.querySelectorAll(".hotspot:not(.hotspot--egg)").forEach((spot) => {
  let timer;
  let held = false;
  const cancel = () => clearTimeout(timer);

  spot.addEventListener("touchstart", () => {
    held = false;
    timer = setTimeout(() => {
      held = true;
      spot.classList.add("is-peek");
    }, 450);
  }, { passive: true });
  spot.addEventListener("touchmove", cancel, { passive: true });
  spot.addEventListener("touchcancel", cancel);
  spot.addEventListener("touchend", (event) => {
    cancel();
    if (!held) return;
    event.preventDefault(); // swallow the click: a hold is a peek, not a tap
    setTimeout(() => spot.classList.remove("is-peek"), 1200);
  });
  spot.addEventListener("contextmenu", (event) => event.preventDefault());
});

// Phone → PharmaSnap case study
const phoneSpot = document.querySelector(".hotspot--phone");
phoneSpot.addEventListener("click", (event) => {
  const target = document.querySelector(phoneSpot.hash);
  if (!target) return; // TODO: #pharmasnap doesn't exist yet
  event.preventDefault();
  target.scrollIntoView({ behavior: scrollBehavior() });
  history.pushState(null, "", phoneSpot.hash);
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});

// Notebook → sketch lightbox with a swipeable carousel
const notebookSpot = document.querySelector(".hotspot--notebook");
const sketchDialog = document.getElementById("sketch-dialog");
const sketchTrack = sketchDialog.querySelector(".sketch-track");
const sketchCount = sketchDialog.querySelector(".sketch-count");
const sketchTotal = sketchTrack.children.length;
let sketchIndex = 0;

const showSketch = (index) => {
  sketchIndex = (index + sketchTotal) % sketchTotal;
  sketchTrack.scrollTo({ left: sketchIndex * sketchTrack.clientWidth, behavior: scrollBehavior() });
};

notebookSpot.addEventListener("click", () => sketchDialog.showModal());
sketchDialog.addEventListener("close", () => notebookSpot.focus());
sketchDialog.querySelector(".sketch-close").addEventListener("click", () => sketchDialog.close());
// Clicking the backdrop (the dialog itself, outside the sheet) also closes it
sketchDialog.addEventListener("click", (event) => {
  if (event.target === sketchDialog) sketchDialog.close();
});
sketchDialog.querySelectorAll(".sketch-arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => showSketch(sketchIndex + Number(arrow.dataset.step)));
});
sketchDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showSketch(sketchIndex - 1);
  if (event.key === "ArrowRight") showSketch(sketchIndex + 1);
});
// Swiping scrolls the track natively; keep the index and counter in sync with it
sketchTrack.addEventListener("scroll", () => {
  const index = Math.round(sketchTrack.scrollLeft / sketchTrack.clientWidth);
  const label = `${index + 1} / ${sketchTotal}`;
  sketchIndex = index;
  if (sketchCount.textContent !== label) sketchCount.textContent = label;
}, { passive: true });

// Matcha → paper tooltip card
const matchaSpot = document.querySelector(".hotspot--matcha");
const matchaCard = document.getElementById("matcha-card");
const setMatcha = (open) => {
  matchaSpot.setAttribute("aria-expanded", String(open));
  matchaCard.hidden = !open;
};

matchaSpot.addEventListener("click", () => setMatcha(matchaCard.hidden));
document.addEventListener("click", (event) => {
  if (!matchaCard.hidden && !matchaSpot.contains(event.target) && !matchaCard.contains(event.target)) {
    setMatcha(false);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !matchaCard.hidden) {
    setMatcha(false);
    matchaSpot.focus();
  }
});

// Easter egg: the laptop screen goes back to the top
document.querySelector(".hotspot--egg").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: scrollBehavior() });
  document.querySelector(".brand").focus({ preventScroll: true });
});
