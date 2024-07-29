import { hexRgba2Component } from "../utils/colors.js";
import { EMPTY_PIXEL_TYPE } from "./empty.js";
import { PixelSystem } from "./types.js";
import { VOID_PIXEL_TYPE } from "./void.js";

export const SAND_PIXEL_TYPE = 1;

export const Sand: PixelSystem = {
  type: SAND_PIXEL_TYPE,
  visual: {
    baseColor: hexRgba2Component(0x668800ff),
  },
  getVelocity: (world, { velocity, x, y }) => {
    const below = world.getType(x, y + 1);

    const sitting = below !== EMPTY_PIXEL_TYPE;

    if (sitting) {
      return;
    }

    velocity.y += world.gravity / 2;
  },
};
