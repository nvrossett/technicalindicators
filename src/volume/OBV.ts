import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
/**
 * Created by AAravindan on 5/17/16.
 */
"use strict";
export class OBVInput extends IndicatorInput {
  public close: number[];
  public volume: number[];
}

export class OBV extends Indicator {

  public static calculate = obv;
  public generator: IterableIterator<number | undefined>;
  constructor(input: OBVInput) {
    super(input);
    const closes      = input.close;
    const volumes     = input.volume;

    this.result = [];

    this.generator = (function*() {
      let result = 0;
      let tick;
      let lastClose;
      tick = yield;
      if (tick.close && (typeof tick.close === "number")) {
        lastClose = tick.close;
        tick = yield;
      }
      while (true) {
        if (lastClose < tick.close) {
          result = result + tick.volume;
        } else if (tick.close < lastClose) {
          result = result - tick.volume;
        }
        lastClose = tick.close;
        tick = yield result;
      }
    })();

    this.generator.next();

    closes.forEach((close, index) => {
      const tickInput = {
        close   : closes[index],
        volume  : volumes[index],
      };
      const result = this.generator.next(tickInput);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  public nextValue(price: CandleData): number | undefined {
     return this.generator.next(price).value;
  }

}

export function obv(input: OBVInput): number[] {
      Indicator.reverseInputs(input);
      const result = new OBV(input).result;
      if (input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
