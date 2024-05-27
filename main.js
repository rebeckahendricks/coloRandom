// DOM Elements:
lockButtons = document.querySelectorAll(".lock-button");
newPaletteButton = document.getElementById("new-palette-button");
savePaletteButton = document.getElementById("save-palette-button");
const paletteNameInput = document.getElementById("palette-name");
searchPalettesInput = document.getElementById("search-palettes");

// Data Structures:
var currentColors = [
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

    hideLoading();
  }, 500);
});

newPaletteButton.addEventListener("click", function () {
  newPalette();
  populateMainPalette();
});

lockButtons.forEach((lockButton) => {
  lockButton.addEventListener("click", function () {
    lockColor(lockButton);
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
    handleColorBox(currentColor);
    handleColorText(currentColor);
    handleLockIcons(currentColor);
  });

  paletteNameInput.value = currentPaletteName;
}

function handleColorBox(currentColor) {
  const mainColorDiv = document.getElementById(`main-color-${currentColor.id}`);
  mainColorDiv.style.backgroundColor = currentColor.hex;
}

function handleColorText(currentColor) {
  const colorText = document.getElementById(`text-${currentColor.id}`);
  colorText.innerText = currentColor.hex;
}

function handleLockIcons(currentColor) {
  const colorLock = document.getElementById(`lock-${currentColor.id}`);
  const lockIcons = [...colorLock.children];

  lockIcons.forEach((lockIcon) => {
    lockIcon.hidden = lockIcon.classList.contains("locked-icon")
      ? !currentColor.isLocked
      : currentColor.isLocked;
  });
}

function newPalette() {
  let lockedColorsCount = 0;

  currentColors.forEach((currentColor) => {
    if (currentColor.isLocked) {
      lockedColorsCount++;
    } else {
      currentColor.hex = randomHex();
    }

    if (lockedColorsCount === 5) {
      Toastify({
        text: `All colors are locked!`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#333",
        stopOnFocus: true,
      }).showToast();
      return;
    }
  });

  saveInLocalStorage("currentColors", currentColors);

  currentPaletteName = "";
  saveInLocalStorage("currentPaletteName", currentPaletteName);
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
  saveInLocalStorage("currentColors", currentColors);

  lockIcons = [...lockButton.children];
  lockIcons.forEach((lockIcon) => {
    lockIcon.hidden = !lockIcon.hidden;
  });
}

function saveCurrentPalette() {
  const paletteObj = createNewSavedPaletteObject();

  const paletteNameInput = document.getElementById("palette-name");
  currentPaletteName = paletteNameInput.value;
  saveInLocalStorage("currentPaletteName", currentPaletteName);

  var existingPalette = savedPaletteExists(paletteObj);
  if (existingPalette) {
    if (existingPalette.name === paletteObj.name) {
      Toastify({
        text: `This palette has already been saved!`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#333",
        stopOnFocus: true,
      }).showToast();
    } else {
      updatePaletteName(existingPalette, paletteObj.name);
    }
  } else {
    savedPalettes.push(paletteObj);
    saveInLocalStorage("savedPalettes", savedPalettes);
  }
}

function createNewSavedPaletteObject() {
  const paletteNameInput = document.getElementById("palette-name");
  const paletteName = paletteNameInput.value.trim();
  const newID = savedPalettes.length;

  var paletteObj = { id: newID, name: paletteName, hexColors: [] };

  currentColors.forEach((currentColor) => {
    paletteObj.hexColors.push(currentColor.hex);
  });

  return paletteObj;
}

function updatePaletteName(existingPalette, newName) {
  existingPalette.name = newName;
  Toastify({
    text: `Palette name has been updated!`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#333",
    stopOnFocus: true,
  }).showToast();
  saveInLocalStorage("savedPalettes", savedPalettes);
  saveInLocalStorage("currentPaletteName", currentPaletteName);
}

function savedPaletteExists(paletteObject) {
  var matchingSavedPalette = savedPalettes.find((savedPalette) => {
    return (
      JSON.stringify(savedPalette.hexColors) ===
      JSON.stringify(paletteObject.hexColors)
    );
  });

  return matchingSavedPalette;
}

function renderFilteredPalettes(filteredPalettes) {
  const savedPalettesContainer = document.querySelector(".saved-palettes");
  savedPalettesContainer.innerHTML = "";

  if (filteredPalettes.length === 0) {
    savedPalettesContainer.innerHTML = `<p id="no-found-palettes">No palettes found.</p>`;
    return;
  }

  filteredPalettes.forEach((palette) => {
    const paletteContainer = createPaletteContainerDOM(palette);
    savedPalettesContainer.appendChild(paletteContainer);
  });
}

function createPaletteContainerDOM(palette) {
  const paletteContainer = document.createElement("div");
  paletteContainer.className = "palette-container";

  if (palette.name !== "") {
    paletteContainer.classList.add("has-name");
    const paletteInfoTooltip = createPaletteTooltip(palette);
    paletteContainer.appendChild(paletteInfoTooltip);
    paletteContainer.addEventListener('mouseover', () => adjustTooltipPosition(paletteInfoTooltip));
  }

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
      saveInLocalStorage("savedPalettes", savedPalettes);
      renderSavedPalettes(savedPalettes);
    },
    () => {
      return;
    }
  );
}

