export const getDeviceFingerprint = () => {
  if (typeof window !== "undefined" && navigator.userAgent) {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezoneOffset = new Date().getTimezoneOffset();

    const fingerprint: string = `${userAgent.replace(/\s+/g, "")}|${language.replace(/\s+/g, "")}|${hardwareConcurrency}|${screenResolution.replace(/\s+/g, "")}|${timezoneOffset}`;
    console.log(`finger:${fingerprint}`);
    return fingerprint;
  }
  return "devicefingerprint";
};
