const palette = document.getElementById('palette');
const genBtn = document.getElementById('genBtn');

// Generar color HEX aleatorio
function getHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// Convertir HEX a HSL
function getHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
    if (max == min) h = s = 0;
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max == r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max == g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// Crear o actualizar el contenido de una tarjeta
function actualizarTarjeta(card, color) {
    const hsl = getHSL(color);
    card.innerHTML = `
        <span class="color-box" style="background:${color}"></span>
        <span class="hex-code">${color.toUpperCase()}</span>
        <span class="hsl-code">${hsl}</span>
        <button class="lock-btn">🔓</button>
    `;

    // Configurar el botón de bloqueo
    const lockBtn = card.querySelector('.lock-btn');
    lockBtn.onclick = () => {
        card.classList.toggle('is-locked');
        lockBtn.textContent = card.classList.contains('is-locked') ? '🔒' : '🔓';
    };
}

// Función principal de generación
function dibujar() {
    const num = document.querySelector('input[name="size"]:checked').value;
    const tarjetasExistentes = palette.querySelectorAll('.color-card');

    // Si el usuario cambió el tamaño (ej. de 6 a 8), borramos y recreamos
    if (tarjetasExistentes.length != num) {
        palette.innerHTML = '';
        for (let i = 0; i < num; i++) {
            const card = document.createElement('article');
            card.className = 'color-card';
            actualizarTarjeta(card, getHex());
            palette.appendChild(card);
        }
    } else {
        // Si el tamaño es el mismo, solo cambiamos los que no tienen candado
        tarjetasExistentes.forEach(card => {
            if (!card.classList.contains('is-locked')) {
                actualizarTarjeta(card, getHex());
            }
        });
    }
}

genBtn.onclick = dibujar;
window.onload = dibujar;