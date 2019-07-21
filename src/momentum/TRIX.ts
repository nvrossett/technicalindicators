/**
 * Created by AAravindan on 5/9/16.
 */
"use strict";

import { Indicator, IndicatorInput } from "../indicator/indicator";
import { EMA } from "../moving_averages/EMA.js";
import { ROC } from "./ROC.js";

export class TRIXInput extends IndicatorInput {
  public values: number[];
  public period: number;
}

export class TRIX extends Indicator {

  public static calculate = trix;
  public result: number[];
  public generator: IterableIterator<number | undefined>;
  constructor(input: TRIXInput) {
    super(input);
    const priceArray  = input.values;
    const period      = input.period;
    const format = this.format;

    const ema              = new EMA({ period, values : [], format : (v) =>v});
    const emaOfema         = new EMA({ period, values : [], format : (v) =>v});
    const emaOfemaOfema    = new EMA({ period, values : [], format : (v) =>v});
    const trixROC          = new ROC({ period : 1, values : [], format : (v) =>v});

    this.result = [];

    this.generator = (function*(): IterableIterator< number | undefined> {
      let tick = yield;
      while (true) {
        const initialema           = ema.nextValue(tick);
        const smoothedResult       = initialema ? emaOfema.nextValue(initialema) : undefined;
        const doubleSmoothedResult = smoothedResult ? emaOfemaOfema.nextValue(smoothedResult) : undefined;
        const result               = doubleSmoothedResult ? trixROC.nextValue(doubleSmoothedResult) : undefined;
        tick = yield result ? format(result) : undefined;
      }
    })();

    this.generator.next();

    priceArray.forEach((tick) => {
      const result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  public nextValue(price: number) {
      const nextResult = this.generator.next(price);
      if (nextResult.value !== undefined) {
        return nextResult.value;
      }
    }
}

export function trix(input: TRIXInput): number[] {
    Indicator.reverseInputs(input);
    const result = new TRIX(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}
