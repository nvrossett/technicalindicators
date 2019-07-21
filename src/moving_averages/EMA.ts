import { Indicator, IndicatorInput } from "../indicator/indicator";
import { LinkedList } from "../Utils/LinkedList";
import { MAInput, SMA } from "./SMA";

export class EMA extends Indicator {

    public static calculate = ema;
    public period: number;
    public price: number[];
    public result: number[];
    public generator: IterableIterator<number | undefined>;
    constructor(input: MAInput) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        const exponent = (2 / (period + 1));
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
                    if (prevEma) {
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

    public nextValue(price: number) {
        const result = this.generator.next(price).value;
        if (result !== undefined) {
            return this.format(result);
        }
    }
}

export function ema(input: MAInput): number[] {
        Indicator.reverseInputs(input);
        const result = new EMA(input).result;
        if (input.reversedInput) {
            result.reverse();
        }
        Indicator.reverseInputs(input);
        return result;
    }
