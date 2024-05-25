// DOM Elements:
lockButtons = document.querySelectorAll(".lock-button");
newPaletteButton = document.getElementById("new-palette-button");
savePaletteButton = document.getElementById("save-palette-button");
const noSavedPalettesText = document.getElementById("no-saved-palettes");

// Data Structures:
const currentColors = [
  {
    hex: "#EA9999",
    id: 0,
    colorId: "color-0",
    textId: "text-0",
    isLocked: false,
  },
  {
    hex: "#FACB9C",
    id: 1,
    colorId: "color-1",
    textId: "text-1",
    isLocked: false,
  },
  {
    hex: "#FFE59A",
    id: 2,
    colorId: "color-2",
    textId: "text-2",
    isLocked: false,
  },
  {
    hex: "#B6D7A8",
    id: 3,
    colorId: "color-3",
    textId: "text-3",
    isLocked: false,
  },
  {
    hex: "#A4C4CA",
    id: 4,
    colorId: "color-4",
    textId: "text-4",
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
  currentColors.forEach((color) => {
    const colorBox = document.getElementById(color.colorId);
    const textBox = document.getElementById(color.textId);
    colorBox.style.backgroundColor = color.hex;
    textBox.innerText = color.hex;
  });
}

function newPalette() {
  currentColors.forEach((color) => {
    if (!color.isLocked) {
      color.hex = randomHex();
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
  const buttonId = lockButton.id.substring(lockButton.id.indexOf("-"));
  currentColors.forEach((color) => {
    if (color.id.toString() === buttonId) {
      color.isLocked = !color.isLocked;
    }
  });

  icons = [...lockButton.children];
  icons.forEach((icon) => {
    icon.hidden = !icon.hidden;
  });
}

function saveCurrentPalette() {
  const newID = savedPalettes.length;
  var savedPalette = { id: newID, hexColors: [] };

  currentColors.forEach((color) => {
    savedPalette.hexColors.push(color.hex);
  });

  savedPalettes.push(savedPalette);
}

function renderSavedPalettes() {
  const savedPalettesContainer = document.querySelector(
    ".saved-color-palettes"
  );
  savedPalettesContainer.innerHTML = `<p id="no-saved-palettes">No palettes saved yet!</p>`;

  if (savedPalettes.length > 0) {
    savedPalettesContainer.innerHTML = "";
    noSavedPalettesText.hidden = true;

    savedPalettes.forEach((palette) => {
      const paletteContainer = document.createElement("div");
      paletteContainer.className = "palette-container";

      const savedPalette = document.createElement("div");
      savedPalette.className = "saved-palette";
      savedPalette.id = `saved-palette-${palette.id}`;

      palette.hexColors.forEach((hexColor, index) => {
        const colorBox = document.createElement("div");
        colorBox.className = "saved-color";
        colorBox.id = `saved-color-${index}`;
        colorBox.style.backgroundColor = hexColor;
        savedPalette.appendChild(colorBox);
      });

      savedPalette.addEventListener("click", function () {
        const savedPaletteID = savedPalette.id;
        const paletteID = extractSavedPaletteIDFromElementID(savedPaletteID);
        renderPaletteInMainView(paletteID);
      });

      paletteContainer.appendChild(savedPalette);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = "&times;";
      deleteButton.onclick = () => deletePalette(palette.id);

      paletteContainer.appendChild(deleteButton);
      savedPalettesContainer.appendChild(paletteContainer);
    });
  } else {
    noSavedPalettesText.hidden = false;
  }
}

function deletePalette(id) {
  savedPalettes = savedPalettes.filter((palette) => palette.id !== id);
  renderSavedPalettes();
}

function renderPaletteInMainView(paletteID) {
  var paletteObject = findSavedPaletteByID(paletteID);

  const colorsArray = paletteObject.hexColors;
  colorsArray.forEach((hexColor, index) => {
    var color = currentColors.find((currentColor) => {
      return index === currentColor.id;
    });
    color.hex = hexColor;
  });
  populateColorBoxes();
}

function findSavedPaletteByID(HTMLementID) {
  var palette = savedPalettes.find((palette) => {
    return palette.id === HTMLementID;
  });
  return palette;
}

function extractSavedPaletteIDFromElementID(elementID) {
  const match = elementID.match(/-(\d+)$/);
  if (match) {
    return parseInt(match[1], 10);
  } else {
    throw new Error("Invalid format");
  }
}
