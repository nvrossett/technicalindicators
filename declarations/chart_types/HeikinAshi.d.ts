/**
 * Created by AAravindan on 5/4/16.
 */
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData, CandleList } from "../StockData";
export declare class HeikinAshiInput extends IndicatorInput {
    low?: number[];
    open?: number[];
    volume?: number[];
    high?: number[];
    close?: number[];
    timestamp?: number[];
}
export declare class HeikinAshi extends Indicator {
    static calculate: typeof heikinashi;
    result: CandleList;
    generator: IterableIterator<CandleData | undefined>;
    constructor(input: HeikinAshiInput);
    nextValue(price: CandleData): CandleData | undefined;
}
export declare function heikinashi(input: HeikinAshiInput): CandleList;
