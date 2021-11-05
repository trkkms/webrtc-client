import pako from 'pako';

export const encodeSDP = (sdp: string): string => {
  const deflated = pako.deflate(sdp, { level: 9 });
  const binStr = String.fromCharCode.apply(null, deflated as unknown as number[]);
  return window.btoa(binStr);
};

export const decodeSDP = (base64: string): string => {
  const binStr = window.atob(base64);
  const inflated = pako.inflate(new Uint8Array(binStr.split('').map((c) => c.charCodeAt(0))));
  return String.fromCharCode.apply(null, inflated as unknown as number[]);
};
