// DOM Elements:
newPaletteButton = document.getElementById("new-palette-button");

// Data Structures:
const colors = [
  { hex: "#EA9999", colorId: "color-1", textId: "text-1" },
  { hex: "#FACB9C", colorId: "color-2", textId: "text-2" },
  { hex: "#FFE59A", colorId: "color-3", textId: "text-3" },
  { hex: "#B6D7A8", colorId: "color-4", textId: "text-4" },
  { hex: "#A4C4CA", colorId: "color-5", textId: "text-5" },
];

// Event Listeners:
document.addEventListener("DOMContentLoaded", function () {
  populateColorBoxes();
});

newPaletteButton.addEventListener("click", function () {
  newPalette();
  populateColorBoxes();
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
    color.hex = randomHex();
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
