import { Empty, EMPTY_PIXEL_TYPE } from "./empty.js";
import { Sand, SAND_PIXEL_TYPE } from "./sand.js";
import { PixelSystem } from "./types.js";
import { Void, VOID_PIXEL_TYPE } from "./void.js";

export const PIXEL_TYPES: Record<number, PixelSystem> = {
  [SAND_PIXEL_TYPE]: Sand,
  [VOID_PIXEL_TYPE]: Void,
  [EMPTY_PIXEL_TYPE]: Empty,
};
