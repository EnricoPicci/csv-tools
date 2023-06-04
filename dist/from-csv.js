"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromCsv = void 0;
const config_1 = require("./config");
function fromCsv(header, lines, csvSep = config_1.DEFAUL_CONFIG.CSV_SEP) {
    const columns = header.split(csvSep);
    return lines.map((line, i) => {
        const cells = line.split(csvSep);
        if (columns.length !== cells.length) {
            throw new Error(`The number of cells in line number ${i} ("${line}" is not the same as the number of columns specified in the header "${header})"`);
        }
        return cells.reduce((obj, cell, i) => {
            obj[columns[i].trim()] = cell;
            return obj;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, {});
    });
}
exports.fromCsv = fromCsv;
//# sourceMappingURL=from-csv.js.map