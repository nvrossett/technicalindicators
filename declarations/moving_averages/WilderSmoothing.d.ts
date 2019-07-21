import { Indicator } from "../indicator/indicator";
import { MAInput } from "./SMA";
export declare class WilderSmoothing extends Indicator {
    static calculate: typeof wildersmoothing;
    period: number;
    price: number[];
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: MAInput);
    nextValue(price: number): number | undefined;
}
export declare function wildersmoothing(input: MAInput): number[];
