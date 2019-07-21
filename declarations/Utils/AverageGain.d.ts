import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class AvgGainInput extends IndicatorInput {
    period: number;
    values: number[];
}
export declare class AverageGain extends Indicator {
    static calculate: typeof averagegain;
    generator: IterableIterator<number | undefined>;
    constructor(input: AvgGainInput);
    nextValue(price: number): number | undefined;
}
export declare function averagegain(input: AvgGainInput): number[];
