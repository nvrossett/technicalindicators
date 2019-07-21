import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class TRIXInput extends IndicatorInput {
    values: number[];
    period: number;
}
export declare class TRIX extends Indicator {
    static calculate: typeof trix;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: TRIXInput);
    nextValue(price: number): number;
}
export declare function trix(input: TRIXInput): number[];
