import { Schema, type, ArraySchema } from "@colyseus/schema";

export class CellData extends Schema {
    @type("boolean") revealed = false;
    @type("boolean") flagged = false;
    @type("number") value = 0;
    @type("string") lastInteractedBy: string | null = null;
    @type("boolean") isStartingCell = false;
}