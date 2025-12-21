let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export async function unlockSound() {
  try {
    const ctx = getAudioCtx();

    // 🔥 VERY IMPORTANT: wait for resume
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    localStorage.setItem("soundEnabled", "true");

    // 🔔 test beep AFTER resume
    playBeep(true);
  } catch (e) {
    console.warn("Sound unlock failed", e);
  }
}

// 🔥 auto restore sound after refresh (best effort)
export async function tryAutoRestoreSound() {
  try {
    if (localStorage.getItem("soundEnabled") !== "true") return false;

    const ctx = getAudioCtx();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    return ctx.state === "running";
  } catch {
    return false;
  }
}

export function playBeep(force = false) {
  try {
    if (!force && localStorage.getItem("soundEnabled") !== "true") return;

    const ctx = getAudioCtx();
    if (ctx.state !== "running") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";        // 🔥 loud & clear
    osc.frequency.value = 1200;

    gain.gain.value = 0.6;      // 🔥 audible everywhere

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.log("beep error", e);
  }
}

