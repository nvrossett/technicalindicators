import { Indicator, IndicatorInput } from "../indicator/indicator";
export declare class StochasticInput extends IndicatorInput {
    period: number;
    low: number[];
    high: number[];
    close: number[];
    signalPeriod: number;
}
export declare class StochasticOutput {
    k: number;
    d: number;
}
export declare class Stochastic extends Indicator {
    static calculate: typeof stochastic;
    result: StochasticOutput[];
    generator: IterableIterator<StochasticOutput | undefined>;
    constructor(input: StochasticInput);
    nextValue(input: StochasticInput): StochasticOutput;
}
export declare function stochastic(input: StochasticInput): StochasticOutput[];
