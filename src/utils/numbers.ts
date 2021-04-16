export const limit = (val: number, min = 0, max = 1): number =>
  val < min ? min : val > max ? max : val;

export const limitU8 = (val: number) => limit(val, 0, 255);
export const limitI8 = (val: number) => limit(val, -128, 127);
export const limitU16 = (val: number) => limit(val, 0, 65535);
export const limitI16 = (val: number) => limit(val, -32768, 32767);
