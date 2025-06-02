// Game configuration
const config = {
    reels: 5,
    rows: 3,
    symbolSize: 200,
    spinSpeed: 50,
    bounceHeight: 50,
    bounceDuration: 0.5,
    symbols: [
        '../icons/icon1.png',
        '../icons/icon2.png',
        '../icons/icon3.png',
        '../icons/icon4.png',
        '../icons/icon5.png',
        '../icons/icon6.png',
        '../icons/icon7.png',
        '../icons/icon8.png',
    ]
};

// Initialize PIXI Application
const app = new PIXI.Application({
    width: config.reels * config.symbolSize,
    height: config.rows * config.symbolSize,
    backgroundColor: 0xffffff,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true
});

document.getElementById('gameContainer').appendChild(app.view);

// Create reels container
const reelsContainer = new PIXI.Container();
app.stage.addChild(reelsContainer);

// Center the reels container
reelsContainer.x = (app.screen.width - (config.reels * config.symbolSize)) / 2;
reelsContainer.y = (app.screen.height - (config.rows * config.symbolSize)) / 2;

// Create reels
const reels = [];
const symbols = [];

for (let i = 0; i < config.reels; i++) {
    const reel = new PIXI.Container();
    reel.x = i * config.symbolSize;
    reelsContainer.addChild(reel);
    reels.push(reel);

    const reelSymbols = [];
    for (let j = 0; j < config.rows; j++) {
        const symbol = PIXI.Sprite.from(config.symbols[Math.floor(Math.random() * config.symbols.length)]);
        symbol.width = config.symbolSize;
        symbol.height = config.symbolSize;
        symbol.y = j * config.symbolSize;
        reel.addChild(symbol);
        reelSymbols.push(symbol);
    }
    symbols.push(reelSymbols);
}

// Game state
let isSpinning = false;
let serverResponse = null;

// Start button handler
document.getElementById('startButton').addEventListener('click', async () => {
    if (isSpinning) return;
    
    isSpinning = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('serverResponse').textContent = 'Waiting for server...';

    // Start server request
    try {
        const response = await fetch('/api/delay');
        serverResponse = await response.json();
    } catch (error) {
        console.error('Server error:', error);
        serverResponse = { delay: 1 }; // Fallback delay
    }

    // Start spinning animation
    startSpin();
});

function startSpin() {
    let spinTime = 0;
    const spinDuration = 0.5; // seconds per symbol movement

    function animate() {
        if (!isSpinning) return;

        spinTime += 1/60; // Assuming 60fps

        // Move symbols
        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            const reelSymbols = symbols[i];
            
            // Move symbols down
            for (let j = 0; j < reelSymbols.length; j++) {
                const symbol = reelSymbols[j];
                symbol.y += config.spinSpeed;

                // Reset symbol position when it goes off screen
                if (symbol.y > (config.rows + 1) * config.symbolSize) {
                    symbol.y = -config.symbolSize;
                    symbol.texture = PIXI.Texture.from(
                        config.symbols[Math.floor(Math.random() * config.symbols.length)]
                    );
                }
            }
        }

        // Check if we should stop
        if (serverResponse && spinTime >= serverResponse.delay) {
            stopSpin();
            return;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function stopSpin() {
    isSpinning = false;
    document.getElementById('serverResponse').textContent = `Server delay: ${serverResponse.delay}s`;
    document.getElementById('startButton').disabled = false;

    // Apply bounce effect
    for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];
        const reelSymbols = symbols[i];

        // Animate each symbol
        for (let j = 0; j < reelSymbols.length; j++) {
            const symbol = reelSymbols[j];
            const targetY = j * config.symbolSize;

            // Create bounce animation
            gsap.to(symbol, {
                y: targetY + config.bounceHeight,
                duration: config.bounceDuration / 2,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(symbol, {
                        y: targetY,
                        duration: config.bounceDuration / 2,
                        ease: "bounce.out"
                    });
                }
            });
        }
    }
}

// Handle window resize
function resize() {
    // Масштабируем canvas, если экран меньше поля
    const w = window.innerWidth;
    const h = window.innerHeight - 100; // 100px запас для кнопки и текста сверху

    const scale = Math.min(
        w / (config.reels * config.symbolSize),
        h / (config.rows * config.symbolSize),
        1 // не увеличивать больше 1
    );

    app.renderer.view.style.width = `${config.reels * config.symbolSize * scale}px`;
    app.renderer.view.style.height = `${config.rows * config.symbolSize * scale}px`;
}

window.addEventListener('resize', resize);
resize(); 