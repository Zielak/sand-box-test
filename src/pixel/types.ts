import { PixelWorld } from "../world/world.js";

export type PixelVisual = {
  baseColor: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
};

export type PixelBehaviourOptions = {
  velocity: Velocity;
  x: number;
  y: number;
};

export interface PixelSystem {
  type: number;
  visual: PixelVisual;
  getVelocity(world: PixelWorld, options: PixelBehaviourOptions): void;
}

export type Velocity = { x: number; y: number };
