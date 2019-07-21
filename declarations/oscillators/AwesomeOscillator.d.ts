import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class AwesomeOscillatorInput extends IndicatorInput {
    high: number[];
    low: number[];
    fastPeriod: number;
    slowPeriod: number;
}
export declare class AwesomeOscillator extends Indicator {
    static calculate: typeof awesomeoscillator;
    generator: IterableIterator<number | undefined>;
    constructor(input: AwesomeOscillatorInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function awesomeoscillator(input: AwesomeOscillatorInput): number[];
