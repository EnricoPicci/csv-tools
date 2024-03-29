import { expect } from 'chai';
import { from } from 'rxjs';
import { toArray, tap } from 'rxjs/operators';
import { toCsv, toCsvObs } from './to-csv';
import { DEFAUL_CONFIG } from './config';

describe(`toCsv`, () => {
    it(`create, from an array of objects, an array of lines, the first one being the header the other being the rows in comma separated value (csv) format`, () => {
        type objType = { col_1: string; col_2: string; col_3: string };
        const obj_1: objType = { col_1: '1', col_2: '2', col_3: '3' };
        const obj_2: objType = { col_1: 'a', col_2: 'b', col_3: 'c' };
        const objs = [obj_1, obj_2];

        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep}col_2${sep}col_3`;
        const row_1 = `1${sep}2${sep}3`;
        const row_2 = `a${sep}b${sep}c`;

        const linesFromObjects = toCsv(objs);

        // there are as many lines as objects in the array passed to the toCsv function plus 1 for the header
        expect(linesFromObjects.length).equal(objs.length + 1);
        // the first line is the header
        expect(linesFromObjects[0]).equal(header);
        // the other lines are the representations of the objects in csv format
        expect(linesFromObjects[1]).equal(row_1);
        expect(linesFromObjects[2]).equal(row_2);
    });

    it(`create, from an array of objects, an array of lines, the first one being the header the other being the rows in comma separated value (csv) format
    One of the values is an array of strings`, () => {
        type objType = { col_1: string; col_2: string; col_3: string[] };
        const obj_1: objType = { col_1: '1', col_2: '2', col_3: ['3', '4', '5'] };
        const obj_2: objType = { col_1: 'a', col_2: 'b', col_3: ['c', 'd', 'e'] };
        const objs = [obj_1, obj_2];

        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep}col_2${sep}col_3`;
        const row_1 = `1${sep}2${sep}3 4 5`;
        const row_2 = `a${sep}b${sep}c d e`;

        const linesFromObjects = toCsv(objs);

        // there are as many lines as objects in the array passed to the toCsv function plus 1 for the header
        expect(linesFromObjects.length).equal(objs.length + 1);
        // the first line is the header
        expect(linesFromObjects[0]).equal(header);
        // the other lines are the representations of the objects in csv format
        expect(linesFromObjects[1]).equal(row_1);
        expect(linesFromObjects[2]).equal(row_2);
    });

    it(`create, from an array of objects, an array of lines, the first one being the header the other being the rows in comma separated value (csv) format
    One of the values is null`, () => {
        type objType = { col_1: string; col_2: any; col_3: string[] };
        const obj_1: objType = { col_1: '1', col_2: '2', col_3: ['3', '4'] };
        const obj_2: objType = { col_1: 'a', col_2: null, col_3: ['c', 'd'] };
        const objs = [obj_1, obj_2];

        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep}col_2${sep}col_3`;
        const row_1 = `1${sep}2${sep}3 4`;
        const row_2 = `a${sep}${sep}c d`;

        const linesFromObjects = toCsv(objs);

        // there are as many lines as objects in the array passed to the toCsv function plus 1 for the header
        expect(linesFromObjects.length).equal(objs.length + 1);
        // the first line is the header
        expect(linesFromObjects[0]).equal(header);
        // the other lines are the representations of the objects in csv format
        expect(linesFromObjects[1]).equal(row_1);
        expect(linesFromObjects[2]).equal(row_2);
    });

    it(`create, from an array of objects, an array of lines, the first one being the header the other being the rows in comma separated value (csv) format
    One of the values is undefined`, () => {
        type objType = { col_1: string; col_2: any; col_3: string[] };
        const obj_1: objType = { col_1: '1', col_2: '2', col_3: ['3', '4'] };
        const obj_2: objType = { col_1: 'a', col_2: undefined, col_3: ['c', 'd'] };
        const objs = [obj_1, obj_2];

        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep}col_2${sep}col_3`;
        const row_1 = `1${sep}2${sep}3 4`;
        const row_2 = `a${sep}${sep}c d`;

        const linesFromObjects = toCsv(objs);

        // there are as many lines as objects in the array passed to the toCsv function plus 1 for the header
        expect(linesFromObjects.length).equal(objs.length + 1);
        // the first line is the header
        expect(linesFromObjects[0]).equal(header);
        // the other lines are the representations of the objects in csv format
        expect(linesFromObjects[1]).equal(row_1);
        expect(linesFromObjects[2]).equal(row_2);
    });

    it(`create, from an array of objects, an array of lines, the first one being the header the other being the rows in comma separated value (csv) format
    One of the values is 0`, () => {
        type objType = { col_1: string; col_2: any; col_3: string[] };
        const obj_1: objType = { col_1: '1', col_2: '2', col_3: ['3', '4'] };
        const obj_2: objType = { col_1: 'a', col_2: 0, col_3: ['c', 'd'] };
        const objs = [obj_1, obj_2];

        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep}col_2${sep}col_3`;
        const row_1 = `1${sep}2${sep}3 4`;
        const row_2 = `a${sep}0${sep}c d`;

        const linesFromObjects = toCsv(objs);

        // there are as many lines as objects in the array passed to the toCsv function plus 1 for the header
        expect(linesFromObjects.length).equal(objs.length + 1);
        // the first line is the header
        expect(linesFromObjects[0]).equal(header);
        // the other lines are the representations of the objects in csv format
        expect(linesFromObjects[1]).equal(row_1);
        expect(linesFromObjects[2]).equal(row_2);
    });
});

describe(`toCsvObs`, () => {
    it(`transform a stream of objectsinto a stream of lines, the first one being the header the other being the rows in comma separated value (csv) format`, () => {
        type objType = { col_1: string; col_2: string; col_3: string };
        const obj_1: objType = { col_1: '1', col_2: '2', col_3: '3' };
        const obj_2: objType = { col_1: 'a', col_2: 'b', col_3: 'c' };
        const objs = [obj_1, obj_2];

        const sep = DEFAUL_CONFIG.CSV_SEP;
        const header = `col_1${sep}col_2${sep}col_3`;
        const row_1 = `1${sep}2${sep}3`;
        const row_2 = `a${sep}b${sep}c`;

        from(objs)
            .pipe(
                toCsvObs(),
                toArray(),
                tap({
                    next: (linesFromObjects) => {
                        // there are as many lines as objects in the array passed to the toCsv function plus 1 for the header
                        expect(linesFromObjects.length).equal(objs.length + 1);
                        // the first line is the header
                        expect(linesFromObjects[0]).equal(header);
                        // the other lines are the representations of the objects in csv format
                        expect(linesFromObjects[1]).equal(row_1);
                        expect(linesFromObjects[2]).equal(row_2);
                    },
                }),
            )
            .subscribe();
    });
});
