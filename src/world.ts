import { WORLD_HEIGHT, WORLD_WIDTH } from "./constants.js";
import { PixelWorld } from "./world/world.js";

export const pixelsMap = new Uint8Array(WORLD_WIDTH * WORLD_HEIGHT);

export const world = new PixelWorld(WORLD_WIDTH, WORLD_HEIGHT, pixelsMap);

console.log("pixelsMap created", pixelsMap);
