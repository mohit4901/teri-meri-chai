let audioCtx = null;
let buffer = null;

export async function unlockSound() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const res = await fetch("/alarm.mp3");
    const arrayBuffer = await res.arrayBuffer();
    buffer = await audioCtx.decodeAudioData(arrayBuffer);

    await audioCtx.resume(); // 🔥 CRITICAL

    // 🔊 REAL USER-GESTURE PLAY
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);

    localStorage.setItem("soundEnabled", "true");
    console.log("🔊 Sound unlocked");
  } catch (e) {
    console.error("unlock failed", e);
  }
}

export function playBeep() {
  try {
    if (localStorage.getItem("soundEnabled") !== "true") return;
    if (!audioCtx || !buffer) return;

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
  } catch (e) {
    console.log("play error", e);
  }
}
