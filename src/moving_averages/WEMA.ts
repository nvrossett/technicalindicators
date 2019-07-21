import { Indicator, IndicatorInput } from "../indicator/indicator";
import { LinkedList } from "../Utils/LinkedList";
import { MAInput, SMA } from "./SMA";

export class WEMA extends Indicator {

    public static calculate = wema;
    public period: number | undefined;
    public price: number[] | undefined;
    public result: number[];
    public generator: IterableIterator<number | undefined>;
    constructor(input: MAInput) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        const exponent = 1 / period;
        let sma: SMA;

        this.result = [];

        sma = new SMA({period, values : []});

        const genFn = (function*(): IterableIterator<number | undefined> {
            let tick  = yield;
            let prevEma;
            while (true) {
                if (prevEma !== undefined && tick !== undefined) {
                    prevEma = ((tick - prevEma) * exponent) + prevEma;
                    tick = yield prevEma;
                } else {
                    tick = yield;
                    prevEma = sma.nextValue(tick);
                    if (prevEma !== undefined) {
                        tick = yield prevEma;
                    }
                }
            }
        });

        this.generator = genFn();

        this.generator.next();
        this.generator.next();

        priceArray.forEach((tick) => {
            const result = this.generator.next(tick);
            if (result.value !== undefined) {
                this.result.push(this.format(result.value));
            }
        });
    }

    public nextValue(price: number): number | undefined {
        const result = this.generator.next(price).value;
        if (result !== undefined) {
            return this.format(result);
        }
    }
}

export function wema(input: MAInput): number[] {
      Indicator.reverseInputs(input);
      const result = new WEMA(input).result;
      if (input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
