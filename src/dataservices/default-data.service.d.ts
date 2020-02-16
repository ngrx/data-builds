import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Update } from '@ngrx/entity';
import { DefaultDataServiceConfig } from './default-data-service-config';
import { EntityCollectionDataService, HttpMethods, QueryParams } from './interfaces';
import { HttpUrlGenerator } from './http-url-generator';
/**
 * A basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
export declare class DefaultDataService<T> implements EntityCollectionDataService<T> {
    protected http: HttpClient;
    protected httpUrlGenerator: HttpUrlGenerator;
    protected _name: string;
    protected delete404OK: boolean;
    protected entityName: string;
    protected entityUrl: string;
    protected entitiesUrl: string;
    protected getDelay: number;
    protected saveDelay: number;
    protected timeout: number;
    get name(): string;
    constructor(entityName: string, http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config?: DefaultDataServiceConfig);
    add(entity: T): Observable<T>;
    delete(key: number | string): Observable<number | string>;
    getAll(): Observable<T[]>;
    getById(key: number | string): Observable<T>;
    getWithQuery(queryParams: QueryParams | string): Observable<T[]>;
    update(update: Update<T>): Observable<T>;
    upsert(entity: T): Observable<T>;
    protected execute(method: HttpMethods, url: string, data?: any, // data, error, or undefined/null
    options?: any): Observable<any>;
    private handleError;
    private handleDelete404;
}
/**
 * Create a basic, generic entity data service
 * suitable for persistence of most entities.
 * Assumes a common REST-y web API
 */
export declare class DefaultDataServiceFactory {
    protected http: HttpClient;
    protected httpUrlGenerator: HttpUrlGenerator;
    protected config?: DefaultDataServiceConfig | undefined;
    constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator, config?: DefaultDataServiceConfig | undefined);
    /**
     * Create a default {EntityCollectionDataService} for the given entity type
     * @param entityName {string} Name of the entity type for this data service
     */
    create<T>(entityName: string): EntityCollectionDataService<T>;
}
