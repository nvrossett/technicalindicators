import { Indicator, IndicatorInput } from "../indicator/indicator";
import LinkedList from "../Utils/FixedSizeLinkedList";

export class ROCInput extends IndicatorInput {
    public period: number;
    public values: number[];
}

export class ROC extends Indicator {

    public static calculate = roc;
    public result: number[];
    public generator: IterableIterator<number | undefined>;
    constructor(input: ROCInput) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        this.result = [];
        this.generator = (function*() {
            let index = 1;
            const pastPeriods = new LinkedList(period);
            let tick = yield;
            let roc;
            while (true) {
                pastPeriods.push(tick);
                if (index < period) {
                    index++;
                } else {
                    roc = ((tick - pastPeriods.lastShift) / (pastPeriods.lastShift)) * 100;
                }
                tick = yield roc;
            }
        })();

        this.generator.next();

        priceArray.forEach((tick) => {
            const result = this.generator.next(tick);
            if (result.value !== undefined && (!isNaN(result.value))) {
                this.result.push(this.format(result.value));
            }
        });
    }

    public nextValue(price: number): number | undefined {
        const nextResult = this.generator.next(price);
        if (nextResult.value !== undefined && (!isNaN(nextResult.value))) {
            return this.format(nextResult.value);
        }
    }

}

export function roc(input: ROCInput): number[] {
    Indicator.reverseInputs(input);
    const result = new ROC(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}
