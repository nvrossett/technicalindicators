/**
 * Created by AAravindan on 5/4/16.
 */
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { CandleData, CandleList } from "../StockData";

export class HeikinAshiInput extends IndicatorInput {
    public low?: number[];
    public open?: number[];
    public volume?: number[];
    public high?: number[];
    public close?: number[];
    public timestamp?: number[];
}

export class HeikinAshi extends Indicator {

    public static calculate = heikinashi;
    public result: CandleList;
    public generator: IterableIterator<CandleData | undefined>;
    constructor(input: HeikinAshiInput) {
      super(input);
      const format = this.format;
      this.result = new CandleList();

      let lastOpen: number = null;
      let lastHigh = 0;
      let lastLow = Infinity;
      let lastClose = 0;
      let lastVolume = 0;
      let lastTimestamp = 0;

      this.generator = (function*() {
          let candleData = yield;
          let calculated = null;
          while (true) {
            if (lastOpen === null) {
                lastOpen = (candleData.close + candleData.open) / 2 ;
                lastHigh = candleData.high;
                lastLow = candleData.low;
                lastClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
                lastVolume = (candleData.volume || 0);
                lastTimestamp = (candleData.timestamp || 0);
                calculated = {
                    open : lastOpen,
                    high : lastHigh,
                    low : lastLow,
                    close : lastClose,
                    volume : candleData.volume || 0,
                    timestamp : (candleData.timestamp || 0),
                } as CandleData;
            } else {
                const newClose = (candleData.close + candleData.open + candleData.high + candleData.low) / 4;
                const newOpen = (lastOpen + lastClose) / 2;
                const newHigh = Math.max(newOpen, newClose, candleData.high);
                const newLow = Math.min(candleData.low, newOpen, newClose);
                calculated = {
                    close : newClose,
                    open : newOpen,
                    high : newHigh,
                    low : newLow,
                    volume : (candleData.volume || 0),
                    timestamp : (candleData.timestamp || 0),
                } as any;
                lastClose = newClose;
                lastOpen = newOpen;
                lastHigh = newHigh;
                lastLow = newLow;
            }
            candleData = yield calculated;
          }
      })();

      this.generator.next();
      input.low.forEach((tick, index) => {
            const result = this.generator.next({
                open : input.open[index],
                high : input.high[index],
                low : input.low[index],
                close : input.close[index],
                volume : input.volume ? input.volume[index] : input.volume,
                timestamp : input.timestamp ? input.timestamp[index] : input.timestamp,
            });
            if (result.value) {
                this.result.open.push(result.value.open);
                this.result.high.push(result.value.high);
                this.result.low.push(result.value.low);
                this.result.close.push(result.value.close);
                this.result.volume.push(result.value.volume);
                this.result.timestamp.push(result.value.timestamp);
            }
      });
    }

    public nextValue(price: CandleData): CandleData | undefined {
        const result = this.generator.next(price).value;
        return result;
    }
}

export function heikinashi(input: HeikinAshiInput): CandleList {
       Indicator.reverseInputs(input);
       const result = new HeikinAshi(input).result;
       if (input.reversedInput) {
            result.open.reverse();
            result.high.reverse();
            result.low.reverse();
            result.close.reverse();
            result.volume.reverse();
            result.timestamp.reverse();
        }
       Indicator.reverseInputs(input);
       return result;
    }
