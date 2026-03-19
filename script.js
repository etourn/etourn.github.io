const name = "Hi! I'm ET";
const element = document.getElementById("hero-name");
let i = 0;

function typeLetter() {
  if (i < name.length) {
    element.textContent += name[i];
    i++;
    setTimeout(typeLetter, 200);
  }
}

typeLetter();