"use strict";
// Functions to transform an array of objects to an array of csv lines
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCsvObs = exports.toCsv = void 0;
const rxjs_1 = require("rxjs");
const config_1 = require("./config");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCsv(objects) {
    const csvLines = [];
    if (objects.length < 1) {
        return [];
    }
    const header = objects[0];
    csvLines.push(Object.keys(header).join(config_1.DEFAUL_CONFIG.CSV_SEP));
    objects.forEach((obj) => csvLines.push(toCsvRec(obj)));
    return csvLines;
}
exports.toCsv = toCsv;
// Custom operator which uses the first object notified by upstream to build the header, which is then emitted first.
// All objects notified by the source Observable are transformed to csv records and notified downstream.
// https://rxjs.dev/guide/operators#creating-new-operators-from-scratch
function toCsvObs() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (source) => {
        let isFirst = true;
        return new rxjs_1.Observable((subscriber) => {
            const subscription = source.subscribe({
                next: (obj) => {
                    if (isFirst) {
                        isFirst = false;
                        subscriber.next(Object.keys(obj).join(config_1.DEFAUL_CONFIG.CSV_SEP));
                    }
                    subscriber.next(toCsvRec(obj));
                },
                error: (err) => subscriber.error(err),
                complete: () => {
                    subscriber.complete();
                },
            });
            return () => {
                subscription.unsubscribe();
            };
        });
    };
}
exports.toCsvObs = toCsvObs;
function toCsvRec(obj) {
    const values = valuesWithNoCsvSeparator(obj);
    const csvRec = values.join(config_1.DEFAUL_CONFIG.CSV_SEP);
    return csvRec;
}
// valuesWithNoCsvSeparator returns an array of values of the object, with the csv separator replaced by space if present
// this is to avoid the csv parser to split the value in two columns
function valuesWithNoCsvSeparator(obj) {
    return Object.values(obj).map((value) => {
        const _value = value !== null && value !== undefined ? value : '';
        return _value.toString().replaceAll(config_1.DEFAUL_CONFIG.CSV_SEP, ' ');
    });
}
//# sourceMappingURL=to-csv.js.map