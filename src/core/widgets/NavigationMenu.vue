<template>
    <v-menu open-on-hover :close-on-content-click="true">
        <template v-slot:activator="{ props }">
            <v-btn class="hidden-sm-and-down" rounded="sm" variant="text" color="primary" v-bind="props">
                {{ $t('common.menu.modules') }}
                <ChevronDownIcon size="16" class="mt-1 ml-1" />
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="pa-4 pb-4 pr-0">
                <Modules />
            </div>
        </v-sheet>
    </v-menu>
</template>

<script setup lang="ts">
import Modules from './ModulesMenu.vue';
</script>
