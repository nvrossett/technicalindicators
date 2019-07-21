import BearishEngulfingPattern from "./BearishEngulfingPattern";
import BearishHammerStick from "./BearishHammerStick";
import BearishHarami from "./BearishHarami";
import BearishHaramiCross from "./BearishHaramiCross";
import BearishInvertedHammerStick from "./BearishInvertedHammerStick";
import BearishMarubozu from "./BearishMarubozu";
import CandlestickFinder from "./CandlestickFinder";
import EveningDojiStar from "./EveningDojiStar";
import EveningStar from "./EveningStar";
import HangingMan from "./HangingMan";
import HangingManUnconfirmed from "./HangingManUnconfirmed";
import ShootingStar from "./ShootingStar";
import ShootingStarUnconfirmed from "./ShootingStarUnconfirmed";
import ThreeBlackCrows from "./ThreeBlackCrows";
import TweezerTop from "./TweezerTop";
const bearishPatterns = [
    new BearishEngulfingPattern(),
    new BearishHarami(),
    new BearishHaramiCross(),
    new EveningDojiStar(),
    new EveningStar(),
    new BearishMarubozu(),
    new ThreeBlackCrows(),
    new BearishHammerStick(),
    new BearishInvertedHammerStick(),
    new HangingMan(),
    new HangingManUnconfirmed(),
    new ShootingStar(),
    new ShootingStarUnconfirmed(),
    new TweezerTop(),
];
export default class BearishPatterns extends CandlestickFinder {
    constructor() {
        super();
        this.name = "Bearish Candlesticks";
    }
    hasPattern(data) {
        return bearishPatterns.reduce(function (state, pattern) {
            return state || pattern.hasPattern(data);
        }, false);
    }
}
export function bearish(data) {
    return new BearishPatterns().hasPattern(data);
}
