import { Observable } from 'rxjs';
export declare function toCsv(objects: any[]): string[];
export declare function toCsvObs(): (source: Observable<any>) => Observable<string>;
