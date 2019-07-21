import StockData from "../StockData";
import { averagegain } from "../Utils/AverageGain";
import { averageloss } from "../Utils/AverageLoss";
import { bearishhammerstick } from "./BearishHammerStick";
import { bearishinvertedhammerstick } from "./BearishInvertedHammerStick";
import { bullishhammerstick } from "./BullishHammerStick";
import { bullishinvertedhammerstick } from "./BullishInvertedHammerStick";
import CandlestickFinder from "./CandlestickFinder";

export default class HammerPattern extends CandlestickFinder {
    constructor() {
        super();
        this.name = "HammerPattern";
        this.requiredCount = 5;
    }

    public logic(data: StockData) {
        let isPattern = this.downwardTrend(data);
        isPattern = isPattern && this.includesHammer(data);
        isPattern = isPattern && this.hasConfirmation(data);
        return isPattern;
    }

    public downwardTrend(data: StockData, confirm = true) {
        const end = confirm ? 3 : 4;
        // Analyze trends in closing prices of the first three or four candlesticks
        const gains = averagegain({ values: data.close.slice(0, end), period: end - 1 });
        const losses = averageloss({ values: data.close.slice(0, end), period: end - 1 });
        // Downward trend, so more losses than gains
        return losses > gains;
    }

    public includesHammer(data: StockData, confirm = true) {
        const start = confirm ? 3 : 4;
        const end = confirm ? 4 : undefined;
        const possibleHammerData = {
            open: data.open.slice(start, end),
            close: data.close.slice(start, end),
            low: data.low.slice(start, end),
            high: data.high.slice(start, end),
        };

        let isPattern = bearishhammerstick(possibleHammerData);
        isPattern = isPattern || bearishinvertedhammerstick(possibleHammerData);
        isPattern = isPattern || bullishhammerstick(possibleHammerData);
        isPattern = isPattern || bullishinvertedhammerstick(possibleHammerData);

        return isPattern;
    }

    public hasConfirmation(data: StockData) {
        const possibleHammer = {
            open: data.open[3],
            close: data.close[3],
            low: data.low[3],
            high: data.high[3],
        };
        const possibleConfirmation = {
            open: data.open[4],
            close: data.close[4],
            low: data.low[4],
            high: data.high[4],
        };
        // Confirmation candlestick is bullish
        const isPattern = possibleConfirmation.open < possibleConfirmation.close;
        return isPattern && possibleHammer.close < possibleConfirmation.close;
    }
}

export function hammerpattern(data: StockData) {
  return new HammerPattern().hasPattern(data);
}
