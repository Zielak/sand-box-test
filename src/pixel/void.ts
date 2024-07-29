import { hexRgba2Component } from "../utils/colors.js";
import { PixelSystem } from "./types.js";

/**
 * Pixel type to mark out of bounds pixels
 */
export const VOID_PIXEL_TYPE = 255;

export const Void: PixelSystem = {
  type: VOID_PIXEL_TYPE,
  visual: {
    baseColor: hexRgba2Component(0x000000ff),
  },
  getVelocity: () => {},
};
