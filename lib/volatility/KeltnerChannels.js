import { ATR } from "../directionalmovement/ATR";
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { EMA } from "../moving_averages/EMA";
import { SMA } from "../moving_averages/SMA";
export class KeltnerChannelsInput extends IndicatorInput {
    constructor() {
        super(...arguments);
        this.maPeriod = 20;
        this.atrPeriod = 10;
        this.useSMA = false;
        this.multiplier = 1;
    }
}
export class KeltnerChannelsOutput extends IndicatorInput {
}
export class KeltnerChannels extends Indicator {
    constructor(input) {
        super(input);
        const maType = input.useSMA ? SMA : EMA;
        const maProducer = new maType({ period: input.maPeriod, values: [], format: (v) => v });
        const atrProducer = new ATR({ period: input.atrPeriod, high: [], low: [], close: [], format: (v) => v });
        let tick;
        this.result = [];
        this.generator = (function* () {
            let result;
            tick = yield;
            while (true) {
                const { close } = tick;
                const ma = maProducer.nextValue(close);
                const atr = atrProducer.nextValue(tick);
                if (ma !== undefined && atr !== undefined) {
                    result = {
                        middle: ma,
                        upper: ma + (input.multiplier * (atr)),
                        lower: ma - (input.multiplier * (atr)),
                    };
                }
                tick = yield result;
            }
        })();
        this.generator.next();
        const highs = input.high;
        highs.forEach((tickHigh, index) => {
            const tickInput = {
                high: tickHigh,
                low: input.low[index],
                close: input.close[index],
            };
            const result = this.generator.next(tickInput);
            if (result.value !== undefined) {
                this.result.push(result.value);
            }
        });
    }
    nextValue(price) {
        const result = this.generator.next(price);
        if (result.value !== undefined) {
            return result.value;
        }
    }
}
KeltnerChannels.calculate = keltnerchannels;
export function keltnerchannels(input) {
    Indicator.reverseInputs(input);
    const result = new KeltnerChannels(input).result;
    if (input.reversedInput) {
        result.reverse();
    }
    Indicator.reverseInputs(input);
    return result;
}
