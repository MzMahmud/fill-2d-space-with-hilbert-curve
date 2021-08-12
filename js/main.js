const size = 512;
const pauseOnGenEndInput = document.getElementById('pause-on-gen-end');
let img, input, canvas;
let isPaused, iterationPerFrame;
let gen, N, hilbertIndex, scale, prevPoint, nPoints;

function init(gen) {
    isPaused = false;
    iterationPerFrame = 1;
    N = 1 << gen; // 2^gen
    nPoints = N * N;
    scale = Math.floor(size / N);
    hilbertIndex = 0;
    prevPoint = null;
    document.getElementById('curr-gen').innerText = `Current Generation ${gen}`;
    playPause();
}

function setup() {
    gen = getGenvalueFromInput();
    init(gen);
    canvas = createCanvas(size, size);
    background(20);
    input = createFileInput(loadImageToDraw);
    input.parent('image-upload');
}

function draw() {
    translate(scale >> 1, scale >> 1);
    for (let i = 0; i < iterationPerFrame; i++) {
        if (hilbertIndex === nPoints) {
            gen = gen % 9 + 1;
            init(gen);
            background(20);
        }
        drawHilbert();
        hilbertIndex++;
        if (hilbertIndex === nPoints) {
            if (pauseOnGenEndInput.checked) {
                isPaused = true;
                playPause();
                break;
            }
        }
    }
}

function drawHilbert() {
    const currPoint = hilbertIndexToPoint(hilbertIndex, N);
    if (img) {
        colorMode(RGB);
        stroke(img.get(currPoint.x * scale, currPoint.y * scale));
    } else {
        colorMode(HSB);
        const hueValue = map(hilbertIndex, 0, nPoints, 0, 360);
        stroke(hueValue, 255, 128);
    }
    if (prevPoint) {
        strokeWeight(5);
        point(currPoint.x * scale, currPoint.y * scale);
        strokeWeight(3);
        line(
            prevPoint.x * scale, prevPoint.y * scale,
            currPoint.x * scale, currPoint.y * scale
        );
    }
    prevPoint = currPoint;
}

function startToDrawImage(loadedImage) {
    img = loadedImage;
    img.resize(size, size);
    img.loadPixels();
    resetAnimation();
}

function loadImageToDraw(file) {
    if (file.type === 'image') {
        loadImage(file.data, startToDrawImage, error => img = null);
    } else {
        img = null;
    }
}

const genInput = document.getElementById('gen');
function getGenvalueFromInput() {
    return (Number(genInput.value) - 1) % 9 + 1;
}

function resetAnimation() {
    gen = getGenvalueFromInput();
    genInput.value = String(gen);
    init(gen);
    background(20);
}
document.getElementById("reset").addEventListener("click", () => resetAnimation());

const pauseIcon = document.getElementById("pause");
const playIcon = document.getElementById("play");
function playPause() {
    if (isPaused) {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'inline';
        noLoop();
    } else {
        pauseIcon.style.display = 'inline';
        playIcon.style.display = 'none';
        loop();
    }
}

document.getElementById("pause-play").addEventListener("click", () => {
    isPaused = !isPaused;
    playPause();
});

document.getElementById("fast-forward").addEventListener("click", () => {
    iterationPerFrame += 10;
});

document.getElementById("download").addEventListener("click", () => {
    saveCanvas(canvas, `hilberted-image-gen-${gen}`, 'png');
});