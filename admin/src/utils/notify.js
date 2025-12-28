import { toast } from "react-toastify";

/* ===============================
   TOAST NOTIFICATIONS (LOGIN, ETC)
=============================== */
export const notifySuccess = (msg) =>
  toast.success(msg, { position: "top-right" });

export const notifyError = (msg) =>
  toast.error(msg, { position: "top-right" });

export const notifyInfo = (msg) =>
  toast.info(msg, { position: "top-right" });

/* ===============================
   MOBILE VIBRATION (KITCHEN)
=============================== */
export function vibrate() {
  try {
    navigator.vibrate?.([200, 100, 200]);
  } catch {}
}
