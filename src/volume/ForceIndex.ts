import { Indicator, IndicatorInput } from "../indicator/indicator";
import { EMA } from "../moving_averages/EMA";
import { CandleData } from "../StockData";

export class ForceIndexInput extends IndicatorInput {
  public close: number[];
  public volume: number[];
  public period: number = 1;
}

export class ForceIndex extends Indicator {

  public static calculate = forceindex;
  public result: number[];
  public generator: IterableIterator<number | undefined>;
  constructor(input: ForceIndexInput) {
    super(input);
    const closes = input.close;
    const volumes = input.volume;
    const period = input.period || 1;

    if (!((volumes.length === closes.length))) {
      throw new Error(("Inputs(volume, close) not of equal size"));
    }
    const emaForceIndex = new EMA({ values : [], period });
    this.result = [];

    this.generator = (function*() {
      let previousTick = yield;
      let tick = yield;
      let forceIndex;
      while (true) {
        forceIndex = (tick.close - previousTick.close) * tick.volume;
        previousTick = tick;
        tick = yield emaForceIndex.nextValue(forceIndex);
      }
    })();

    this.generator.next();

    volumes.forEach((tick, index) => {
      const result = this.generator.next({
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

export function forceindex(input: ForceIndexInput): number[] {
    Indicator.reverseInputs(input);
    const result = new ForceIndex(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
  }
