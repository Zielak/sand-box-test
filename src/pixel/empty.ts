export const EMPTY_PIXEL_TYPE = 0;

export const Empty: PixelSystem = {
  type: EMPTY_PIXEL_TYPE,
  visual: {
    baseColor: 0x000000ff,
  },
  getVelocity: () => {},
};
