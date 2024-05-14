// DOM Elements:
document.addEventListener("DOMContentLoaded", function () {
    populateColorBoxes();
});

function populateColorBoxes() {
    const colors = [
        { hex: '#EA9999', colorId: 'color-1', textId: 'text-1' },
        { hex: '#FACB9C', colorId: 'color-2', textId: 'text-2' },
        { hex: '#FFE59A', colorId: 'color-3', textId: 'text-3' },
        { hex: '#B6D7A8', colorId: 'color-4', textId: 'text-4' },
        { hex: '#A4C4CA', colorId: 'color-5', textId: 'text-5' }
    ];

    colors.forEach(color => {
        const colorBox = document.getElementById(color.colorId);
        const textBox = document.getElementById(color.textId);
        colorBox.style.backgroundColor = color.hex;
        textBox.innerText = color.hex;
    });
}