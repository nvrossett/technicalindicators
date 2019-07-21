
import { ATR } from "../directionalmovement/ATR";
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { EMA } from "../moving_averages/EMA";
import { SMA } from "../moving_averages/SMA";

export class KeltnerChannelsInput extends IndicatorInput {
  public maPeriod: number = 20;
  public atrPeriod: number = 10;
  public useSMA: boolean = false;
  public multiplier: number = 1;
  public high: number[];
  public low: number[];
  public close: number[];
}

export class KeltnerChannelsOutput extends IndicatorInput {
  public middle: number;
  public upper: number;
  public lower: number;
}

export class KeltnerChannels extends Indicator {

  public static calculate = keltnerchannels;
  public result: KeltnerChannelsOutput[];
  public generator: IterableIterator<KeltnerChannelsOutput | undefined>;
  constructor(input: KeltnerChannelsInput) {
      super(input);
      const maType = input.useSMA ? SMA : EMA;
      const maProducer = new maType({period : input.maPeriod, values : [], format : (v) =>v});
      const atrProducer = new ATR({period : input.atrPeriod, high : [], low : [], close : [], format : (v) =>v});
      let tick;
      this.result = [];
      this.generator = (function*() {
        let result;
        tick = yield;
        while (true) {
          const { close } = tick;
          const ma = maProducer.nextValue(close);
          const atr = atrProducer.nextValue(tick);
          if (ma !== undefined && atr !== undefined) {
            result = {
              middle : ma,
              upper : ma + (input.multiplier * (atr)),
              lower : ma - (input.multiplier * (atr)),
            };
          }
          tick = yield result;
        }
      })();

      this.generator.next();

      const highs = input.high;

      highs.forEach((tickHigh, index) => {
        const tickInput = {
          high    : tickHigh,
          low     : input.low[index],
          close   : input.close[index],
        };
        const result = this.generator.next(tickInput);
        if (result.value !== undefined) {
          this.result.push(result.value);
        }
      });
  }

  public nextValue(price: KeltnerChannelsInput): KeltnerChannelsOutput | undefined {
     const result =  this.generator.next(price);
     if (result.value !== undefined) {
        return result.value;
      }
  }
}

export function keltnerchannels(input: KeltnerChannelsInput): KeltnerChannelsOutput[] {
      Indicator.reverseInputs(input);
      const result = new KeltnerChannels(input).result;
      if (input.reversedInput) {
          result.reverse();
      }
      Indicator.reverseInputs(input);
      return result;
  }
