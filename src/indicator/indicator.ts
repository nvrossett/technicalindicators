import { format as nf } from "../Utils/NumberFormatter";

export class IndicatorInput {
    public reversedInput?: boolean;
    public format?: (data: number) => number;
}

export class AllInputs {
    public values?: number[];
    public open?: number[];
    public high?: number[];
    public low?: number[];
    public close?: number[];
    public volume?: number[];
    public timestamp?: number[];
}

export class Indicator {
    public static reverseInputs(input: any): void {
        if (input.reversedInput) {
            input.values ? input.values.reverse() : undefined;
            input.open ? input.open.reverse() : undefined;
            input.high ? input.high.reverse() : undefined;
            input.low ? input.low.reverse() : undefined;
            input.close ? input.close.reverse() : undefined;
            input.volume ? input.volume.reverse() : undefined;
            input.timestamp ? input.timestamp.reverse() : undefined;
        }
    }
    public result: any;
    public format: (data: number) => number;
    constructor(input: IndicatorInput) {
        this.format = input.format || nf;
    }

    public getResult() {
        return this.result;
    }
}
