import { createMongoAbility } from '@casl/ability';

// Permissions come from the backend, so actions and subjects are strings, not a fixed union.
const ability = createMongoAbility<[string, string]>();

export default ability;
