import { hexRgba2Component } from "../utils/colors.js";
import { PixelSystem } from "./types.js";

export const EMPTY_PIXEL_TYPE = 0;

export const Empty: PixelSystem = {
  type: EMPTY_PIXEL_TYPE,
  visual: {
    baseColor: hexRgba2Component(0x000000ff),
  },
  getVelocity: () => {},
};
