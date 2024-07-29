import { PIXEL_TYPES } from "../pixel/index.js";
import { Sand, SAND_PIXEL_TYPE } from "../pixel/sand.js";
import { VOID_PIXEL_TYPE } from "../pixel/void.js";
import { limit, limitI8, limitU8 } from "../utils/numbers.js";

export class PixelWorld {
  private width: number;
  private height: number;

  public delta: number = 0;

  public gravity = 8;

  public physScale = 6;

  // DATA = {
  //   type: {
  //     pre: Uint8Array,
  //     now: Uint8Array
  //   },
  //   velocity: {

  //   }
  // }
  /**
   * RGBA separated in each number.
   */
  public colors: Uint8Array;

  /**
   * Type IDs of each pixel.
   * 255 max pixel types for now.
   */
  private pixelTypesMap: Uint8Array;

  /**
   * Was pixel moved this frame?
   */
  private moved: Uint8Array;

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

  constructor(width: number, height: number, pixelTypes?: Uint8Array) {
    const size = width * height;

    this.width = width;
    this.height = height;

    if (pixelTypes && pixelTypes.length !== size) {
      console.warn(
        `PixelWorld.constructor() | Size of provided types map doesn't match width * height.`
      );
    }
    this.pixelTypesMap = pixelTypes ?? new Uint8Array(size);
    this.moved = new Uint8Array(size);

    this.colors = new Uint8Array(size * 4);
    this.repaintColors();

    this.velocities = new Int8Array(size * 2);
    this.idleTimes = new Uint16Array(size);
    // this.idleTimes = new Uint16Array(size);
  }

  getType(x: number, y: number): number {
    return this.pixelTypesMap[x + y * this.width] ?? VOID_PIXEL_TYPE;
  }

  /**
   * 0xRRGGBBAA format for Pixi.js
   * just based on pixel type.
   */
  // getColor(): number {}

  getVelocityX(x: number, y: number) {
    return this.velocities[this.toVelocityIndex(x, y)] ?? 0;
  }
  getVelocityY(x: number, y: number) {
    return this.velocities[this.toVelocityIndex(x, y) + 1] ?? 0;
  }
  getVelocity(x: number, y: number) {
    return {
      x: this.getVelocityX(x, y),
      y: this.getVelocityY(x, y),
    };
  }

  setVelocity(x: number, y: number, vx: number, vy: number) {
    const i = this.toVelocityIndex(x, y);
    this.velocities[i] = limitI8(vx);
    this.velocities[i + 1] = limitI8(vy);
  }
  toVelocityIndex(x: number, y: number): number {
    return x * 2 + y * this.width * 2;
  }

  /**
   * How much time has passed since last time this
   * pixel was updated?
   */
  getIdleTime(x: number, y: number): number {
    return this.idleTimes[x + y * this.width] ?? 0;
  }

  setPixel(x: number, y: number, type: number) {
    this.pixelTypesMap[x + y * this.width] = type;
  }

  update(delta: number) {
    this.delta = delta;

    this.moved.fill(0);

    /**
     * Simulate movement
     */
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.simulate(x, y);
      }
    }

    /**
     * Move pixels around
     */
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (!this.moved[x + y * this.width]) {
          this.move(x, y);
        }
      }
    }

    this.repaintColors();
  }

  /**
   * Talk to pixel, understand what it wants
   */
  private simulate(x: number, y: number) {
    const TMP_VELOCITY = {
      x: this.getVelocityX(x, y),
      y: this.getVelocityY(x, y),
    };

    const pixelType = this.getType(x, y);

    PIXEL_TYPES[pixelType].getVelocity(this, {
      velocity: TMP_VELOCITY,
      x,
      y,
    });

    this.setVelocity(x, y, TMP_VELOCITY.x, TMP_VELOCITY.y);
  }

  /**
   * Careful, this function doesn't care if target pixel spot
   * is occupied or not!
   */
  private move(x1: number, y1: number) {
    const { x: vx, y: vy } = this.getVelocity(x1, y1);

    if (vx === 0 && vy === 0) return;

    // FIXME: can't limit here like that... the flow is all fucked...
    const xTarget = limit(
      Math.round(x1 + vx / this.physScale),
      0,
      this.width - 1
    );
    const yTarget = limit(
      Math.round(y1 + vy / this.physScale),
      0,
      this.height - 1
    );

    const iSource = x1 + y1 * this.width;
    const iSourceVelocities = x1 * 2 + y1 * this.width * 2;

    const iTarget = xTarget + yTarget * this.width;
    const iTargetVelocities = this.toVelocityIndex(xTarget, yTarget);

    this.pixelTypesMap[iTarget] = this.getType(x1, y1);
    this.pixelTypesMap[iSource] = 0;

    this.velocities[iTargetVelocities] = this.getVelocityX(x1, y1);
    this.velocities[iTargetVelocities + 1] = this.getVelocityY(x1, y1);
    this.velocities[iSourceVelocities] = 0;
    this.velocities[iSourceVelocities + 1] = 0;

    this.idleTimes[iTarget] = this.getIdleTime(x1, y1);
    this.idleTimes[iSource] = 0;

    this.moved[iTarget] = 1;
  }

  private repaintColors() {
    let color, index: number;

    // const size = this.width * this.height;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        color = PIXEL_TYPES[this.getType(x, y)].visual.baseColor;
        index = x * 4 + this.width * 4 * y;

        this.colors[index] = color.r;
        this.colors[index + 1] = color.g;
        this.colors[index + 2] = color.b;
        this.colors[index + 3] = color.a;
      }
    }
  }
}
