import { Observable, Subscriber } from 'rxjs';
import { DEFAUL_CONFIG } from './config';

export function fromCsv<T>(header: string, lines: string[], csvSep = DEFAUL_CONFIG.CSV_SEP) {
    const columns = header.split(csvSep);
    return lines.map((line, i) => {
        return fromCsvRec<T>(columns, line, csvSep, i);
    });
}

export function fromCsvArray<T>(lines: string[], csvSep = DEFAUL_CONFIG.CSV_SEP) {
    if (lines.length < 2) {
        return [] as T[];
    }
    const header = lines[0];
    return fromCsv<T>(header, lines.slice(1), csvSep);
}

// Custom operator which uses the first line notified by upstream to build the header and the following lines to emit
// objects representing the csv records.
// https://rxjs.dev/guide/operators#creating-new-operators-from-scratch
export function fromCsvObs<T>(csvSep = DEFAUL_CONFIG.CSV_SEP) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (source: Observable<string>) => {
        let isFirst = true;
        let columns: string[];
        let index = 0;
        return new Observable((subscriber: Subscriber<T>) => {
            const subscription = source.subscribe({
                next: (csvRec) => {
                    if (isFirst) {
                        isFirst = false;
                        columns = csvRec.split(csvSep);
                        return;
                    }
                    const obj = fromCsvRec<T>(columns, csvRec, csvSep, index++);
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

function fromCsvRec<T>(columns: string[], csvRec: string, csvSep: string, index: number) {
    const cells = csvRec.split(csvSep);
    if (columns.length !== cells.length) {
        throw new Error(
            `The number of cells in line number ${index} ("${csvRec}" is not the same as the number of columns 
                specified in the header "${columns.join(csvSep)})"`,
        );
    }
    return cells.reduce((obj, cell, i) => {
        obj[columns[i].trim()] = cell;
        return obj;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any) as T;
}
