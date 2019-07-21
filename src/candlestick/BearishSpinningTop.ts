import StockData from "../StockData";
import CandlestickFinder from "./CandlestickFinder";

export default class BearishSpinningTop extends CandlestickFinder {
    constructor() {
        super();
        this.name = "BearishSpinningTop";
        this.requiredCount  = 1;
    }
    public logic(data: StockData) {
        const daysOpen  = data.open[0];
        const daysClose = data.close[0];
        const daysHigh  = data.high[0];
        const daysLow   = data.low[0];

        const bodyLength           = Math.abs(daysClose - daysOpen);
        const upperShadowLength    = Math.abs(daysHigh - daysOpen);
        const lowerShadowLength    = Math.abs(daysHigh - daysLow);
        const isBearishSpinningTop = bodyLength < upperShadowLength &&
                                 bodyLength < lowerShadowLength;

        return isBearishSpinningTop;
    }
}

export function bearishspinningtop(data: StockData) {
  return new BearishSpinningTop().hasPattern(data);
}
