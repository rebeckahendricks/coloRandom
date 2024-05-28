// DOM Elements:
lockButtons = document.querySelectorAll(".lock-button");
newPaletteButton = document.getElementById("new-palette-button");
savePaletteButton = document.getElementById("save-palette-button");
const paletteNameInput = document.getElementById("palette-name");
searchPalettesInput = document.getElementById("search-palettes");

// Data Structures:
var currentColors = [
  { hex: "#EA9999", id: 0, isLocked: false },
  { hex: "#FACB9C", id: 1, isLocked: false },
  { hex: "#FFE59A", id: 2, isLocked: false },
  { hex: "#B6D7A8", id: 3, isLocked: false },
  { hex: "#A4C4CA", id: 4, isLocked: false },
];
var currentPaletteName = "";
var savedPalettes = [];

// Event Listeners:
document.addEventListener("DOMContentLoaded", function () {
  showLoading();
  setTimeout(() => {
    retrieveLocalStorage("savedPalettes");
    retrieveLocalStorage("currentColors");
    retrieveLocalStorage("currentPaletteName");
    populateMainPalette();
    renderSavedPalettes(savedPalettes);
    adjustTooltipsPosition();

    hideLoading();
  }, 500);
});

window.addEventListener("resize", adjustTooltipsPosition);

newPaletteButton.addEventListener("click", function () {
  newPalette();
  populateMainPalette();
});

lockButtons.forEach((lockButton) => {
  lockButton.addEventListener("click", function () {
    toggleLockColor(lockButton);
  });
});

savePaletteButton.addEventListener("click", function () {
  saveCurrentPalette();
  renderSavedPalettes(savedPalettes);
});

searchPalettesInput.addEventListener("input", function (event) {
  const searchTerm = event.target.value.toLowerCase();
  searchPalettesByName(searchTerm);
});

// Helper Functions:
function populateMainPalette() {
  currentColors.forEach((currentColor) => {
    updateColorBox(currentColor);
    updateColorText(currentColor);
    updateLockIcons(currentColor);
  });

  paletteNameInput.value = currentPaletteName;
}

function updateColorBox(currentColor) {
  document.getElementById(
    `main-color-${currentColor.id}`
  ).style.backgroundColor = currentColor.hex;
}

function updateColorText(currentColor) {
  document.getElementById(`text-${currentColor.id}`).innerText =
    currentColor.hex;
}

function updateLockIcons(currentColor) {
  const lockButton = document.getElementById(`lock-${currentColor.id}`);
  const lockIcons = [...lockButton.children];

  lockIcons.forEach((icon) => {
    icon.hidden = icon.classList.contains("locked-icon")
      ? !currentColor.isLocked
      : currentColor.isLocked;
  });
}

function newPalette() {
  let allColorsLocked = true;

  currentColors.forEach((currentColor) => {
    if (!currentColor.isLocked) {
      currentColor.hex = generateRandomHex();
      allColorsLocked = false;
    }
  });

  if (allColorsLocked) {
    showToast("All colors are locked!");
    return;
  }

  saveInLocalStorage("currentColors", currentColors);
  currentPaletteName = "";
  saveInLocalStorage("currentPaletteName", currentPaletteName);
}

function generateRandomHex() {
  return `#${Array.from({ length: 6 })
    .map(() => "ABCDEF0123456789"[Math.floor(Math.random() * 16)])
    .join("")}`;
}

function toggleLockColor(lockButton) {
  const colorID = extractColorID(lockButton);

  currentColors.forEach((currentColor) => {
    if (currentColor.id === colorID) {
      currentColor.isLocked = !currentColor.isLocked;
    }
  });
  saveInLocalStorage("currentColors", currentColors);

  lockIcons = [...lockButton.children];
  lockIcons.forEach((lockIcon) => {
    lockIcon.hidden = !lockIcon.hidden;
  });
}

function saveCurrentPalette() {
  const palette = createPaletteObject();
  currentPaletteName = paletteNameInput.value;
  saveInLocalStorage("currentPaletteName", currentPaletteName);

  const existingPalette = findMatchingPalette(palette);
  if (existingPalette) {
    if (existingPalette.name === palette.name) {
      showToast("This palette has already been saved!");
    } else {
      updatePaletteName(existingPalette, palette.name);
    }
  } else {
    savedPalettes.push(palette);
    saveInLocalStorage("savedPalettes", savedPalettes);
  }
}

function createPaletteObject() {
  return {
    id: savedPalettes.length,
    name: paletteNameInput.value.trim(),
    hexColors: currentColors.map((currentColor) => currentColor.hex),
  };
}

function updatePaletteName(palette, newName) {
  palette.name = newName;
  showToast("Palette name has been updated!");
  saveInLocalStorage("savedPalettes", savedPalettes);
  saveInLocalStorage("currentPaletteName", currentPaletteName);
}

function findMatchingPalette(palette) {
  return savedPalettes.find(
    (savedPalette) =>
      JSON.stringify(savedPalette.hexColors) ===
      JSON.stringify(palette.hexColors)
  );
}

function renderSavedPalettes(palettes) {
  const container = document.querySelector(".saved-palettes");
  container.innerHTML = "";

  if (palettes.length === 0) {
    container.innerHTML = `<p id="no-found-palettes">No palettes found.</p>`;
    return;
  }

  palettes.forEach((palette) => {
    const paletteContainer = createPaletteContainerHTML(palette);
    container.appendChild(paletteContainer);
  });
}

