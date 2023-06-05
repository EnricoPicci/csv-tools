"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromCsvObs = exports.fromCsvArray = exports.fromCsv = void 0;
const rxjs_1 = require("rxjs");
const config_1 = require("./config");
function fromCsv(header, lines, csvSep = config_1.DEFAUL_CONFIG.CSV_SEP) {
    const columns = header.split(csvSep);
    return lines.map((line, i) => {
        return fromCsvRec(columns, line, csvSep, i);
    });
}
exports.fromCsv = fromCsv;
function fromCsvArray(lines, csvSep = config_1.DEFAUL_CONFIG.CSV_SEP) {
    if (lines.length < 2) {
        return [];
    }
    const header = lines[0];
    return fromCsv(header, lines.slice(1), csvSep);
}
exports.fromCsvArray = fromCsvArray;
// Custom operator which uses the first line notified by upstream to build the header and the following lines to emit
// objects representing the csv records.
// https://rxjs.dev/guide/operators#creating-new-operators-from-scratch
function fromCsvObs(csvSep = config_1.DEFAUL_CONFIG.CSV_SEP) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (source) => {
        let isFirst = true;
        let columns;
        let index = 0;
        return new rxjs_1.Observable((subscriber) => {
            const subscription = source.subscribe({
                next: (csvRec) => {
                    if (isFirst) {
                        isFirst = false;
                        columns = csvRec.split(csvSep);
                        return;
                    }
                    const obj = fromCsvRec(columns, csvRec, csvSep, index++);
                    subscriber.next(obj);
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
exports.fromCsvObs = fromCsvObs;
function fromCsvRec(columns, csvRec, csvSep, index) {
    const cells = csvRec.split(csvSep);
    if (columns.length !== cells.length) {
        throw new Error(`The number of cells in line number ${index} ("${csvRec}" is not the same as the number of columns 
                specified in the header "${columns.join(csvSep)})"`);
    }
    return cells.reduce((obj, cell, i) => {
        obj[columns[i].trim()] = cell;
        return obj;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {});
}
//# sourceMappingURL=from-csv.js.map