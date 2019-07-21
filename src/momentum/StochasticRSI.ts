import { Indicator, IndicatorInput } from "../indicator/indicator";
/**
 * Created by AAravindan on 5/10/16.
 */
"use strict";

import { Stochastic } from "../momentum/Stochastic";
import { SMA }  from "../moving_averages/SMA";
import { RSI } from "../oscillators/RSI";
import LinkedList from "../Utils/FixedSizeLinkedList";

export class StochasticRsiInput extends IndicatorInput {
  public values: number[];
  public rsiPeriod: number;
  public stochasticPeriod: number;
  public kPeriod: number;
  public dPeriod: number;
}

export class StochasticRSIOutput {
  public stochRSI: number;
  public k: number;
  public d: number;
}

export class StochasticRSI extends Indicator {

  public static calculate = stochasticrsi;
  public result: StochasticRSIOutput[];
  public generator: IterableIterator<StochasticRSIOutput | undefined>;
  constructor(input: StochasticRsiInput) {
    super(input);
    const closes = input.values;
    const rsiPeriod = input.rsiPeriod;
    const stochasticPeriod = input.stochasticPeriod;
    const kPeriod = input.kPeriod;
    const dPeriod = input.dPeriod;
    const format = this.format;
    this.result = [];
    this.generator = (function*() {
      const index = 1;
      const rsi = new RSI({ period : rsiPeriod, values : []});
      const stochastic = new Stochastic({ period : stochasticPeriod, high : [], low: [], close: [], signalPeriod : kPeriod});
      const dSma = new SMA({
        period : dPeriod,
        values : [],
        format : (v) =>v,
      });
      let lastRSI, stochasticRSI, d, result;
      let tick = yield;
      while (true) {
        lastRSI = rsi.nextValue(tick);
        if (lastRSI !== undefined) {
          const stochasticInput  = { high : lastRSI, low : lastRSI, close: lastRSI } as any;
          stochasticRSI = stochastic.nextValue(stochasticInput);
          if (stochasticRSI !== undefined && stochasticRSI.d !== undefined) {
            d = dSma.nextValue(stochasticRSI.d);
            if (d !== undefined) {
              result =  {
                stochRSI : stochasticRSI.k,
                k: stochasticRSI.d,
                d,
              };
            }
          }
        }
        tick = yield result;
      }
    })();

    this.generator.next();

    closes.forEach((tick, index) => {
      const result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  public nextValue(input: StochasticRsiInput): StochasticRSIOutput {
    const nextResult = this.generator.next(input);
    if (nextResult.value !== undefined) {
      return nextResult.value;
    }
  }
}

export function stochasticrsi(input: StochasticRsiInput): StochasticRSIOutput[] {
    Indicator.reverseInputs(input);
    const result = new StochasticRSI(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}
