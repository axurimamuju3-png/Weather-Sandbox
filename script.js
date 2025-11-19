const sky = document.getElementById("sky");

// Warna langit untuk setiap waktu
const skyColors = {
    subuh: "#F0E68C",
    pagi: "#FFDAB9",
    siang: "#87CEEB",
    sore: "#FFA07A",
    magrib: "#FF4500",
    malam: "#191970"
};

const times = ["subuh", "pagi", "siang", "sore", "magrib", "malam"];
let index = 0;
const totalDuration = 100000;
let stepTime = totalDuration / times.length;

// ================= BINTANG ===================
const starCount = 100;
const stars = [];

function createStars() {
    const usedPositions = [];
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        let top, left;
        let tries = 0;
        do {
            top = Math.random() * window.innerHeight;
            left = Math.random() * window.innerWidth;
            tries++;
        } while (usedPositions.some(p => Math.abs(p.top - top) < 5 && Math.abs(p.left - left) < 5) && tries < 100);
        usedPositions.push({ top, left });

        star.style.top = top + "px";
        star.style.left = left + "px";
        star.dataset.dx = (Math.random() - 0.5) * 0.05;
        star.dataset.dy = (Math.random() - 0.5) * 0.05;

        sky.appendChild(star);
        stars.push(star);
    }
}

function updateStars(time) {
    stars.forEach(star => {
        let top = parseFloat(star.style.top);
        let left = parseFloat(star.style.left);
        top += parseFloat(star.dataset.dy);
        left += parseFloat(star.dataset.dx);

        if (top < 0) top = 0;
        if (top > window.innerHeight) top = window.innerHeight;
        if (left < 0) left = 0;
        if (left > window.innerWidth) left = window.innerWidth;

        star.style.top = top + "px";
        star.style.left = left + "px";

        if (time === "malam") {
            star.style.opacity = 0.4 + Math.random() * 0.6;
        } else if (time === "magrib") {
            star.style.opacity = 0.2 + Math.random() * 0.2;
        } else {
            star.style.opacity = 0;
        }
    });
}

// ================= TIME-LAPSE ===================
function changeTime() {
    const time = times[index];
    sky.style.transition = `background ${stepTime / 1000}s linear`;
    sky.style.background = skyColors[time];
    updateStars(time);

    index = (index + 1) % times.length;
}

createStars();
let timeInterval = setInterval(changeTime, stepTime);
changeTime();

// Animate bintang tiap frame
let animationPaused = false;
function animateStars() {
    if (!animationPaused) {
        const currentTime = times[index === 0 ? times.length - 1 : index - 1];
        updateStars(currentTime);
    }
    requestAnimationFrame(animateStars);
}
animateStars();

// ================= KONTROL ===================
let isPaused = false;
let speedMultiplier = 1;

document.getElementById("pauseBtn").addEventListener("click", () => {
    isPaused = !isPaused;
    animationPaused = isPaused;
    document.getElementById("pauseBtn").textContent = isPaused ? "Play" : "Pause";

    if (isPaused) {
        clearInterval(timeInterval);
    } else {
        timeInterval = setInterval(changeTime, stepTime / speedMultiplier);
    }
});

document.getElementById("speedBtn").addEventListener("click", () => {
    speedMultiplier = speedMultiplier === 1 ? 2 : 1;
    document.getElementById("speedBtn").textContent = speedMultiplier === 1 ? "Speed" : "Normal";

    if (!isPaused) {
        clearInterval(timeInterval);
        timeInterval = setInterval(changeTime, stepTime / speedMultiplier);
    }
});

// ================= AWAN CUMULONIMBUS DYNAMIC ===================
let spawnCloudMode = false;
const clouds = [];

document.getElementById("cloudBtn").addEventListener("click", () => {
    spawnCloudMode = !spawnCloudMode;
    document.getElementById("cloudBtn").textContent = spawnCloudMode ? "Click in the sky to spawn clouds" : "Awan";
});

