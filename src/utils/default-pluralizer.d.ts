import { EntityPluralNames } from './interfaces';
export declare class DefaultPluralizer {
    pluralNames: EntityPluralNames;
    constructor(pluralNames: EntityPluralNames[]);
    /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     */
    pluralize(name: string): string;
    /**
     * Register a mapping of entity type name to the entity name's plural
     * @param pluralNames {EntityPluralNames} plural names for entity types
     */
    registerPluralNames(pluralNames: EntityPluralNames): void;
}
