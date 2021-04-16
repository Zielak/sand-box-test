// import { Application, Sprite } from "pixi.js"
import * as PIXI from 'pixi.js';

import { SAND_PIXEL_TYPE } from './pixel/sand';
import { PixelWorld } from './world';

export const app = new PIXI.Application({
  width: document.body.offsetWidth,
  height: document.body.offsetHeight,
  antialias: false,
});

document.body.appendChild(app.view);

const WORLD_WIDTH = 64;
const WORLD_HEIGHT = 64;

const pixelsMap = new Uint8Array(WORLD_WIDTH * WORLD_HEIGHT);

for (let index = 2000; index < 3000; index++) {
  pixelsMap[index] = SAND_PIXEL_TYPE;
}

export const world = new PixelWorld(WORLD_WIDTH, WORLD_HEIGHT, pixelsMap);

const worldTexture = new PIXI.Texture(
  PIXI.BaseTexture.fromBuffer(world.colors, WORLD_WIDTH, WORLD_HEIGHT, {
    // mipmap: PIXI.MIPMAP_MODES.OFF,
    // scaleMode: PIXI.SCALE_MODES.LINEAR,
  })
);

const worldSprite = new PIXI.Sprite(worldTexture);

worldSprite.width = 256;
worldSprite.height = 256;

app.stage.addChild(worldSprite);

app.ticker.add((delta) => {
  world.update(delta);
});
