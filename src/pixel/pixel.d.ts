type PixelVisual = {
  baseColor: number;
};

type PixelBehaviourOptions = {
  delta: number;
  velocity: Velocity;
  x: number;
  y: number;
};

interface PixelSystem {
  type: number;
  visual: PixelVisual;
  getVelocity(options: PixelBehaviourOptions): void;
}

type Velocity = { x: number; y: number };
