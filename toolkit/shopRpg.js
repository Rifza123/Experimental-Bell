//════════════════════════════════════════
const ShopRPG = {
  buy: {
    energy: 2394976,
    potion: 2227,
    kayu: 11413,
    diamond: 2269,
  },
  sell: {
    energy: 13115952,
    potion: 2226,
    diamond: 1512,
  },
  diskon: {},
  inflasi: {
    persentasePerubahan: 0.1,
    evaluasiTerakhir: 1747822434162,
  },
  statistik: {
    diamond: {
      beli: 4,
      jual: 0,
    },
    energy: {
      beli: 1,
      jual: 0,
    },
  },
};
Object.defineProperty(ShopRPG.inflasi, 'PeningkatanInflasi', {
  get() {
    return global.cfg?.inflasi ?? false;
  },
});
export { ShopRPG };
//════════════════════════════════════════
