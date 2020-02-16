import { EntityCollectionService } from './entity-collection-service';
import { EntityCollectionServiceElementsFactory } from './entity-collection-service-elements-factory';
import { EntitySelectors$ } from '../selectors/entity-selectors$';
/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
export declare class EntityCollectionServiceFactory {
    /** Creates the core elements of the EntityCollectionService for an entity type. */
    entityCollectionServiceElementsFactory: EntityCollectionServiceElementsFactory;
    constructor(
    /** Creates the core elements of the EntityCollectionService for an entity type. */
    entityCollectionServiceElementsFactory: EntityCollectionServiceElementsFactory);
    /**
     * Create an EntityCollectionService for an entity type
     * @param entityName - name of the entity type
     */
    create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(entityName: string): EntityCollectionService<T>;
}
