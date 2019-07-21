import { Indicator, IndicatorInput } from "../indicator/indicator";
import { SMA } from "../moving_averages/SMA";
import LinkedList from "../Utils/FixedSizeLinkedList";
/**
 * Created by AAravindan on 5/7/16.
 */
"use strict";

export class SDInput extends IndicatorInput {
  public period: number;
  public values: number[];
}

export class SD extends Indicator {

  public static calculate = sd;
  public generator: IterableIterator<number | undefined>;
  constructor(input: SDInput) {
    super(input);
    const period = input.period;
    const priceArray = input.values;

    const sma = new SMA({period, values : [], format : (v: number) =>v});

    this.result = [];

    this.generator = (function*() {
      let tick;
      let mean;
      const currentSet = new LinkedList(period);
      tick = yield;
      let sd;
      while (true) {
        currentSet.push(tick);
        mean = sma.nextValue(tick);
        if (mean) {
          let sum = 0;
          for (const x of currentSet.iterator()) {
            sum = sum + (Math.pow((x - mean), 2));
          }
          sd = Math.sqrt(sum / (period));
        }
        tick = yield sd;
      }
    })();

    this.generator.next();

    priceArray.forEach((tick) => {
      const result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(this.format(result.value));
      }
    });
  }

  public nextValue(price: number): number | undefined {
        const nextResult = this.generator.next(price);
        if (nextResult.value !== undefined) {
          return this.format(nextResult.value);
        }
    }
}

export function sd(input: SDInput): number[] {
       Indicator.reverseInputs(input);
       const result = new SD(input).result;
       if (input.reversedInput) {
            result.reverse();
        }
       Indicator.reverseInputs(input);
       return result;
    }
