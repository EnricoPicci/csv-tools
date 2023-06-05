import { expect } from 'chai';

import { from, toArray } from 'rxjs';

import { fromCsv, fromCsvArray, fromCsvObs } from './from-csv';
import { DEFAUL_CONFIG } from './config';

describe(`fromCsv`, () => {
    it(`create an array of objects starting from an header and an array of lines`, () => {
        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep} col_2${sep} col_3`;
        const lines = [`1${sep}2${sep}3`, `a${sep}b${sep}c`];

        type ObjType = { col_1: string; col_2: string; col_3: string };

        const objsFromCsv = fromCsv<ObjType>(header, lines);

        expect(objsFromCsv.length).equal(lines.length);
        const firstObj = objsFromCsv[0];
        expect(firstObj.col_1).equal('1');
        expect(firstObj.col_2).equal('2');
        expect(firstObj.col_3).equal('3');
        const lastObj = objsFromCsv[lines.length - 1];
        expect(lastObj.col_2).equal('b');
        expect(lastObj.col_3).equal('c');
    });
});

describe(`fromCsvArray`, () => {
    it(`create an array of objects starting from an array of lines representing csv records`, () => {
        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep} col_2${sep} col_3`;
        const lines = [header, `1${sep}2${sep}3`, `a${sep}b${sep}c`];

        type ObjType = { col_1: string; col_2: string; col_3: string };

        const objsFromCsv = fromCsvArray<ObjType>(lines);

        expect(objsFromCsv.length).equal(lines.length - 1);
        const firstObj = objsFromCsv[0];
        expect(firstObj.col_1).equal('1');
        expect(firstObj.col_2).equal('2');
        expect(firstObj.col_3).equal('3');
        const lastObj = objsFromCsv[lines.length - 2];
        expect(lastObj.col_2).equal('b');
        expect(lastObj.col_3).equal('c');
    });
});

describe(`fromCsvObs`, () => {
    it(`create an array of objects starting from a stream of lines representing csv records`, (done) => {
        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep} col_2${sep} col_3`;
        const lines = [header, `1${sep}2${sep}3`, `a${sep}b${sep}c`];

        type ObjType = { col_1: string; col_2: string; col_3: string };

        from(lines)
            .pipe(fromCsvObs<ObjType>(), toArray())
            .subscribe({
                next: (objsFromCsv) => {
                    expect(objsFromCsv.length).equal(lines.length - 1);
                    const firstObj = objsFromCsv[0];
                    expect(firstObj.col_1).equal('1');
                    expect(firstObj.col_2).equal('2');
                    expect(firstObj.col_3).equal('3');
                    const lastObj = objsFromCsv[lines.length - 2];
                    expect(lastObj.col_2).equal('b');
                    expect(lastObj.col_3).equal('c');
                },
                error: (err) => done(err),
                complete: () => done(),
            });
    });
});
