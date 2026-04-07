// Seleccionamos elementos una sola vez
const palette = document.getElementById('palette');
const genBtn = document.getElementById('genBtn');
const saveBtn = document.getElementById('saveBtn');
const savedList = document.getElementById('savedList');

// 1. Lógica de Colores
const getHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

function getHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255, 
        g = parseInt(hex.slice(3, 5), 16) / 255, 
        b = parseInt(hex.slice(5, 7), 16) / 255;
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

// 2. Utilidades
async function copiarAlPortapapeles(texto, elemento) {
    try {
        await navigator.clipboard.writeText(texto);
        const original = elemento.textContent;
        elemento.textContent = '¡Copiado! ✅';
        elemento.style.color = '#27ae60';
        setTimeout(() => {
            elemento.textContent = original;
            elemento.style.color = '';
        }, 1000);
    } catch (err) { console.error("Error al copiar:", err); }
}

// 3. Componentes
function actualizarTarjeta(card, color) {
    const hsl = getHSL(color);
    card.innerHTML = `
        <span class="color-box" style="background:${color}"></span>
        <span class="hex-code" title="Copiar HEX">${color}</span>
        <span class="hsl-code" title="Copiar HSL">${hsl}</span>
        <button class="lock-btn">🔓</button>
    `;

    // Eventos internos de la tarjeta
    card.querySelector('.hex-code').onclick = function() { copiarAlPortapapeles(this.textContent, this); };
    card.querySelector('.hsl-code').onclick = function() { copiarAlPortapapeles(this.textContent, this); };
    
    const lockBtn = card.querySelector('.lock-btn');
    lockBtn.onclick = () => {
        card.classList.toggle('is-locked');
        lockBtn.textContent = card.classList.contains('is-locked') ? '🔒' : '🔓';
    };
}

function dibujar() {
    const num = document.querySelector('input[name="size"]:checked').value;
    const cards = palette.querySelectorAll('.color-card');

    if (cards.length != num) {
        palette.innerHTML = '';
        for (let i = 0; i < num; i++) {
            const card = document.createElement('article');
            card.className = 'color-card';
            actualizarTarjeta(card, getHex());
            palette.appendChild(card);
        }
    } else {
        cards.forEach(card => {
            if (!card.classList.contains('is-locked')) actualizarTarjeta(card, getHex());
        });
    }
}

// 4. Persistencia (LocalStorage)
saveBtn.onclick = () => {
    const colores = Array.from(palette.querySelectorAll('.hex-code'))
                         .filter(el => el.textContent !== '¡Copiado! ✅')
                         .map(el => el.textContent);
    
    if (colores.length === 0) return;

    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    guardados.push(colores);
    localStorage.setItem('misPaletas', JSON.stringify(guardados));
    mostrarGuardados();
};

function mostrarGuardados() {
    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    savedList.innerHTML = '';
    
    guardados.forEach((paleta, i) => {
        const li = document.createElement('li');
        li.className = 'saved-item';
        let dots = paleta.map(c => `<span class="mini-dot" style="background:${c}"></span>`).join('');
        
        li.innerHTML = `
            <small>#${i+1}</small>
            <nav class="mini-palette">${dots}</nav>
            <button class="delete-btn" onclick="borrarPaleta(${i})">🗑️</button>
        `;
        savedList.appendChild(li);
    });
}

window.borrarPaleta = (i) => {
    const g = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    g.splice(i, 1);
    localStorage.setItem('misPaletas', JSON.stringify(g));
    mostrarGuardados();
};

// Inicialización
genBtn.onclick = dibujar;
window.onload = () => { dibujar(); mostrarGuardados(); };