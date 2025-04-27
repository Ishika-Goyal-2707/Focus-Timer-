  // Quotes array
  const quotes = [
    "Focus on being productive instead of busy. – Tim Ferriss",
    "Your future is created by what you do today, not tomorrow. – Robert Kiyosaki",
    "The way to get started is to quit talking and begin doing. – Walt Disney",
    "Small steps every day lead to big results. – Unknown",
    "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
    "Stay focused. Stay humble. Stay driven. – Unknown"
  ];
  
  // Elements
  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const quoteDisplay = document.getElementById('quote');
  const sessionCountDisplay = document.getElementById('sessionCount');
  const focusMusic = document.getElementById('focusMusic');
  const musicSelect = document.getElementById('musicSelect');
  const volumeControl = document.getElementById('volumeControl');
  const toggleSoundBtn = document.getElementById('toggleSoundBtn');
  const changeMusicBtn = document.getElementById('changeMusicBtn');
  
  let isRunning = false;
  let isBreak = false;
  let timerInterval;
  let quoteInterval;
  let remainingSeconds = 25 * 60;
  let sessionCount = parseInt(localStorage.getItem('sessionCount')) || 0;
  
  sessionCountDisplay.textContent = sessionCount;
  
  function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
    const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.style.opacity = 0;
    setTimeout(() => {
      quoteDisplay.textContent = quotes[randomIndex];
      quoteDisplay.style.opacity = 1;
    }, 300);
  }
  
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
  
    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateTimerDisplay();
  
      // Show quote every 5 minutes (300 seconds)
      if (remainingSeconds % 300 === 0 && remainingSeconds !== 0) {
        showRandomQuote();
      }
  
      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        clearInterval(quoteInterval);
        if (!isBreak) {
          sessionCount++;
          localStorage.setItem('sessionCount', sessionCount);
          sessionCountDisplay.textContent = sessionCount;
          alert("Focus session complete! Time for a break 🎉");
          startBreak();
        } else {
          alert("Break over! Back to focus 💪");
          startFocus();
        }
      }
    }, 1000);
  
    if (quoteInterval) clearInterval(quoteInterval);
    quoteInterval = setInterval(showRandomQuote, 300000); // Show new quote every 5 minutes (this can be optional now)
  }
  
  function startFocus() {
    isBreak = false;
    focusMusic.src = musicSelect.value; // Set selected music
    focusMusic.play(); // Play music on focus start
    focusMusic.volume = volumeControl.value; // Set volume
    startTimer();
  }
  
  function startBreak() {
    isBreak = true;
    remainingSeconds = 5 * 60;
    updateTimerDisplay();
    focusMusic.pause(); // Pause music during break
    startTimer();
  }
  
  function changeMusic() {
    const currentIndex = musicSelect.selectedIndex;
    const nextIndex = (currentIndex + 1) % musicSelect.options.length;
    musicSelect.selectedIndex = nextIndex;
    focusMusic.src = musicSelect.value; // Change music source
    focusMusic.play(); // Play selected music
  }
  
  function toggleSound() {
    if (focusMusic.muted) {
      focusMusic.muted = false;
      toggleSoundBtn.textContent = "Mute";
    } else {
      focusMusic.muted = true;
      toggleSoundBtn.textContent = "Unmute";
    }
  }
  
  // Event listeners
  startBtn.addEventListener('click', () => {
    if (!isRunning) {
      // Start music and timer after user interaction
      focusMusic.play().then(() => {
        startFocus();
        isRunning = true;
        startBtn.textContent = "Pause";
        resetBtn.style.display = "inline-block";
      }).catch(error => {
        console.error("Error with music playback: ", error);
        alert("Music failed to play. Please check your browser settings.");
      });
    } else {
      clearInterval(timerInterval);
      clearInterval(quoteInterval);
      focusMusic.pause(); // Pause music if timer is stopped
      isRunning = false;
      startBtn.textContent = "Resume";
    }
  });
  
  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    clearInterval(quoteInterval);
    focusMusic.pause(); // Pause music on reset
    isRunning = false;
    startBtn.textContent = "Start";
    resetBtn.style.display = "none";
    remainingSeconds = 25 * 60;
    updateTimerDisplay();
    quoteDisplay.textContent = "";
  });
  
  changeMusicBtn.addEventListener('click', changeMusic); // Change music
  toggleSoundBtn.addEventListener('click', toggleSound); // Toggle sound
  
  // Volume control
  volumeControl.addEventListener('input', () => {
    focusMusic.volume = volumeControl.value;
  });
  
  // Initialize
  updateTimerDisplay();