let audio = null;

// 🔓 user gesture se audio unlock
export function unlockSound() {
  try {
    if (!audio) {
      audio = new Audio("/alarm.mp3");
      audio.preload = "auto";
      audio.loop = false;
    }

    audio.muted = false;
    audio.volume = 1;

    // 🔥 VERY IMPORTANT: silent play-pause unlock
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
    });

    localStorage.setItem("soundEnabled", "true");
  } catch (e) {
    console.warn("Audio unlock failed", e);
  }
}

// 🔁 refresh ke baad auto-restore try
export function tryAutoRestoreSound() {
  try {
    const enabled = localStorage.getItem("soundEnabled") === "true";
    if (!enabled) return false;

    if (!audio) {
      audio = new Audio("/alarm.mp3");
      audio.preload = "auto";
    }

    audio.muted = false;
    audio.volume = 1;
    return true;
  } catch {
    return false;
  }
}

// 🔔 ORDER SOUND (GUARANTEED)
export function playBeep() {
  try {
    const enabled = localStorage.getItem("soundEnabled") === "true";
    if (!enabled || !audio) return;

    audio.currentTime = 0;
    audio.play(); // 🔥 WORKS on socket / polling / background
  } catch (e) {
    console.log("play error", e);
  }
}

