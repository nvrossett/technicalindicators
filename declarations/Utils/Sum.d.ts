import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class SumInput extends IndicatorInput {
    values: number[];
    period: number;
}
export declare class Sum extends Indicator {
    static calculate: typeof sum;
    generator: IterableIterator<number | undefined>;
    constructor(input: SumInput);
    nextValue(price: number): number | undefined;
}
export declare function sum(input: SumInput): number[];
