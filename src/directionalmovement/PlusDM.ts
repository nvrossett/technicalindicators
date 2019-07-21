import { Indicator, IndicatorInput } from "../indicator/indicator";
/**
 * Created by AAravindan on 5/8/16.
 */
export class PDMInput extends IndicatorInput {
  public low: number[];
  public high: number[];
}

export class PDM extends Indicator {

  public static calculate(input: PDMInput): number[] {
       Indicator.reverseInputs(input);
       const result = new PDM(input).result;
       if (input.reversedInput) {
            result.reverse();
        }
       Indicator.reverseInputs(input);
       return result;
    }
  public result: number[];
  public generator: IterableIterator<number | undefined>;
  constructor(input: PDMInput) {
    super(input);
    const lows = input.low;
    const highs = input.high;
    const format = this.format;

    if (lows.length !== highs.length) {
      throw new Error(("Inputs(low,high) not of equal size"));
    }

    this.result = [];

    this.generator = (function*() {
      let plusDm;
      let current = yield;
      let last;
      while (true) {
        if (last) {
          const upMove = (current.high  - last.high);
          const downMove = (last.low - current.low);
          plusDm = format((upMove > downMove && upMove > 0) ? upMove : 0);
        }
        last = current;
        current = yield plusDm;
      }
    })();

    this.generator.next();

    lows.forEach((tick, index) => {
      const result = this.generator.next({
        high : highs[index],
        low  : lows[index],
      });
      if (result.value !== undefined) {
        this.result.push(result.value);
      }
    });
  }

  public nextValue(price: number): number | undefined {
        return this.generator.next(price).value;
    }

}
