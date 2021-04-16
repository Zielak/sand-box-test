/**
 * Pixel type to mark out of bounds pixels
 */
export const VOID_PIXEL_TYPE = 255;

export const Void: PixelSystem = {
  type: VOID_PIXEL_TYPE,
  visual: {
    baseColor: 0x000000ff,
  },
  getVelocity: () => {},
};