function createPaletteContainerHTML(palette) {
  const paletteContainer = document.createElement("div");
  paletteContainer.className = "palette-container";

  if (palette.name !== "") {
    paletteContainer.classList.add("has-name");
    const paletteInfoTooltip = createPaletteTooltip(palette);
    paletteContainer.appendChild(paletteInfoTooltip);
  }

  const savedPalette = createSavedPaletteHTML(palette);
  paletteContainer.appendChild(savedPalette);

  const deleteButton = createDeleteButton(palette.id);
  paletteContainer.appendChild(deleteButton);

  return paletteContainer;
}

function createSavedPaletteHTML(palette) {
  const savedPalette = document.createElement("div");
  savedPalette.className = "saved-palette";
  savedPalette.id = `saved-palette-${palette.id}`;

  palette.hexColors.forEach((hexColor, index) => {
    const colorBox = createColorBoxHTML(hexColor, index);
    savedPalette.appendChild(colorBox);
  });

  savedPalette.addEventListener("click", function () {
    const paletteID = extractColorID(savedPalette);
    renderPaletteInMainView(paletteID);
  });

  return savedPalette;
}

function createColorBoxHTML(hexColor, index) {
  const colorBox = document.createElement("div");
  colorBox.className = "saved-color";
  colorBox.id = `saved-color-${index}`;
  colorBox.style.backgroundColor = hexColor;

  return colorBox;
}

function createDeleteButton(savedPaletteId) {
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.innerHTML = "&times;";
  deleteButton.onclick = () => deletePalette(savedPaletteId);

  return deleteButton;
}

function deletePalette(id) {
  showConfirmationToast(
    "Are you sure you want to delete this palette?",
    () => {
      savedPalettes = savedPalettes.filter((palette) => palette.id !== id);
      saveInLocalStorage("savedPalettes", savedPalettes);
      renderSavedPalettes(savedPalettes);
    },
    () => {}
  );
}

function createPaletteTooltip(savedPalette) {
  const paletteInfoTooltip = document.createElement("div");
  paletteInfoTooltip.id = `tooltip-${savedPalette.id}`;
  paletteInfoTooltip.className = "palette-container palette-info-tooltip";
  const paletteName = document.createElement("div");
  paletteName.textContent = `${savedPalette.name}`;

  paletteInfoTooltip.addEventListener("click", function () {
    renderPaletteInMainView(savedPalette.id);
  });

  paletteInfoTooltip.appendChild(paletteName);

  const deleteButton = createDeleteButton(savedPalette.id);
  paletteInfoTooltip.appendChild(deleteButton);

  return paletteInfoTooltip;
}

function renderPaletteInMainView(paletteId) {
  var palette = findSavedPaletteByID(paletteId);

  currentPaletteName = palette.name;
  saveInLocalStorage("currentPaletteName", currentPaletteName);

  palette.hexColors.forEach((hexColor, index) => {
    var newCurrentColor = currentColors.find((currentColor) => {
      return index === currentColor.id;
    });
    newCurrentColor.hex = hexColor;
    newCurrentColor.isLocked = false;
  });

  saveInLocalStorage("currentColors", currentColors);
  populateMainPalette();
}

function findSavedPaletteByID(HTMLementID) {
  return savedPalettes.find((savedPalette) => savedPalette.id === HTMLementID);
}

function extractColorID(element) {
  const match = element.id.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

function searchPalettesByName(searchTerm) {
  const filteredPalettes = savedPalettes.filter((palette) =>
    palette.name.toLowerCase().includes(searchTerm)
  );
  renderSavedPalettes(filteredPalettes);
}

function showConfirmationToast(message, onConfirm, onCancel) {
  const toast = document.createElement("div");
  toast.innerHTML = `
      <div>${message}</div>
      <div style="margin-top: 10px;">
        <button id="confirmBtn" style="margin-right: 5px;">Confirm</button>
        <button id="cancelBtn">Cancel</button>
      </div>
    `;

  const toastInstance = Toastify({
    node: toast,
    duration: -1,
    close: false,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    backgroundColor: "#333",
  }).showToast();

  document.getElementById("confirmBtn").onclick = () => {
    toastInstance.hideToast();
    onConfirm();
  };

  document.getElementById("cancelBtn").onclick = () => {
    toastInstance.hideToast();
    onCancel();
  };
}

function saveInLocalStorage(itemName, data) {
  localStorage.setItem(itemName, JSON.stringify(data));
}

function retrieveLocalStorage(itemName) {
  const data = localStorage.getItem(itemName);
  if (data) {
    switch (itemName) {
      case "currentColors":
        currentColors = JSON.parse(data);
        break;
      case "savedPalettes":
        savedPalettes = JSON.parse(data);
        break;
      case "currentPaletteName":
        currentPaletteName = JSON.parse(data);
        break;
    }
  }
}

function showLoading() {
  document.getElementById("loadingIcon").classList.remove("hidden");
  document.getElementById("content").classList.add("hidden");
}

function hideLoading() {
  document.getElementById("loadingIcon").classList.add("hidden");
  document.getElementById("content").classList.remove("hidden");
}

function showToast(message) {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#333",
    stopOnFocus: true,
  }).showToast();
}

function adjustTooltipsPosition() {
  document.querySelectorAll(".palette-info-tooltip").forEach((tooltip) => {
    const paletteContainer = tooltip.closest(".palette-container");
    if (paletteContainer) {
      const tooltipRect = tooltip.getBoundingClientRect();

      // Check if tooltip is going out of the viewport
      if (tooltipRect.left < 0) {
        tooltip.style.left = "0";
        tooltip.style.transform = "translateX(0)";
      } else if (tooltipRect.right > window.innerWidth) {
        tooltip.style.left = "auto";
        tooltip.style.right = "0";
        tooltip.style.transform = "translateX(0)";
      } else {
        tooltip.style.left = "50%";
        tooltip.style.right = "auto";
        tooltip.style.transform = "translateX(-50%)";
      }
    }
  });
}