function createPaletteTooltip(savedPalette) {
  const paletteInfoTooltip = document.createElement("div");
  paletteInfoTooltip.className = "palette-container palette-info-tooltip";
  const paletteName = document.createElement("div");
  paletteName.textContent = `${savedPalette.name}`;
  paletteInfoTooltip.appendChild(paletteName);

  const deleteButton = createDeleteButton(savedPalette.id);
  paletteInfoTooltip.appendChild(deleteButton);

  return paletteInfoTooltip;
}

function adjustTooltipPosition(tooltip) {
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
  
    // Reset tooltip position
    tooltip.style.left = '50%';
    tooltip.style.right = 'auto';
    tooltip.style.transform = 'translateX(-50%)';
  
    // Check if the tooltip exceeds the viewport width
    if (tooltipRect.left < 0) {
      tooltip.style.left = '0';
      tooltip.style.transform = 'translateX(0)';
    } else if (tooltipRect.right > viewportWidth) {
      tooltip.style.left = 'auto';
      tooltip.style.right = '0';
      tooltip.style.transform = 'translateX(0)';
    }
  }

function renderPaletteInMainView(savedPaletteId) {
  var paletteObject = findSavedPaletteByID(savedPaletteId);
  currentPaletteName = paletteObject.name;
  saveInLocalStorage("currentPaletteName", currentPaletteName);

  const colorsArray = paletteObject.hexColors;
  colorsArray.forEach((hexColor, index) => {
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

function searchPalettesByName(searchTerm) {
  const filteredPalettes = savedPalettes.filter((savedPalette) =>
    savedPalette.name.toLowerCase().includes(searchTerm)
  );
  renderSavedPalettes(filteredPalettes);
}

function renderSavedPalettes(filteredPalettes) {
  const savedPalettesContainer = document.querySelector(".saved-palettes");
  savedPalettesContainer.innerHTML = "";

  if (filteredPalettes.length === 0) {
    savedPalettesContainer.innerHTML = `<p id="no-found-palettes">No palettes found.</p>`;
    return;
  }

  filteredPalettes.forEach((palette) => {
    const paletteContainer = createPaletteContainerDOM(palette);
    savedPalettesContainer.appendChild(paletteContainer);
  });
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
  const dataToJSON = JSON.stringify(data);
  window.localStorage.setItem(itemName, dataToJSON);
}

function retrieveLocalStorage(itemName) {
  try {
    const item = window.localStorage.getItem(itemName);
    if (!item) {
      console.warn(`No local storage item found with the name: ${itemName}`);
      return;
    }

    const parsedData = JSON.parse(item);

    if (parsedData) {
      switch (itemName) {
        case "currentColors":
          currentColors = parsedData;
          break;
        case "savedPalettes":
          savedPalettes = parsedData;
          break;
        case "currentPaletteName":
          currentPaletteName = parsedData;
          break;
        default:
          console.warn(`Unknown local storage item name: ${itemName}`);
          break;
      }
    }
  } catch (error) {
    console.error(`Error retrieving local storage item: ${itemName}`, error);
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
