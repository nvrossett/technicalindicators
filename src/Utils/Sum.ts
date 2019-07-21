
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
import FixedSizedLinkedList from "./FixedSizeLinkedList";

export class SumInput extends IndicatorInput {
  public values: number[];
  public period: number;
}

export class Sum extends Indicator {

  public static calculate = sum;
  public generator: IterableIterator<number | undefined>;
  constructor(input: SumInput) {
      super(input);
      const values     = input.values;
      const period     = input.period;

      this.result = [];

      const periodList = new FixedSizedLinkedList(period, false, false, true);

      this.generator = (function*() {
        let tick;
        let high;
        tick = yield;
        while (true) {
          periodList.push(tick);
          if (periodList.totalPushed >= period) {
            high = periodList.periodSum;
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

export function sum(input: SumInput): number[] {
      Indicator.reverseInputs(input);
      const result = new Sum(input).result;
      if (input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
