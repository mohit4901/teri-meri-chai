let audioCtx;

export function playBeep() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  o.type = "sine";
  o.frequency.value = 900;

  o.connect(g);
  g.connect(audioCtx.destination);

  g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);

  o.start();
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
  o.stop(audioCtx.currentTime + 0.36);
}
