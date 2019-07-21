/**
 * Created by AAravindan on 5/5/16.
 */
import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class RSIInput extends IndicatorInput {
    period: number;
    values: number[];
}
export declare class RSI extends Indicator {
    static calculate: typeof rsi;
    generator: IterableIterator<number | undefined>;
    constructor(input: RSIInput);
    nextValue(price: number): number | undefined;
}
export declare function rsi(input: RSIInput): number[];
