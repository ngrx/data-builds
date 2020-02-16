import { EntityCollection } from './entity-collection';
import { EntityDefinitionService } from '../entity-metadata/entity-definition.service';
export declare class EntityCollectionCreator {
    private entityDefinitionService?;
    constructor(entityDefinitionService?: EntityDefinitionService | undefined);
    /**
     * Create the default collection for an entity type.
     * @param entityName {string} entity type name
     */
    create<T = any, S extends EntityCollection<T> = EntityCollection<T>>(entityName: string): S;
}
export declare function createEmptyEntityCollection<T>(entityName?: string): EntityCollection<T>;
