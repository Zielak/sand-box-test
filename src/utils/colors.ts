export const hexRgba2Component = (color: number) => ({
  r: (color & 0xff000000) >>> 24,
  g: (color & 0x00ff0000) >>> 16,
  b: (color & 0x0000ff00) >>> 8,
  a: color & 0x000000ff,
});
