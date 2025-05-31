"use client";

import { sendPushSubscription } from "@/apis/home";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { useEffect } from "react";

const VAPID_PUBLIC_KEY =
  "BDVUxkaLeEr3zJFjdQ0gf2AHkE3Z889GkcNomAyQk3H2m3P9MSwKteJdtreSe4FfHsToSikEQfnwdV0C3YHyp2M";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

const PushNotifications = () => {
  useEffect(() => {
    const registerAndSubscribe = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        console.log("[1] Service worker and PushManager supported");

        try {
          const registration =
            await navigator.serviceWorker.register("/service-worker.js");
          console.log("[2] Service Worker registered:", registration);

          const permission = await Notification.requestPermission();
          console.log("[3] Notification permission:", permission);

          if (permission !== "granted") {
            console.warn("[3.1] Permission not granted");
            return;
          }
          let subscription;
          try {
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            console.log("[4] Push subscription:", subscription);
          } catch (subErr) {
            console.error("[❌] Subscription failed:", subErr);
            return;
          }

          const payload = {
            indPushNotify: true,
            notificationObj: {
              endpoint: subscription.endpoint,
              expirationTime: subscription.expirationTime,
              keys: subscription.toJSON().keys,
            },
          };

          console.log("[5] Sending payload:", payload);

          let res = await sendPushSubscription(payload);

          const data = await res.json();
          console.log("[6] API response:", data);
        } catch (err) {
          console.error("[❌] Error in registration/subscription:", err);
        }
      } else {
        console.warn("[❌] Push not supported in this browser");
      }
    };

    registerAndSubscribe();
  }, []);

  return null;
};

export default PushNotifications;
