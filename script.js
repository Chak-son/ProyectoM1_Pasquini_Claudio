const paletteContainer = document.getElementById('palette');
const generateBtn = document.getElementById('generateBtn');

// Función para crear un color aleatorio
function getRandomColorHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Función para convertir Hex a HSL (para mostrar el segundo código)
function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
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

// Función para saber cuántos colores generar
function getSelectedPaletteSize() {
    const radios = document.querySelectorAll('input[name="paletteSize"]');
    for (const radio of radios) {
        if (radio.checked) return parseInt(radio.value);
    }
    return 6;
}

// Función principal que genera la paleta
function generatePalette() {
    const size = getSelectedPaletteSize();
    paletteContainer.innerHTML = ''; // Limpiamos la sección

    for (let i = 0; i < size; i++) {
        const colorHex = getRandomColorHex();
        const colorHSL = hexToHSL(colorHex);

        // Creamos un 'article' para cada color (sin usar div)
        const colorCard = document.createElement('article');
        colorCard.className = 'color-container';

        // El círculo de color
        const box = document.createElement('span');
        box.className = 'color-box';
        box.style.backgroundColor = colorHex;

        // El texto HEX
        const colorCodeHex = document.createElement('span');
        colorCodeHex.className = 'color-code';
        colorCodeHex.textContent = colorHex;

        // El texto HSL
        const colorCodeHSL = document.createElement('span');
        colorCodeHSL.className = 'color-code hsl';
        colorCodeHSL.textContent = colorHSL;

        // Agregamos todo al article y el article a la sección principal
        colorCard.appendChild(box);
        colorCard.appendChild(colorCodeHex);
        colorCard.appendChild(colorCodeHSL);
        paletteContainer.appendChild(colorCard);
    }
}

// Al hacer clic, se ejecuta la función
generateBtn.onclick = generatePalette;

// Generar una paleta al cargar la página por primera vez
generatePalette();