export function vibrate() {
  try {
    navigator.vibrate?.([200, 100, 200]);
  } catch {}
}
