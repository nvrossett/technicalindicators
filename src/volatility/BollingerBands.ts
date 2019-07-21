"use strict";
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { SMA } from "../moving_averages/SMA";
import { SD } from "../Utils/SD";
export class BollingerBandsInput extends IndicatorInput {
    public period: number;
    public stdDev: number;
    public values: number[];
}

export class BollingerBandsOutput extends IndicatorInput {
    public middle: number;
    public upper: number;
    public lower: number;
    public pb: number;
}

export class BollingerBands extends Indicator {

    public static calculate = bollingerbands;
    public generator: IterableIterator<BollingerBandsOutput | undefined>;
    constructor(input: BollingerBandsInput) {
        super(input);
        const period = input.period;
        const priceArray = input.values;
        const stdDev     = input.stdDev;
        const format     = this.format;

        let sma, sd;

        this.result = [];

        sma = new SMA({period, values : [], format : (v) =>v});
        sd  = new SD({period, values : [], format : (v) =>v});

        this.generator = (function*() {
            let result;
            let tick;
            let calcSMA;
            let calcsd;
            tick = yield;
            while (true) {
                calcSMA = sma.nextValue(tick);
                calcsd  = sd.nextValue(tick);
                if (calcSMA) {
                    const middle = format(calcSMA);
                    const upper = format(calcSMA + (calcsd * stdDev));
                    const lower = format(calcSMA - (calcsd * stdDev));
                    const pb: number = format((tick - lower) / (upper - lower));
                    result = {
                        middle,
                        upper,
                        lower,
                        pb,
                    };
                }
                tick = yield result;
            }
        })();

        this.generator.next();

        priceArray.forEach((tick) => {
            const result = this.generator.next(tick);
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }

    public nextValue(price: number): BollingerBandsOutput | undefined {
        return this.generator.next(price).value;
    }
}

export function bollingerbands(input: BollingerBandsInput): BollingerBandsOutput[] {
       Indicator.reverseInputs(input);
       const result = new BollingerBands(input).result;
       if (input.reversedInput) {
            result.reverse();
        }
       Indicator.reverseInputs(input);
       return result;
    }
