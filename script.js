const palette = document.getElementById('palette');
const genBtn = document.getElementById('genBtn');
const saveBtn = document.getElementById('saveBtn');
const savedList = document.getElementById('savedList');

// 1. Generar color HEX aleatorio
function getHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// 2. Convertir HEX a HSL
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

// 3. Función para copiar texto al portapapeles con feedback
async function copiarAlPortapapeles(texto, elemento) {
    try {
        await navigator.clipboard.writeText(texto);
        const textoOriginal = elemento.textContent;
        elemento.textContent = '¡Copiado! ✅';
        elemento.style.color = '#27ae60';
        
        setTimeout(() => {
            elemento.textContent = textoOriginal;
            elemento.style.color = '';
        }, 1000);
    } catch (err) {
        console.error('Error al copiar: ', err);
    }
}

// 4. Actualizar tarjeta (Candado + Copiado)
function actualizarTarjeta(card, color) {
    const hsl = getHSL(color);
    card.innerHTML = `
        <span class="color-box" style="background:${color}"></span>
        <span class="hex-code" title="Click para copiar">${color.toUpperCase()}</span>
        <span class="hsl-code" title="Click para copiar">${hsl}</span>
        <button class="lock-btn">🔓</button>
    `;

    const hexEl = card.querySelector('.hex-code');
    const hslEl = card.querySelector('.hsl-code');
    hexEl.onclick = () => copiarAlPortapapeles(hexEl.textContent, hexEl);
    hslEl.onclick = () => copiarAlPortapapeles(hslEl.textContent, hslEl);

    const lockBtn = card.querySelector('.lock-btn');
    lockBtn.onclick = () => {
        card.classList.toggle('is-locked');
        lockBtn.textContent = card.classList.contains('is-locked') ? '🔒' : '🔓';
    };
}

// 5. Dibujar paleta
function dibujar() {
    const num = document.querySelector('input[name="size"]:checked').value;
    const tarjetasExistentes = palette.querySelectorAll('.color-card');

    if (tarjetasExistentes.length != num) {
        palette.innerHTML = '';
        for (let i = 0; i < num; i++) {
            const card = document.createElement('article');
            card.className = 'color-card';
            actualizarTarjeta(card, getHex());
            palette.appendChild(card);
        }
    } else {
        tarjetasExistentes.forEach(card => {
            if (!card.classList.contains('is-locked')) {
                actualizarTarjeta(card, getHex());
            }
        });
    }
}

// 6. Guardar paleta
saveBtn.onclick = () => {
    const colores = [];
    palette.querySelectorAll('.hex-code').forEach(el => {
        if (el.textContent !== '¡Copiado! ✅') colores.push(el.textContent);
    });
    
    if (colores.length === 0) return;

    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    guardados.push(colores);
    localStorage.setItem('misPaletas', JSON.stringify(guardados));
    mostrarGuardados();
};

// 7. Mostrar guardados
function mostrarGuardados() {
    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    savedList.innerHTML = '';

    guardados.forEach((paleta, index) => {
        const li = document.createElement('li');
        li.className = 'saved-item';
        let miniColores = '';
        paleta.forEach(c => miniColores += `<span class="mini-dot" style="background:${c}"></span>`);
        
        li.innerHTML = `
            <small>Paleta #${index + 1}</small>
            <nav class="mini-palette">${miniColores}</nav>
            <button class="delete-btn" onclick="borrarPaleta(${index})">🗑️</button>
        `;
        savedList.appendChild(li);
    });
}

window.borrarPaleta = (index) => {
    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    guardados.splice(index, 1);
    localStorage.setItem('misPaletas', JSON.stringify(guardados));
    mostrarGuardados();
};

genBtn.onclick = dibujar;
window.onload = () => {
    dibujar();
    mostrarGuardados();
};