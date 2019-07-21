import { Indicator, IndicatorInput } from "../indicator/indicator";
import { LinkedList } from "../Utils/LinkedList";
import { MAInput } from "./SMA";

// STEP3. Add class based syntax with export
export class WilderSmoothing extends Indicator {

    public static calculate = wildersmoothing;
    public period: number;
    public price: number[];
    public result: number[];
    public generator: IterableIterator<number | undefined>;
    constructor(input: MAInput) {
        super(input);
        this.period  = input.period;
        this.price = input.values;
        const genFn = (function*(period: number): IterableIterator<number | undefined> {
            const list = new LinkedList();
            let sum = 0;
            let counter = 1;
            let current = yield;
            let result = 0;
            while (true) {
                if (counter < period) {
                    counter ++;
                    sum = sum + current;
                    result = undefined;
                } else if (counter === period) {
                    counter ++;
                    sum = sum + current;
                    result = sum;
                } else {
                    result = result - (result / period) + current;
                }
                current = yield result;
            }
        });
        this.generator = genFn(this.period);
        this.generator.next();
        this.result = [];
        this.price.forEach((tick) => {
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

export function wildersmoothing(input: MAInput): number[] {
    Indicator.reverseInputs(input);
    const result = new WilderSmoothing(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// STEP 6. Run the tests
