import { EntityAction } from '../actions/entity-action';
import { EntityCollection } from './entity-collection';
import { EntityCollectionReducerMethodsFactory } from './entity-collection-reducer-methods';
export declare type EntityCollectionReducer<T = any> = (collection: EntityCollection<T>, action: EntityAction) => EntityCollection<T>;
/** Create a default reducer for a specific entity collection */
export declare class EntityCollectionReducerFactory {
    private methodsFactory;
    constructor(methodsFactory: EntityCollectionReducerMethodsFactory);
    /** Create a default reducer for a collection of entities of T */
    create<T = any>(entityName: string): EntityCollectionReducer<T>;
}
