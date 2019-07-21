import { Indicator, IndicatorInput } from "../indicator/indicator";
/**
 * Created by AAravindan on 5/10/16.
 */
"use strict";

import { SMA }  from "../moving_averages/SMA";
import LinkedList from "../Utils/FixedSizeLinkedList";

export class StochasticInput extends IndicatorInput {
  public period: number;
  public low: number[];
  public high: number[];
  public close: number[];
  public signalPeriod: number;
}

export class StochasticOutput {
  public k: number;
  public d: number;
}

export class Stochastic extends Indicator {

  public static calculate = stochastic;
  public result: StochasticOutput[];
  public generator: IterableIterator<StochasticOutput | undefined>;
  constructor(input: StochasticInput) {
    super(input);
    const lows = input.low;
    const highs = input.high;
    const closes = input.close;
    const period = input.period;
    const signalPeriod = input.signalPeriod;
    const format = this.format;
    if (!((lows.length === highs.length) && (highs.length === closes.length))) {
      throw new Error(("Inputs(low,high, close) not of equal size"));
    }
    this.result = [];
    // %K = (Current Close - Lowest Low)/(Highest High - Lowest Low) * 100
    // %D = 3-day SMA of %K
    //
    // Lowest Low = lowest low for the look-back period
    // Highest High = highest high for the look-back period
    // %K is multiplied by 100 to move the decimal point two places
    this.generator = (function*() {
      let index = 1;
      const pastHighPeriods = new LinkedList(period, true, false);
      const pastLowPeriods = new LinkedList(period, false, true);
      const dSma = new SMA({
        period : signalPeriod,
        values : [],
        format : (v) =>v,
      });
      let k, d;
      let tick = yield;
      while (true) {
        pastHighPeriods.push(tick.high);
        pastLowPeriods.push(tick.low);
        if (index < period) {
          index++;
          tick = yield;
          continue;
        }
        const periodLow = pastLowPeriods.periodLow;
        k = (tick.close - periodLow) / (pastHighPeriods.periodHigh - periodLow) * 100;
        k = isNaN(k) ? 0 : k; // This happens when the close, high and low are same for the entire period; Bug fix for
        d = dSma.nextValue(k);
        tick = yield {
          k : format(k),
          d : (d !== undefined) ? format(d) : undefined,
        };
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

  public nextValue(input: StochasticInput): StochasticOutput {
    const nextResult = this.generator.next(input);
    if (nextResult.value !== undefined) {
      return nextResult.value;
    }
  }
}

export function stochastic(input: StochasticInput): StochasticOutput[] {
        Indicator.reverseInputs(input);
        const result = new Stochastic(input).result;
        if (input.reversedInput) {
            result.reverse();
        }
        Indicator.reverseInputs(input);
        return result;
    }
