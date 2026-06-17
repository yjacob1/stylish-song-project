document.addEventListener('DOMContentLoaded', () => {
    // Player State Variables
    let isPlaying = false;
    let currentTime = 0;
    const duration = 55; // Total length of the simulated song in seconds
    let intervalId = null;

    // DOM Elements
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressBarWrapper = document.getElementById('progress-bar-wrapper');
    const currentTimeDisplay = document.getElementById('current-time');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const lyricsContainer = document.getElementById('lyrics-container');
    const playerContainer = document.querySelector('.player-container');
    const lyricLines = document.querySelectorAll('.lyric-line');

    // Parse lyric times
    const lyricsData = Array.from(lyricLines).map(line => ({
        element: line,
        time: parseFloat(line.getAttribute('data-time'))
    }));

    // Helper: Format Time in M:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Play/Pause Song Simulation
    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.querySelector('.play-icon').textContent = '⏸';
            playerContainer.classList.add('playing');
            startSimulation();
        } else {
            playBtn.querySelector('.play-icon').textContent = '▶';
            playerContainer.classList.remove('playing');
            stopSimulation();
        }
    }

    function startSimulation() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (currentTime >= duration) {
                // Reset player at the end of the song
                currentTime = 0;
                togglePlay();
                updateUI();
            } else {
                currentTime += 0.1;
                updateUI();
            }
        }, 100);
    }

    function stopSimulation() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Update Progress and Highlighting
    function updateUI() {
        // Update progress bar width
        const progressPercentage = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // Update time labels
        currentTimeDisplay.textContent = formatTime(currentTime);

        // Highlight current lyric line
        let activeIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }

        // Apply active class and scroll into view
        lyricLines.forEach((line, idx) => {
            if (idx === activeIndex) {
                if (!line.classList.contains('active')) {
                    line.classList.add('active');
                    // Center the active line in container
                    const containerHeight = lyricsContainer.clientHeight;
                    const lineOffsetTop = line.offsetTop;
                    const lineHeight = line.clientHeight;
                    lyricsContainer.scrollTop = lineOffsetTop - (containerHeight / 2) + (lineHeight / 2);
                }
            } else {
                line.classList.remove('active');
            }
        });
    }

    // Click on progress bar to seek
    progressBarWrapper.addEventListener('click', (e) => {
        const rect = progressBarWrapper.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        currentTime = percentage * duration;
        updateUI();
    });

    // Click on lyric line to seek
    lyricLines.forEach(line => {
        line.addEventListener('click', () => {
            const time = parseFloat(line.getAttribute('data-time'));
            currentTime = time;
            updateUI();
            // Start playing automatically if clicked
            if (!isPlaying) {
                togglePlay();
            }
        });
    });

    // Navigation Buttons (Prev/Next lyric line)
    prevBtn.addEventListener('click', () => {
        let activeIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }
        if (activeIndex > 0) {
            currentTime = lyricsData[activeIndex - 1].time;
            updateUI();
        } else {
            currentTime = 0;
            updateUI();
        }
    });

    nextBtn.addEventListener('click', () => {
        let activeIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }
        if (activeIndex < lyricsData.length - 1) {
            currentTime = lyricsData[activeIndex + 1].time;
            updateUI();
        }
    });

    // Dark/Light Theme Switching
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            themeToggleBtn.querySelector('.icon').textContent = '🌙';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeToggleBtn.querySelector('.icon').textContent = '☀️';
        }
    });

    // Event listener for Play Button click
    playBtn.addEventListener('click', togglePlay);

    // Initial setup UI
    updateUI();
});
