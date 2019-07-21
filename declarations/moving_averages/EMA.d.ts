import { Indicator } from "../indicator/indicator";
import { MAInput } from "./SMA";
export declare class EMA extends Indicator {
    static calculate: typeof ema;
    period: number;
    price: number[];
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: MAInput);
    nextValue(price: number): number;
}
export declare function ema(input: MAInput): number[];
