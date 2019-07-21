
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
import FixedSizedLinkedList from "./FixedSizeLinkedList";

export class LowestInput extends IndicatorInput {
  public values: number[];
  public period: number;
}

export class Lowest extends Indicator {

  public static calculate = lowest;
  public generator: IterableIterator<number | undefined>;
  constructor(input: LowestInput) {
      super(input);
      const values     = input.values;
      const period     = input.period;

      this.result = [];

      const periodList = new FixedSizedLinkedList(period, false, true, false);

      this.generator = (function*() {
        let tick;
        let high;
        tick = yield;
        while (true) {
          periodList.push(tick);
          if (periodList.totalPushed >= period) {
            high = periodList.periodLow;
          }
          tick = yield high;
        }
      })();

      this.generator.next();

      values.forEach((value, index) => {
        const result = this.generator.next(value);
        if (result.value !== undefined) {
          this.result.push(result.value);
        }
      });
  }

  public nextValue(price: number): number | undefined {
     const result =  this.generator.next(price);
     if (result.value !== undefined) {
        return result.value;
      }
  }
}

export function lowest(input: LowestInput): number[] {
      Indicator.reverseInputs(input);
      const result = new Lowest(input).result;
      if (input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
