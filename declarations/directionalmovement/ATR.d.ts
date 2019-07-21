import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class ATRInput extends IndicatorInput {
    low: number[];
    high: number[];
    close: number[];
    period: number;
}
export declare class ATR extends Indicator {
    static calculate: typeof atr;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: ATRInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function atr(input: ATRInput): number[];
