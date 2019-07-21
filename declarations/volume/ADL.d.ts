/**
 * Created by AAravindan on 5/17/16.
 */
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class ADLInput extends IndicatorInput {
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
}
export declare class ADL extends Indicator {
    static calculate: typeof adl;
    generator: IterableIterator<number | undefined>;
    constructor(input: ADLInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function adl(input: ADLInput): number[];
