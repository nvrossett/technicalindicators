import StockData from "../StockData";
import CandlestickFinder from "./CandlestickFinder";

export default class Doji extends CandlestickFinder {
    constructor() {
        super();
        this.name = "Doji";
        this.requiredCount  = 1;
    }
    public logic(data: StockData): boolean {
        const daysOpen = data.open[0];
        const daysClose = data.close[0];
        const daysHigh = data.high[0];
        const daysLow = data.low[0];
        const isOpenEqualsClose = this.approximateEqual(daysOpen, daysClose);
        const isHighEqualsOpen = isOpenEqualsClose && this.approximateEqual(daysOpen, daysHigh);
        const isLowEqualsClose = isOpenEqualsClose && this.approximateEqual(daysClose, daysLow);
        return (isOpenEqualsClose && isHighEqualsOpen === isLowEqualsClose);
    }
}

export function doji(data: StockData) {
  return new Doji().hasPattern(data);
}
