// DOM Elements:
lockButtons = document.querySelectorAll(".lock-button");
newPaletteButton = document.getElementById("new-palette-button");
savePaletteButton = document.getElementById("save-palette-button");

// Data Structures:
const currentColors = [
  {
    hex: "#EA9999",
    id: 0,
    isLocked: false,
  },
  {
    hex: "#FACB9C",
    id: 1,
    isLocked: false,
  },
  {
    hex: "#FFE59A",
    id: 2,
    isLocked: false,
  },
  {
    hex: "#B6D7A8",
    id: 3,
    isLocked: false,
  },
  {
    hex: "#A4C4CA",
    id: 4,
    isLocked: false,
  },
];

var savedPalettes = [];

// Event Listeners:
document.addEventListener("DOMContentLoaded", function () {
  populateColorBoxes();
  renderSavedPalettes();
});

newPaletteButton.addEventListener("click", function () {
  newPalette();
  populateColorBoxes();
});

lockButtons.forEach((lockButton) => {
  lockButton.addEventListener("click", function () {
    lockColor(lockButton);
  });
});

savePaletteButton.addEventListener("click", function () {
  saveCurrentPalette();
  renderSavedPalettes();
});

// Helper Functions:
function populateColorBoxes() {
  currentColors.forEach((currentColor) => {
    const mainColorDiv = document.getElementById(
      `main-color-${currentColor.id}`
    );
    mainColorDiv.style.backgroundColor = currentColor.hex;

    const colorText = document.getElementById(`text-${currentColor.id}`);
    colorText.innerText = currentColor.hex;
  });
}

function newPalette() {
  currentColors.forEach((currentColor) => {
    if (!currentColor.isLocked) {
      currentColor.hex = randomHex();
    }
  });
}

function randomHex() {
  const hexCharacters = "ABCDEF0123456789";
  let hexCode = "#";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * hexCharacters.length);
    hexCode += hexCharacters[randomIndex];
  }
  return hexCode;
}

function lockColor(lockButton) {
  const colorID = extractColorID(lockButton);

  currentColors.forEach((currentColor) => {
    if (currentColor.id === colorID) {
      currentColor.isLocked = !currentColor.isLocked;
    }
  });

  lockIcons = [...lockButton.children];
  lockIcons.forEach((lockIcon) => {
    lockIcon.hidden = !lockIcon.hidden;
  });
}

function saveCurrentPalette() {
  const newID = savedPalettes.length;
  var paletteObj = { id: newID, hexColors: [] };

  currentColors.forEach((currentColor) => {
    paletteObj.hexColors.push(currentColor.hex);
  });

  // Save only if the palette does not already exist
  if (!savedPaletteExists(paletteObj)) {
    savedPalettes.push(paletteObj);
  } else {
    Toastify({
      text: "This palette has already been saved!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#333",
      stopOnFocus: true,
    }).showToast();
  }
}

function savedPaletteExists(paletteObject) {
  return savedPalettes.some((savedPalette) => {
    return (
      JSON.stringify(savedPalette.hexColors) ===
      JSON.stringify(paletteObject.hexColors)
    );
  });
}

function renderSavedPalettes() {
  const savedPalettesContainer = document.querySelector(".saved-palettes");

  if (savedPalettes.length > 0) {
    savedPalettesContainer.innerHTML = "";

    savedPalettes.forEach((palette) => {
      const paletteContainer = createPaletteContainerDOM(palette);
      savedPalettesContainer.appendChild(paletteContainer);
    });
  } else {
    savedPalettesContainer.innerHTML = `<p id="no-saved-palettes">No palettes saved yet!</p>`;
  }
}

function createPaletteContainerDOM(palette) {
  const paletteContainer = document.createElement("div");
  paletteContainer.className = "palette-container";

  const savedPalette = createSavedPaletteDOM(palette);
  paletteContainer.appendChild(savedPalette);

  const deleteButton = createDeleteButton(palette.id);
  paletteContainer.appendChild(deleteButton);

  return paletteContainer;
}

function createSavedPaletteDOM(palette) {
  const savedPalette = document.createElement("div");
  savedPalette.className = "saved-palette";
  savedPalette.id = `saved-palette-${palette.id}`;

  palette.hexColors.forEach((hexColor, index) => {
    const colorBox = createColorBoxDOM(hexColor, index);
    savedPalette.appendChild(colorBox);
  });

  savedPalette.addEventListener("click", function () {
    const paletteID = extractColorID(savedPalette);
    renderPaletteInMainView(paletteID);
  });

  return savedPalette;
}

function createColorBoxDOM(hexColor, index) {
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
      renderSavedPalettes();
    },
    () => {
      return;
    }
  );
}

function renderPaletteInMainView(savedPaletteId) {
  var paletteObject = findSavedPaletteByID(savedPaletteId);

  const colorsArray = paletteObject.hexColors;
  colorsArray.forEach((hexColor, index) => {
    var newCurrentColor = currentColors.find((currentColor) => {
      return index === currentColor.id;
    });
    newCurrentColor.hex = hexColor;
  });
  populateColorBoxes();
}

function findSavedPaletteByID(HTMLementID) {
  var savedPalette = savedPalettes.find((savedPalette) => {
    return savedPalette.id === HTMLementID;
  });
  return savedPalette;
}

function extractColorID(HTMLelement) {
  const elementID = HTMLelement.id;
  const match = elementID.match(/-(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  } else {
    throw new Error("Invalid format");
  }
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
