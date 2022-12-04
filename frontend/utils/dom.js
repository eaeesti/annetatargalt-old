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
  element.classList.remove(
    "bg-red-200",
    "ring-8",
    "ring-red-200",
    "rounded-xl"
  );
}

const externalLinkIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="external-link-icon">
  <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
  <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
</svg>`;

export { flashRedById, flashRed, externalLinkIcon };
