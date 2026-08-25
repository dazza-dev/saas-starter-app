<template>
    <div v-for="(item, i) in modules" :key="i">
        <div class="module-item">
            <router-link :to="item.href" class="text-decoration-none">
                <div class="d-flex align-center">
                    <v-avatar size="45" :color="item.color" rounded="md">
                        <component :is="item.icon" size="24" color="white" />
                    </v-avatar>
                    <div class="ml-3">
                        <h6 class="text-subtitle-1 mb-1 font-weight-semibold">
                            {{ $t(item.title) }}
                        </h6>
                        <p class="text-subtitle-2 text-medium-emphasis">{{ $t(item.subtext) }}</p>
                    </div>
                </div>
            </router-link>
        </div>
        <v-divider v-if="i < modules.length - 1" class="mt-3 mb-3" />
    </div>
</template>

<script setup lang="ts">
import { LayoutGridIcon } from 'vue-tabler-icons';
import type { Component } from 'vue';

interface ModuleItem {
    icon: Component;
    color: string;
    title: string;
    subtext: string;
    href: string;
}

// Header module switcher: add an entry here for each module with its own navigation.
const modules: ModuleItem[] = [
    {
        icon: LayoutGridIcon,
        color: 'primary',
        title: 'sidebar.moduleApp',
        subtext: 'sidebar.moduleAppDescription',
        href: '/app/dashboard'
    }
];
</script>

<style scoped>
.module-item {
    padding: 10px 0;
}
</style>
