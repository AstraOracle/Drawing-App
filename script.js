const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Tool buttons & inputs
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearBtn = document.getElementById('clear');
const eraserBtn = document.getElementById('eraser');
const saveBtn = document.getElementById('save');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const brushStyleEl = document.getElementById('brush-style');
const opacityEl = document.getElementById('opacity');
const bgcolorEl = document.getElementById('bg-color');

// Default settings
let size = 20;
let isPressed = false;
let color = 'black';
let x, y;
let drawingMode = 'draw';
let history = [];
let redoHistory = [];
let brushStyle = 'solid';
let opacity = 1;
let bgColor = '#ffffff';

// Set background color
canvas.style.backgroundColor = bgColor;
bgcolorEl.addEventListener('input', (e) => {
    bgColor = e.target.value;
    canvas.style.backgroundColor = bgColor;
});

// Save initial state
function saveState() {
    history.push(canvas.toDataURL());
    redoHistory = [];
}

function saveInitialState() {
    saveState();
}
saveInitialState();

// Restore state (undo/redo)
function restoreState(historyArray, saveToHistory) {
    if (historyArray.length === 0) return;
    if (saveToHistory) redoHistory.push(canvas.toDataURL());

    const img = new Image();
    img.src = historyArray.pop();
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

undoBtn.addEventListener('click', () => restoreState(history, true));
redoBtn.addEventListener('click', () => restoreState(redoHistory, false));

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    x = e.offsetX;
    y = e.offsetY;
});

canvas.addEventListener('mouseup', () => {
    isPressed = false;
    x = undefined;
    y = undefined;
    saveState();
});

canvas.addEventListener('mousemove', (e) => {
    if (!isPressed) return;

    const x2 = e.offsetX;
    const y2 = e.offsetY;

    if (drawingMode === 'erase') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(x2 - size / 2, y2 - size / 2, size, size);
    } else {
        drawLine(x, y, x2, y2);
    }

    x = x2;
    y = y2;
});

// Draw functions
function drawLine(x1, y1, x2, y2) {
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    if (brushStyle === 'dotted') {
        ctx.setLineDash([5, 15]);
    } else if (brushStyle === 'dashed') {
        ctx.setLineDash([10, 10]);
    } else {
        ctx.setLineDash([]);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawCircle(x, y) {
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1;
}

// Button actions
increaseBtn.addEventListener('click', () => {
    size = Math.min(size + 5, 50);
    updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
    size = Math.max(size - 5, 5);
    updateSizeOnScreen();
});

colorEl.addEventListener('change', (e) => {
    color = e.target.value;
});

eraserBtn.addEventListener('click', () => {
    drawingMode = drawingMode === 'draw' ? 'erase' : 'draw';
    eraserBtn.innerText = drawingMode === 'draw' ? 'Eraser' : 'Drawing';
});

clearBtn.addEventListener('click', () => {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'drawing.png';
    link.click();
});

// Settings updates
brushStyleEl.addEventListener('change', (e) => {
    brushStyle = e.target.value;
});

opacityEl.addEventListener('input', (e) => {
    opacity = e.target.value;
});

function updateSizeOnScreen() {
    sizeEl.innerText = size;
}
