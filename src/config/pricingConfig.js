export const PRICING_RULES = {
  vCPU: {
    price: 200,
    min: 1,
    max: 64,
    step: 1,
  },
  RAM: {
    price: 85,
    min: 1,
    max: 256,
    step: 1,
  },
  SSD: {
    price: 100,
    baseIncrement: 50,
    min: 50,
    max: 2000,
    step: 50,
  },
};
