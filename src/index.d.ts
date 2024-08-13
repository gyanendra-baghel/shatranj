declare module "shataranj" {
  class Shataranj {
    constructor(elemId: string, size: number);
    init(time?: number): void;
    destroy(): void;
  }

  export default Shataranj;
}
