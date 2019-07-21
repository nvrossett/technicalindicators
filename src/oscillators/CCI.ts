import { Indicator, IndicatorInput } from "../indicator/indicator";
import { SMA } from       "../moving_averages/SMA";
import { CandleData } from "../StockData";
import LinkedList from "../Utils/FixedSizeLinkedList";

export class CCIInput extends IndicatorInput {
  public high: number[];
  public low: number[];
  public close: number[];
  public period: number;
}

export class CCI extends Indicator {

  public static calculate = cci;
  public result: number[];
  public generator: IterableIterator<number | undefined>;
  constructor(input: CCIInput) {
    super(input);
    const lows = input.low;
    const highs = input.high;
    const closes = input.close;
    const period = input.period;
    const format = this.format;
    const constant = .015;
    const currentTpSet = new LinkedList(period);

    const tpSMACalculator  = new SMA({period, values: [], format : (v) =>v});

    if (!((lows.length === highs.length) && (highs.length === closes.length))) {
      throw new Error(("Inputs(low,high, close) not of equal size"));
    }

    this.result = [];

    this.generator = (function*() {
      let tick = yield;
      while (true) {
        const tp = (tick.high + tick.low + tick.close) / 3;
        currentTpSet.push(tp);
        const smaTp = tpSMACalculator.nextValue(tp);
        let meanDeviation: number = null;
        let cci: number;
        let sum = 0;
        if (smaTp !== undefined) {
          // First, subtract the most recent 20-period average of the typical price from each period's typical price.
          // Second, take the absolute values of these numbers.
          // Third,sum the absolute values.
          for (const x of currentTpSet.iterator()) {
            sum = sum + (Math.abs(x - smaTp));
          }
          // Fourth, divide by the total number of periods (20).
          meanDeviation = sum / period;
          cci = (tp  -  smaTp) / (constant * meanDeviation);
        }
        tick = yield cci;
      }
    })();

    this.generator.next();

    lows.forEach((tick, index) => {
      const result = this.generator.next({
        high : highs[index],
        low  : lows[index],
        close : closes[index],
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

export function cci(input: CCIInput): number[] {
    Indicator.reverseInputs(input);
    const result = new CCI(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
  }
