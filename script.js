const palette = document.getElementById('palette');
const genBtn = document.getElementById('genBtn');
const saveBtn = document.getElementById('saveBtn');
const savedList = document.getElementById('savedList');

// 1. Generar color HEX aleatorio
function getHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// 2. Convertir HEX a HSL (para info extra)
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

// 3. Crear o actualizar el contenido de una tarjeta (con candado)
function actualizarTarjeta(card, color) {
    const hsl = getHSL(color);
    card.innerHTML = `
        <span class="color-box" style="background:${color}"></span>
        <span class="hex-code">${color.toUpperCase()}</span>
        <span class="hsl-code">${hsl}</span>
        <button class="lock-btn">🔓</button>
    `;

    const lockBtn = card.querySelector('.lock-btn');
    lockBtn.onclick = () => {
        card.classList.toggle('is-locked');
        lockBtn.textContent = card.classList.contains('is-locked') ? '🔒' : '🔓';
    };
}

// 4. Función principal: Dibujar la paleta
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

// 5. GUARDAR PALETA
saveBtn.onclick = () => {
    const colores = [];
    palette.querySelectorAll('.hex-code').forEach(el => colores.push(el.textContent));
    
    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    guardados.push(colores);
    localStorage.setItem('misPaletas', JSON.stringify(guardados));
    
    mostrarGuardados();
};

// 6. MOSTRAR GUARDADOS
function mostrarGuardados() {
    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    savedList.innerHTML = '';

    guardados.forEach((paleta, index) => {
        const li = document.createElement('li');
        li.className = 'saved-item';
        
        // Crear mini vista previa
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

// 7. BORRAR GUARDADO
window.borrarPaleta = (index) => {
    const guardados = JSON.parse(localStorage.getItem('misPaletas') || '[]');
    guardados.splice(index, 1);
    localStorage.setItem('misPaletas', JSON.stringify(guardados));
    mostrarGuardados();
};

// Eventos de inicio
genBtn.onclick = dibujar;
window.onload = () => {
    dibujar();
    mostrarGuardados();
};