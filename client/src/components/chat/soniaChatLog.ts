const PREFIX = "[SON.IA chat]";

export function soniaChatWarn(message: string, detail?: unknown) {
  if (detail !== undefined) {
    console.warn(PREFIX, message, detail);
    return;
  }
  console.warn(PREFIX, message);
}

export function soniaChatError(message: string, detail?: unknown) {
  if (detail !== undefined) {
    console.error(PREFIX, message, detail);
    return;
  }
  console.error(PREFIX, message);
}

export function soniaChatDebug(message: string, detail?: unknown) {
  if (import.meta.env.DEV) {
    if (detail !== undefined) {
      console.debug(PREFIX, message, detail);
      return;
    }
    console.debug(PREFIX, message);
  }
}
