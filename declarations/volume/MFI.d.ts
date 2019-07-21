import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class MFIInput extends IndicatorInput {
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
    period: number;
}
export declare class MFI extends Indicator {
    static calculate: typeof mfi;
    generator: IterableIterator<number | undefined>;
    constructor(input: MFIInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function mfi(input: MFIInput): number[];
