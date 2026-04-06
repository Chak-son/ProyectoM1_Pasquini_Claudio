const paletteDiv = document.getElementById('palette');
const generateBtn = document.getElementById('generateBtn');
const paletteSizeSelect = document.getElementById('paletteSize');

function getRandomColorHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Sin saturación
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function generatePalette() {
    const size = parseInt(paletteSizeSelect.value);
    paletteDiv.innerHTML = ''; // Limpia la paleta antes de generar nuevos colores

    for (let i = 0; i < size; i++) {
        const colorHex = getRandomColorHex();
        const colorHSL = hexToHSL(colorHex);

        // Contenedor para círculo + códigos
        const colorContainer = document.createElement('span');
        colorContainer.className = 'color-container';

        // Círculo
        const box = document.createElement('span');
        box.className = 'color-box';
        box.style.backgroundColor = colorHex;

        // Código hex
        const colorCodeHex = document.createElement('span');
        colorCodeHex.className = 'color-code';
        colorCodeHex.textContent = colorHex;

        // Código HSL
        const colorCodeHSL = document.createElement('span');
        colorCodeHSL.className = 'color-code hsl';
        colorCodeHSL.textContent = colorHSL;

        // Armar estructura
        colorContainer.appendChild(box);
        colorContainer.appendChild(colorCodeHex);
        colorContainer.appendChild(colorCodeHSL);
        paletteDiv.appendChild(colorContainer);
    }
}

generateBtn.onclick = generatePalette;
