import StockData from "../StockData";
import { averagegain } from "../Utils/AverageGain";
import { averageloss } from "../Utils/AverageLoss";
import CandlestickFinder from "./CandlestickFinder";

export default class TweezerTop extends CandlestickFinder {
    constructor() {
        super();
        this.name = "TweezerTop";
        this.requiredCount = 5;
    }

    public logic(data: StockData) {
        return this.upwardTrend(data) && data.high[3] === data.high[4];
    }

    public upwardTrend(data: StockData) {
        // Analyze trends in closing prices of the first three or four candlesticks
        const gains = averagegain({ values: data.close.slice(0, 3), period: 2 });
        const losses = averageloss({ values: data.close.slice(0, 3), period: 2 });
        // Upward trend, so more gains than losses
        return gains > losses;
    }
}

export function tweezertop(data: StockData) {
  return new TweezerTop().hasPattern(data);
}
