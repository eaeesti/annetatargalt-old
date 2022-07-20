function flashRedById(id) {
  flashRed(document.getElementById(id));
}

function flashRed(element) {
  addRed(element);
  setTimeout(() => removeRed(element), 150);
  setTimeout(() => addRed(element), 300);
  setTimeout(() => removeRed(element), 450);
}

function addRed(element) {
  element.classList.add("bg-red-200", "ring-8", "ring-red-200", "rounded");
}

function removeRed(element) {
  element.classList.remove("bg-red-200", "ring-8", "ring-red-200", "rounded-xl");
}

const externalLinkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="external-link-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>`;

export { flashRedById, flashRed, externalLinkIcon };
