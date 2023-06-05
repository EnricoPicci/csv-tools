import { Observable } from 'rxjs';
export declare function fromCsv<T>(header: string, lines: string[], csvSep?: string): T[];
export declare function fromCsvArray<T>(lines: string[], csvSep?: string): T[];
export declare function fromCsvObs<T>(csvSep?: string): (source: Observable<string>) => Observable<T>;
