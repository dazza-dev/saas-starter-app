import type { App, DirectiveBinding } from 'vue';
import ability from '@/core/plugins/ability';

/**
 * Directiva `v-can`: elimina el nodo si el usuario no tiene el permiso.
 * Es una ayuda de UI; la autorización real la hace el backend.
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
