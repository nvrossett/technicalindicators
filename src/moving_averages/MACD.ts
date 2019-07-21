/**
 * Created by AAravindan on 5/4/16.
 */
import { Indicator, IndicatorInput } from "../indicator/indicator";
import { EMA } from "./EMA";
import { SMA } from "./SMA";

export class MACDInput extends IndicatorInput {
    public SimpleMAOscillator: boolean = true;
    public SimpleMASignal: boolean = true;
    public fastPeriod: number;
    public slowPeriod: number;
    public signalPeriod: number;
    constructor(public values: number[]) {
        super();
    }
}

export class MACDOutput {
    public MACD?: number;
    public signal?: number;
    public histogram?: number;
}

export class MACD extends Indicator {

    public static calculate = macd;
    public result: MACDOutput[];
    public generator: IterableIterator<MACDOutput | undefined>;
    constructor(input: MACDInput) {
      super(input);
      const oscillatorMAtype = input.SimpleMAOscillator ? SMA : EMA;
      const signalMAtype   = input.SimpleMASignal ? SMA : EMA;
      const fastMAProducer = new oscillatorMAtype({period : input.fastPeriod, values : [], format : (v) => v});
      const slowMAProducer = new oscillatorMAtype({period : input.slowPeriod, values : [], format : (v) => v});
      const signalMAProducer = new signalMAtype({period : input.signalPeriod, values : [], format : (v) => v});
      const format = this.format;
      this.result = [];

      this.generator = (function*() {
        let index = 0;
        let tick;
        let MACD: number | undefined, signal: number | undefined, histogram: number | undefined, fast: number | undefined, slow: number | undefined;
        while (true) {
          if (index < input.slowPeriod) {
            tick = yield;
            fast = fastMAProducer.nextValue(tick);
            slow = slowMAProducer.nextValue(tick);
            index++;
            continue;
          }
          if (fast && slow) { // Just for typescript to be happy
            MACD = fast - slow;
            signal = signalMAProducer.nextValue(MACD);
          }
          histogram = MACD - signal;
          tick = yield({
            // fast : fast,
            // slow : slow,
            MACD : format(MACD),
            signal : signal ? format(signal) : undefined,
            histogram : isNaN(histogram) ? undefined : format(histogram),
          });
          fast = fastMAProducer.nextValue(tick);
          slow = slowMAProducer.nextValue(tick);
        }
      })();

      this.generator.next();

      input.values.forEach((tick) => {
        const result = this.generator.next(tick);
        if (result.value !== undefined) {
          this.result.push(result.value);
        }
      });
    }

    public nextValue(price: number): MACDOutput | undefined {
        const result = this.generator.next(price).value;
        return result;
    }
}

export function macd(input: MACDInput): MACDOutput[] {
       Indicator.reverseInputs(input);
       const result = new MACD(input).result;
       if (input.reversedInput) {
            result.reverse();
        }
       Indicator.reverseInputs(input);
       return result;
    }
