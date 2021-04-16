import { Empty, EMPTY_PIXEL_TYPE } from "./empty"
import { Sand, SAND_PIXEL_TYPE } from "./sand"
import { Void, VOID_PIXEL_TYPE } from "./void"

export const PIXEL_TYPES: Record<number, PixelSystem> = {
  [SAND_PIXEL_TYPE]: Sand,
  [VOID_PIXEL_TYPE]: Void,
  [EMPTY_PIXEL_TYPE]: Empty,
};
