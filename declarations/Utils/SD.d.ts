import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class SDInput extends IndicatorInput {
    period: number;
    values: number[];
}
export declare class SD extends Indicator {
    static calculate: typeof sd;
    generator: IterableIterator<number | undefined>;
    constructor(input: SDInput);
    nextValue(price: number): number | undefined;
}
export declare function sd(input: SDInput): number[];
