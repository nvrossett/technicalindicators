import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class ForceIndexInput extends IndicatorInput {
    close: number[];
    volume: number[];
    period: number;
}
export declare class ForceIndex extends Indicator {
    static calculate: typeof forceindex;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: ForceIndexInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function forceindex(input: ForceIndexInput): number[];
