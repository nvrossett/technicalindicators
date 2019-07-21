import { Indicator, IndicatorInput } from "../indicator/indicator";
/**
 * Created by AAravindan on 5/8/16.
 */
export declare class PDMInput extends IndicatorInput {
    low: number[];
    high: number[];
}
export declare class PDM extends Indicator {
    static calculate(input: PDMInput): number[];
    result: number[];
    generator: IterableIterator<number | undefined>;
    constructor(input: PDMInput);
    nextValue(price: number): number | undefined;
}
