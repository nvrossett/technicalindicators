import { ATR } from "../directionalmovement/ATR";
import { Indicator, IndicatorInput } from "../indicator/indicator";
import LinkedList from "../Utils/FixedSizeLinkedList";
export class ChandelierExitInput extends IndicatorInput {
  public period: number = 22;
  public multiplier: number = 3;
  public high: number[];
  public low: number[];
  public close: number[];
}

export class ChandelierExitOutput extends IndicatorInput {
  public exitLong: number;
  public exitShort: number;
}

export class ChandelierExit extends Indicator {

  public static calculate = chandelierexit;
  public generator: IterableIterator<ChandelierExitOutput | undefined>;
  constructor(input: ChandelierExitInput) {
      super(input);
      const highs       = input.high;
      const lows        = input.low;
      const closes      = input.close;

      this.result = [];
      const atrProducer = new ATR({period : input.period, high : [], low : [], close : [], format : (v) =>v});
      const dataCollector = new LinkedList(input.period * 2, true, true, false);
      this.generator = (function*() {
        let result;
        let tick = yield;
        let atr;
        while (true) {
          const { high, low } = tick;
          dataCollector.push(high);
          dataCollector.push(low);
          atr = atrProducer.nextValue(tick);
          if ((dataCollector.totalPushed >= (2 * input.period)) &&  atr !== undefined) {
            result = {
              exitLong : dataCollector.periodHigh - atr * input.multiplier,
              exitShort : dataCollector.periodLow + atr * input.multiplier,
            };
          }
          tick = yield result;
        }
      })();

      this.generator.next();

      highs.forEach((tickHigh, index) => {
        const tickInput = {
          high    : tickHigh,
          low     : lows[index],
          close   : closes[index],
        };
        const result = this.generator.next(tickInput);
        if (result.value !== undefined) {
          this.result.push(result.value);
        }
      });
  }

  public nextValue(price: ChandelierExitInput): ChandelierExitOutput | undefined {
     const result =  this.generator.next(price);
     if (result.value !== undefined) {
        return result.value;
      }
  }
}

export function chandelierexit(input: ChandelierExitInput): number[] {
      Indicator.reverseInputs(input);
      const result = new ChandelierExit(input).result;
      if (input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
