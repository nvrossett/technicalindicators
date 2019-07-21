import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class VWAPInput extends IndicatorInput {
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
}
export declare class VWAP extends Indicator {
    static calculate: typeof vwap;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: VWAPInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function vwap(input: VWAPInput): number[];
