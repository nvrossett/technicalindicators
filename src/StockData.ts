export default class StockData {
    public reversedInput?: boolean;
    constructor(public open: number[], public high: number[], public low: number[], public close: number[], reversedInput: boolean) {
        this.reversedInput = reversedInput;
    }
}

export class CandleData {
    public open?: number;
    public high?: number;
    public low?: number;
    public close?: number;
    public timestamp?: number;
    public volume?: number;
}

export class CandleList {
    public open?: number[] = [];
    public high?: number[] = [];
    public low?: number[] = [];
    public close?: number[] = [];
    public volume?: number[] = [];
    public timestamp?: number[] = [];
}
