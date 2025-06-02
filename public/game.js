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
        serverResponse = { delay: 3 }; // Fallback delay
    }

    // Start spinning animation
    startSpin();
}); 