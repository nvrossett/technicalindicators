import { Indicator } from "../indicator/indicator";
import { MAInput } from "./SMA";
export declare class WMA extends Indicator {
    static calculate: typeof wma;
    period: number;
    price: number[];
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: MAInput);
    nextValue(price: number): number | undefined;
}
export declare function wma(input: MAInput): number[];
