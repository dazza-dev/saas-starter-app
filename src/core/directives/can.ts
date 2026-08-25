import type { App, DirectiveBinding } from 'vue';
import ability from '@/core/plugins/ability';

/**
 * `v-can` directive: removes the node if the user lacks the permission; UI-only, the backend still enforces authorization.
 */
export function registerCanDirective(app: App): void {
    app.directive('can', {
        mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
            if (!ability.can(binding.value, 'all')) {
                el.remove();
            }
        }
    });
}
