import { Indicator } from "../indicator/indicator";
import { MAInput } from "./SMA";
export declare class WEMA extends Indicator {
    static calculate: typeof wema;
    period: number | undefined;
    price: number[] | undefined;
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: MAInput);
    nextValue(price: number): number | undefined;
}
export declare function wema(input: MAInput): number[];
