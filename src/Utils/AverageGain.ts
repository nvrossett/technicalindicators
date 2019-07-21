import { Indicator, IndicatorInput } from "../indicator/indicator";

export class AvgGainInput extends IndicatorInput {
  public period: number;
  public values: number[];
}

export class AverageGain extends Indicator {

  public static calculate = averagegain;
  public generator: IterableIterator<number | undefined>;
  constructor(input: AvgGainInput) {
    super(input);
    const values = input.values;
    const period = input.period;
    const format = this.format;

    this.generator = (function*(period) {
      let currentValue = yield;
      let counter = 1;
      let gainSum = 0;
      let avgGain;
      let gain;
      let lastValue = currentValue;
      currentValue = yield;
      while (true) {
        gain = currentValue - lastValue;
        gain = gain > 0 ? gain : 0;
        if (gain > 0) {
          gainSum = gainSum + gain;
        }
        if (counter < period) {
          counter++;
        } else if (avgGain === undefined) {
          avgGain = gainSum / period;
        } else {
          avgGain = ((avgGain * (period - 1)) + gain) / period;
        }
        lastValue = currentValue;
        avgGain = (avgGain !== undefined) ? format(avgGain) : undefined;
        currentValue = yield avgGain;
      }
    })(period);

    this.generator.next();

    this.result = [];

    values.forEach((tick: number) => {
      const result = this.generator.next(tick);
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  public nextValue(price: number): number | undefined {
        return this.generator.next(price).value;
    }
}

export function averagegain(input: AvgGainInput): number[] {
       Indicator.reverseInputs(input);
       const result = new AverageGain(input).result;
       if (input.reversedInput) {
            result.reverse();
        }
       Indicator.reverseInputs(input);
       return result;
    }
