// Skim mode: swap the hero for a plain-text, 30-second summary
const skimToggle = document.querySelector(".skim-toggle");
const hero = document.getElementById("hero");

skimToggle.addEventListener("click", () => {
  // The intro animation has done its job; don't replay it when the hero comes back
  hero.classList.add("is-settled");
  const isSkim = document.body.classList.toggle("is-skim");
  skimToggle.setAttribute("aria-pressed", String(isSkim));
});
