import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class MDMInput extends IndicatorInput {
    low: number[];
    high: number[];
}
export declare class MDM extends Indicator {
    static calculate(input: MDMInput): number[];
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: MDMInput);
    nextValue(price: number): number | undefined;
}
