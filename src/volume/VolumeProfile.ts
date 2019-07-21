
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";

export class VolumeProfileInput extends IndicatorInput {
  public high: number[];
  public open: number[];
  public low: number[];
  public close: number[];
  public volume: number[];
  public noOfBars: number;
}

export class VolumeProfileOutput {
  public rangeStart: number;
  public rangeEnd: number;
  public bullishVolume: number;
  public bearishVolume: number;
}

export function priceFallsBetweenBarRange(low, high, low1, high1) {
  return (low <= low1 && high >= low1) || (low1 <= low && high1 >= low);
}

export class VolumeProfile extends Indicator {

  public static calculate = volumeprofile;
  public generator: IterableIterator<number | undefined>;
  constructor(input: VolumeProfileInput) {
      super(input);
      const highs       = input.high;
      const lows        = input.low;
      const closes      = input.close;
      const opens       = input.open;
      const volumes     = input.volume;
      const bars      = input.noOfBars;

      if (!((lows.length === highs.length) && (highs.length === closes.length) && (highs.length === volumes.length))) {
        throw new Error(("Inputs(low,high, close, volumes) not of equal size"));
      }

      this.result = [];

      const max = Math.max(...highs, ...lows, ...closes, ...opens);
      const min = Math.min(...highs, ...lows, ...closes, ...opens);
      const barRange = (max - min) / bars;
      let lastEnd = min;
      for (let i = 0; i < bars; i++) {
        const rangeStart = lastEnd;
        const rangeEnd = rangeStart + barRange;
        lastEnd = rangeEnd;
        let bullishVolume = 0;
        let bearishVolume = 0;
        let totalVolume = 0;
        for (let priceBar = 0; priceBar < highs.length; priceBar++) {
          const priceBarStart = lows[priceBar];
          const priceBarEnd = highs[priceBar];
          const priceBarOpen = opens[priceBar];
          const priceBarClose = closes[priceBar];
          const priceBarVolume = volumes[priceBar];
          if (priceFallsBetweenBarRange(rangeStart, rangeEnd, priceBarStart, priceBarEnd)) {
            totalVolume = totalVolume + priceBarVolume;
            if (priceBarOpen > priceBarClose) {
              bearishVolume = bearishVolume + priceBarVolume;
            } else {
              bullishVolume = bullishVolume + priceBarVolume;
            }
          }
        }
        this.result.push({
          rangeStart, rangeEnd, bullishVolume, bearishVolume, totalVolume,
        });
      }
  }

  public nextValue(price: CandleData): number | undefined {
     throw new Error(("Next value not supported for volume profile"));
  }
}

export function volumeprofile(input: VolumeProfileInput): number[] {
      Indicator.reverseInputs(input);
      const result = new VolumeProfile(input).result;
      if (input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
