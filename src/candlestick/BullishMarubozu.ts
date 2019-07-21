import StockData from "../StockData";
import CandlestickFinder from "./CandlestickFinder";

export default class BullishMarubozu extends CandlestickFinder {
    constructor() {
        super();
        this.name = "BullishMarubozu";
        this.requiredCount  = 1;
    }
    public logic(data: StockData) {
        const daysOpen  = data.open[0];
        const daysClose = data.close[0];
        const daysHigh  = data.high[0];
        const daysLow   = data.low[0];

        const isBullishMarbozu =  this.approximateEqual(daysClose, daysHigh) &&
                                this.approximateEqual(daysLow, daysOpen) &&
                                daysOpen < daysClose &&
                                daysOpen < daysHigh;

        return (isBullishMarbozu);

    }
}

export function bullishmarubozu(data: StockData) {
  return new BullishMarubozu().hasPattern(data);
}
