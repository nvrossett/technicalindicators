import StockData from "../StockData";
import BullishEngulfingPattern from "./BullishEngulfingPattern";
import BullishHammerStick from "./BullishHammerStick";
import BullishHarami from "./BullishHarami";
import BullishHaramiCross from "./BullishHaramiCross";
import BullishInvertedHammerStick from "./BullishInvertedHammerStick";
import BullishMarubozu from "./BullishMarubozu";
import CandlestickFinder from "./CandlestickFinder";
import DownsideTasukiGap from "./DownsideTasukiGap";
import HammerPattern from "./HammerPattern";
import HammerPatternUnconfirmed from "./HammerPatternUnconfirmed";
import MorningDojiStar from "./MorningDojiStar";
import MorningStar from "./MorningStar";
import PiercingLine from "./PiercingLine";
import ThreeWhiteSoldiers from "./ThreeWhiteSoldiers";
import TweezerBottom from "./TweezerBottom";

const bullishPatterns = [
    new BullishEngulfingPattern(),
    new DownsideTasukiGap(),
    new BullishHarami(),
    new BullishHaramiCross(),
    new MorningDojiStar(),
    new MorningStar(),
    new BullishMarubozu(),
    new PiercingLine(),
    new ThreeWhiteSoldiers(),
    new BullishHammerStick(),
    new BullishInvertedHammerStick(),
    new HammerPattern(),
    new HammerPatternUnconfirmed(),
    new TweezerBottom(),
];

export default class BullishPatterns extends CandlestickFinder {
    constructor() {
        super();
        this.name = "Bullish Candlesticks";
    }

    public hasPattern(data: StockData) {
        return bullishPatterns.reduce(function(state, pattern) {
            const result = pattern.hasPattern(data);
            return state || result;
        }, false);
    }
}

export function bullish(data: StockData) {
  return new BullishPatterns().hasPattern(data);
}
