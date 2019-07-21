// STEP 1. Import Necessary indicator or rather last step
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { LinkedList } from "../Utils/LinkedList";

// STEP 2. Create the input for the indicator, mandatory should be in the constructor
export class MAInput extends IndicatorInput {
    constructor(public period: number,
                public values: number[]) {
        super();
    }
}

// STEP3. Add class based syntax with export
export class SMA extends Indicator {

    public static calculate = sma;
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
            let result;
            list.push(0);
            while (true) {
                if (counter < period) {
                    counter ++;
                    list.push(current);
                    sum = sum + current;
                } else {
                    sum = sum - list.shift() + current;
                    result = ((sum) / period);
                    list.push(current);
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

export function sma(input: MAInput): number[] {
    Indicator.reverseInputs(input);
    const result = new SMA(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}

// STEP 6. Run the tests
