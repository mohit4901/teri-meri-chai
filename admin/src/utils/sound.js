let audioCtx = null;
let buffer = null;
let keepAliveInterval = null;

export async function unlockSound() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const res = await fetch("/alarm.mp3");
    const arr = await res.arrayBuffer();
    buffer = await audioCtx.decodeAudioData(arr);

    await audioCtx.resume();

    // 🔊 REAL unlock sound
    playBeep();

    // 🔥 KEEP AUDIO CONTEXT ALIVE
    if (!keepAliveInterval) {
      keepAliveInterval = setInterval(() => {
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
      }, 1000);
    }

    console.log("🔊 Sound unlocked & kept alive");
  } catch (e) {
    console.error("Sound unlock failed", e);
  }
}

export function playBeep() {
  try {
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

