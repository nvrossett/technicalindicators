import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class TrueRangeInput extends IndicatorInput {
    low: number[];
    high: number[];
    close: number[];
}
export declare class TrueRange extends Indicator {
    static calculate: typeof truerange;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: TrueRangeInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function truerange(input: TrueRangeInput): number[];
