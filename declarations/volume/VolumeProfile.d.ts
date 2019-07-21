import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData } from "../StockData";
export declare class VolumeProfileInput extends IndicatorInput {
    high: number[];
    open: number[];
    low: number[];
    close: number[];
    volume: number[];
    noOfBars: number;
}
export declare class VolumeProfileOutput {
    rangeStart: number;
    rangeEnd: number;
    bullishVolume: number;
    bearishVolume: number;
}
export declare function priceFallsBetweenBarRange(low: any, high: any, low1: any, high1: any): boolean;
export declare class VolumeProfile extends Indicator {
    static calculate: typeof volumeprofile;
    generator: IterableIterator<number | undefined>;
    constructor(input: VolumeProfileInput);
    nextValue(price: CandleData): number | undefined;
}
export declare function volumeprofile(input: VolumeProfileInput): number[];
