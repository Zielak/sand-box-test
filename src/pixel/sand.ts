import { world } from '../app';
import { EMPTY_PIXEL_TYPE } from './empty';

export const SAND_PIXEL_TYPE = 1;

export const Sand: PixelSystem = {
  type: SAND_PIXEL_TYPE,
  visual: {
    baseColor: 0x668800ff,
  },
  getVelocity: ({ delta, velocity, x, y }: PixelBehaviourOptions) => {
    // Pixel below is occupied
    const sitting = world.getType(x, y + 1) === EMPTY_PIXEL_TYPE;

    if (sitting) {
      return;
    }

    return {};
  },
};
