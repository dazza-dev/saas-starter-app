<template>
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn icon variant="text" color="primary" class="custom-hover-primary" v-bind="props">
                <v-badge :model-value="hasNotifications" dot color="primary">
                    <BellRingingIcon stroke-width="1.5" size="22" />
                </v-badge>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="360" elevation="10">
            <div class="px-8 pb-4 pt-6">
                <div class="d-flex align-center justify-space-between">
                    <h6 class="text-h5">{{ $t('common.notifications.title') }}</h6>
                    <v-chip v-if="hasNotifications" color="primary" variant="flat" size="small" class="text-white">
                        {{ $t('common.notifications.countNew', { count: notifications.length }) }}
                    </v-chip>
                </div>
            </div>

            <template v-if="hasNotifications">
                <perfect-scrollbar style="height: 400px">
                    <v-list class="py-0 theme-list" lines="two">
                        <v-list-item v-for="item in notifications" :key="item.title" :value="item" color="primary" class="py-4 px-8">
                            <template v-slot:prepend>
                                <v-avatar size="48" class="mr-3">
                                    <v-img :src="item.avatar" width="48" :alt="item.title" />
                                </v-avatar>
                            </template>
                            <h6 class="text-subtitle-1 font-weight-bold mb-1">{{ item.title }}</h6>
                            <p class="text-subtitle-1 font-weight-regular textSecondary">{{ item.subtitle }}</p>
                        </v-list-item>
                    </v-list>
                </perfect-scrollbar>
                <div class="py-4 px-6 text-center">
                    <v-btn color="primary" variant="outlined" block>{{ $t('common.notifications.seeAll') }}</v-btn>
                </div>
            </template>

            <div v-else class="px-8 py-10 text-center text-medium-emphasis">
                <BellOffIcon stroke-width="1.5" size="32" class="mb-2" />
                <p class="text-subtitle-1">{{ $t('common.notifications.empty') }}</p>
            </div>
        </v-sheet>
    </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NotificationType } from '@/core/types/widgets.type';

// Conéctalo a tu endpoint de notificaciones cuando lo tengas.
const notifications: NotificationType[] = [];

const hasNotifications = computed(() => notifications.length > 0);
</script>
