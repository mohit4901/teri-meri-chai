let audioCtx = null;

export function unlockSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    localStorage.setItem("soundEnabled", "true");

    playBeep(); // 🔔 test sound (IMPORTANT)
  } catch (e) {
    console.warn("Sound unlock failed");
  }
}

// 🔥 NEW: auto restore sound after refresh
export async function tryAutoRestoreSound() {
  try {
    const enabled = localStorage.getItem("soundEnabled") === "true";
    if (!enabled) return false;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    return audioCtx.state === "running";
  } catch {
    return false;
  }
}

export function playBeep() {
  try {
    const enabled = localStorage.getItem("soundEnabled") === "true";
    if (!enabled) return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state !== "running") return;

    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();

    o.type = "sine";
    o.frequency.value = 1000;
    o.connect(g);
    g.connect(audioCtx.destination);

    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.01);

    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
    o.stop(audioCtx.currentTime + 0.36);
  } catch {}
}
