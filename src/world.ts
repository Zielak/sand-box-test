import { PIXEL_TYPES } from './pixel';
import { Sand, SAND_PIXEL_TYPE } from './pixel/sand';
import { VOID_PIXEL_TYPE } from './pixel/void';
import { limitI8, limitU8 } from './utils/numbers';

const TMP_VELOCITY = { x: 0, y: 0 };

export class PixelWorld {
  private width: number;
  private height: number;

  private delta: number = 0;

  public gravity = 8;

  /**
   * RGBA separated in each number.
   */
  public colors: Uint8Array;

  /**
   * Type IDs of each pixel.
   * 255 max pixel types for now.
   */
  private types: Uint8Array;

  /**
   * X and Y one after another.
   * Max velocity 127px
   */
  private velocities: Int8Array;

  /**
   * Max ~65.5s of being idle, non updated pixel.
   * TODO: Use "static" property to ignore pixels.
   */
  private idleTimes: Uint16Array;

  constructor(width: number, height: number, types?: Uint8Array) {
    const size = width * height;

    this.width = width;
    this.height = height;

    if (types && types.length !== size) {
      console.warn(
        `PixelWorld.constructor() | Size of provided types map doesn't match width * height.`
      );
    }
    this.types = types?.length === size ? types : new Uint8Array(size);

    this.colors = new Uint8Array(size * 4);
    this.repaintColors();

    this.velocities = new Int8Array(size * 2);
    this.idleTimes = new Uint16Array(size);
    // this.idleTimes = new Uint16Array(size);
  }

  getType(x: number, y: number): number {
    return this.types[x * y] ?? VOID_PIXEL_TYPE;
  }

  /**
   * 0xRRGGBBAA format for Pixi.js
   * just based on pixel type.
   */
  // getColor(): number {}

  getVelocityX(x: number, y: number) {
    return this.velocities[x * y] ?? 0;
  }
  getVelocityY(x: number, y: number) {
    return this.velocities[x * y + 1] ?? 0;
  }
  getVelocity(x: number, y: number) {
    return {
      x: this.getVelocityX(x, y),
      y: this.getVelocityY(x, y),
    };
  }

  setVelocity(x: number, y: number, vx: number, vy: number) {
    this.velocities[x * y] = limitI8(vx);
    this.velocities[x * y] = limitI8(vx);
  }

  /**
   * How much time has passed since last time this
   * pixel was updated?
   */
  getIdleTime(x: number, y: number): number {
    return this.idleTimes[x * y] ?? 0;
  }

  update(delta: number) {
    this.delta = delta;

    /**
     * Simulate movement
     */
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.simulate(x, y);
      }
    }

    /**
     * Move pixels around
     */
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.move(x, y);
      }
    }
  }

  /**
   * Talk to pixel, understand what it wants
   */
  private simulate(x: number, y: number) {
    TMP_VELOCITY.x = this.getVelocityX(x, y);
    TMP_VELOCITY.y = this.getVelocityY(x, y);

    const pixelType = this.getType(x, y);

    switch (pixelType) {
      case SAND_PIXEL_TYPE:
        Sand.getVelocity({ delta: this.delta, velocity: TMP_VELOCITY, x, y });
    }

    this.setVelocity(x, y, TMP_VELOCITY.x, TMP_VELOCITY.y);
  }

  /**
   * Careful, this function doesn't care if target pixel spot
   * is occupied or not!
   */
  private move(x1: number, y1: number) {
    const { x: vx, y: vy } = this.getVelocity(x1, y1);

    if (vx === 0 && vy === 0) return;

    const x2 = x1 + vx;
    const y2 = y1 + vy;

    this.types[x2 * y2] = this.getType(x1, y1);

    this.velocities[x2 * y2] = this.getVelocityX(x1, y1);
    this.velocities[x2 * y2 + 1] = this.getVelocityY(x1, y1);

    this.idleTimes[x2 * y2] = this.getIdleTime(x1, y1);
  }

  private repaintColors() {
    let color, index: number;

    const size = this.width * this.height;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        color = PIXEL_TYPES[this.getType(x, y)].visual.baseColor;
        index = x * 4 * y;

        const [r, g, b, a] = [
          (color & 0xff000000) >>> 24,
          (color & 0x00ff0000) >>> 16,
          (color & 0x0000ff00) >>> 8,
          color & 0x000000ff,
        ];

        this.colors[index] = r;
        this.colors[index + 1] = g;
        this.colors[index + 2] = b;
        this.colors[index + 3] = a;
      }
    }
  }
}
