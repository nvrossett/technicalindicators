import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class ROCInput extends IndicatorInput {
    period: number;
    values: number[];
}
export declare class ROC extends Indicator {
    static calculate: typeof roc;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: ROCInput);
    nextValue(price: number): number | undefined;
}
export declare function roc(input: ROCInput): number[];
