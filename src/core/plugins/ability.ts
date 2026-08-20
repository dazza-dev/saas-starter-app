import { createMongoAbility } from '@casl/ability';

// Los permisos llegan del backend, así que actions y subjects son strings, no una unión fija.
const ability = createMongoAbility<[string, string]>();

export default ability;
