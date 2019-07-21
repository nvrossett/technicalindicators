import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";

export class VWAPInput extends IndicatorInput {
  public high: number[];
  public low: number[];
  public close: number[];
  public volume: number[];
}

export class VWAP extends Indicator {

  public static calculate = vwap;
  public result: number[];
  public generator: IterableIterator<number | undefined>;
  constructor(input: VWAPInput) {
    super(input);
    const lows = input.low;
    const highs = input.high;
    const closes = input.close;
    const volumes = input.volume;
    const format = this.format;

    if (!((lows.length === highs.length) && (highs.length === closes.length))) {
      throw new Error(("Inputs(low,high, close) not of equal size"));
    }

    this.result = [];

    this.generator = (function*() {
      let tick = yield;
      let cumulativeTotal = 0;
      let cumulativeVolume = 0;
      while (true) {
        const typicalPrice = (tick.high + tick.low + tick.close) / 3;
        const total = tick.volume * typicalPrice;
        cumulativeTotal = cumulativeTotal + total;
        cumulativeVolume = cumulativeVolume + tick.volume;
        tick = yield cumulativeTotal / cumulativeVolume;
      }
    })();

    this.generator.next();

    lows.forEach((tick, index) => {
      const result = this.generator.next({
        high : highs[index],
        low  : lows[index],
        close : closes[index],
        volume : volumes[index],
      });
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  public nextValue(price: CandleData): number | undefined {
      const result = this.generator.next(price).value;
      if (result !== undefined) {
        return result;
      }
  }
}

export function vwap(input: VWAPInput): number[] {
    Indicator.reverseInputs(input);
    const result = new VWAP(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
  }