sky.addEventListener("click", (e) => {
    if (!spawnCloudMode) return;

    const cloud = document.createElement("div");
    cloud.classList.add("cumulonimbus");

    const initWidth = 20 + Math.random() * 20;
    const initHeight = initWidth * (0.5 + Math.random() * 0.3);
    cloud.style.left = e.clientX - initWidth/2 + "px";
    cloud.style.top = e.clientY - initHeight/2 + "px";
    cloud.style.width = initWidth + "px";
    cloud.style.height = initHeight + "px";
    cloud.style.opacity = 0.8;

    cloud.dataset.growthSpeed = 0.3 + Math.random() * 0.7;
    cloud.dataset.maxWidth = 80 + Math.random() * 120;
    cloud.dataset.maxHeight = parseFloat(cloud.dataset.maxWidth) * (0.5 + Math.random() * 0.3);

    sky.appendChild(cloud);
    clouds.push(cloud);

    setTimeout(() => {
        cloud.style.width = (initWidth + 50) + "px";
        cloud.style.height = (initHeight + 30) + "px";
    }, 50);
});

// Fungsi update awan tiap frame
function animateClouds() {
    clouds.forEach((cloud, i) => {
        let w = parseFloat(cloud.style.width);
        let h = parseFloat(cloud.style.height);
        let growthSpeed = parseFloat(cloud.dataset.growthSpeed);
        let maxW = parseFloat(cloud.dataset.maxWidth);
        let maxH = parseFloat(cloud.dataset.maxHeight);

        if (w < maxW) {
            cloud.style.width = w + growthSpeed + "px";
            cloud.style.height = h + growthSpeed * 0.6 + "px";
        } else {
            if (Math.random() < 0.002) {
                cloud.style.width = w - growthSpeed + "px";
                cloud.style.height = h - growthSpeed * 0.6 + "px";
                cloud.style.opacity = parseFloat(cloud.style.opacity) - 0.005;
                if (parseFloat(cloud.style.opacity) <= 0) {
                    sky.removeChild(cloud);
                    clouds.splice(i, 1);
                }
            }
        }

        clouds.forEach(other => {
            if (other !== cloud) {
                const rect1 = cloud.getBoundingClientRect();
                const rect2 = other.getBoundingClientRect();
                if (rect1.left < rect2.right &&
                    rect1.right > rect2.left &&
                    rect1.top < rect2.bottom &&
                    rect1.bottom > rect2.top) {
                    if (rect1.top < rect2.top) {
                        cloud.style.top = parseFloat(cloud.style.top) - 0.1 + "px";
                        cloud.style.left = parseFloat(cloud.style.left) - 0.1 + "px";
                    }
                }
            }
        });
    });

    requestAnimationFrame(animateClouds);
}
animateClouds();

// ================= SUPER CELL ===================
const supercellBtn = document.getElementById("supercellBtn");

supercellBtn.addEventListener("click", () => {
    const centerX = window.innerWidth / 2;
    const topY = 50;

    for (let i = 0; i < 30; i++) {
        const cloud = document.createElement("div");
        cloud.classList.add("cumulonimbus");

        const offsetX = (Math.random() - 0.5) * 200;
        const initWidth = 20 + Math.random() * 30;
        const initHeight = initWidth * (0.5 + Math.random() * 0.3);
        cloud.style.left = centerX + offsetX - initWidth/2 + "px";
        cloud.style.top = topY + Math.random() * 50 + "px";
        cloud.style.width = initWidth + "px";
        cloud.style.height = initHeight + "px";
        cloud.style.opacity = 0.8;

        cloud.dataset.growthSpeed = 0.3 + Math.random() * 0.7;
        cloud.dataset.maxWidth = 80 + Math.random() * 120;
        cloud.dataset.maxHeight = parseFloat(cloud.dataset.maxWidth) * (0.5 + Math.random() * 0.3);

        sky.appendChild(cloud);
        clouds.push(cloud);
    }
});
