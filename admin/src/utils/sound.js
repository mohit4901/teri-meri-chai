let unlocked = false;
let audioSrc = null;

export async function unlockSound() {
  try {
    // preload MP3 once
    if (!audioSrc) {
      audioSrc = new Audio("/alarm.mp3");
      audioSrc.preload = "auto";
      audioSrc.volume = 1;
    }

    // 🔥 user-gesture bound play
    await audioSrc.play();
    audioSrc.pause();
    audioSrc.currentTime = 0;

    unlocked = true;
    console.log("🔊 Sound unlocked");
  } catch (e) {
    console.error("Unlock failed", e);
  }
}

export function playBeep() {
  try {
    if (!unlocked) return;

    // 🔥 IMPORTANT: new Audio instance every time
    const beep = new Audio("/alarm.mp3");
    beep.volume = 1;
    beep.play().catch(() => {});
  } catch (e) {
    console.error("play error", e);
  }
}

