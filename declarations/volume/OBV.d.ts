import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class OBVInput extends IndicatorInput {
    close: number[];
    volume: number[];
}
export declare class OBV extends Indicator {
    static calculate: typeof obv;
    generator: IterableIterator<number | undefined>;
    constructor(input: OBVInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function obv(input: OBVInput): number[];
