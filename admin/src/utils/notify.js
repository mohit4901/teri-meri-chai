import { toast } from "react-toastify";

export const notifySuccess = (msg) =>
  toast.success(msg, { position: "top-right" });

export const notifyError = (msg) =>
  toast.error(msg, { position: "top-right" });

export const notifyInfo = (msg) =>
  toast.info(msg, { position: "top-right" });

// 📳 vibration (already added)
export function vibrate() {
  try {
    navigator.vibrate?.([200, 100, 200]);
  } catch {}
}
