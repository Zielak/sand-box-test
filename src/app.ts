// import { Application, Sprite } from "pixi.js"
// import * as PIXI from 'pixi.js';

import { ROOT, SCALE, WORLD_HEIGHT, WORLD_WIDTH } from "./constants.js";
import { SAND_PIXEL_TYPE } from "./pixel/sand.js";
import { pixelsMap, world } from "./world.js";

const app = new PIXI.Application();

let elapsed = 0;
let frame = 0;
let pixel = 0;

export async function initApp() {
  console.log("initApp");

  await app.init({
    width: WORLD_WIDTH * SCALE,
    height: WORLD_HEIGHT * SCALE,
    antialias: false,
  });

  ROOT.appendChild(app.canvas);

  const worldTexture = new PIXI.Texture(
    PIXI.TextureSource.from({
      resource: world.colors,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      antialias: false,
    })
  );
  worldTexture.source.scaleMode = "nearest";

  const worldSprite = new PIXI.Sprite(worldTexture);

  worldSprite.width = WORLD_WIDTH * SCALE;
  worldSprite.height = WORLD_HEIGHT * SCALE;

  app.stage.addChild(worldSprite);

  world.setPixel(1, 0, 1);

  app.ticker.add((ticker) => {
    // Add the time to our total elapsed time
    elapsed += ticker.deltaTime;
    frame++;

    if (frame % 60 === 0) {
      // console.log("pop", pixel);
      // const x = pixel % WORLD_WIDTH;
      // const y = Math.floor(pixel / WORLD_WIDTH);

      // console.log("pop", x, y);
      // world.setPixel(x, y, SAND_PIXEL_TYPE);
      // pixel++;

      // console.log("tick", ticker.deltaTime);

      world.update(ticker.deltaTime);
    }

    worldTexture.source.update();
  });
}
