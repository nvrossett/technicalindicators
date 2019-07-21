import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class CCIInput extends IndicatorInput {
    high: number[];
    low: number[];
    close: number[];
    period: number;
}
export declare class CCI extends Indicator {
    static calculate: typeof cci;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: CCIInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function cci(input: CCIInput): number[];
