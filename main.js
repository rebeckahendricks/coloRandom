// DOM Elements:
newPaletteButton = document.getElementById("new-palette-button");
lockButtons = document.querySelectorAll(".lock-button");

// Data Structures:
const colors = [
  {
    hex: "#EA9999",
    id: 1,
    colorId: "color-1",
    textId: "text-1",
    isLocked: false,
  },
  {
    hex: "#FACB9C",
    id: 2,
    colorId: "color-2",
    textId: "text-2",
    isLocked: false,
  },
  {
    hex: "#FFE59A",
    id: 3,
    colorId: "color-3",
    textId: "text-3",
    isLocked: false,
  },
  {
    hex: "#B6D7A8",
    id: 4,
    colorId: "color-4",
    textId: "text-4",
    isLocked: false,
  },
  {
    hex: "#A4C4CA",
    id: 5,
    colorId: "color-5",
    textId: "text-5",
    isLocked: false,
  },
];

// Event Listeners:
document.addEventListener("DOMContentLoaded", function () {
  populateColorBoxes();
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

// Helper Functions:
function populateColorBoxes() {
  colors.forEach((color) => {
    const colorBox = document.getElementById(color.colorId);
    const textBox = document.getElementById(color.textId);
    colorBox.style.backgroundColor = color.hex;
    textBox.innerText = color.hex;
  });
}

function newPalette() {
  colors.forEach((color) => {
    if (!color.isLocked) {
      color.hex = randomHex();
    }
  });
}

function randomHex() {
  const hexCharacters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  let hexCode = "#";

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * hexCharacters.length);
    hexCode += hexCharacters[randomIndex];
  }
  return hexCode;
}

function lockColor(lockButton) {
  const buttonId = lockButton.id.substring(lockButton.id.indexOf("-") + 1);
  colors.forEach((color) => {
    if (color.id.toString() === buttonId) {
      color.isLocked = !color.isLocked;
    }
  });

  icons = [...lockButton.children];
  icons.forEach((icon) => {
    icon.hidden = !icon.hidden;
  });
}
