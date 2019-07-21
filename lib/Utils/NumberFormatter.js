import { getConfig } from "../config";
export function format(v) {
    const precision = getConfig("precision");
    if (precision) {
        return parseFloat(v.toPrecision(precision));
    }
    return v;
}
