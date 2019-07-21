import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class WilliamsRInput extends IndicatorInput {
    low: number[];
    high: number[];
    close: number[];
    period: number;
}
export declare class WilliamsR extends Indicator {
    static calculate: typeof williamsr;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: WilliamsRInput);
    nextValue(price: number): number | undefined;
}
export declare function williamsr(input: WilliamsRInput): number[];
