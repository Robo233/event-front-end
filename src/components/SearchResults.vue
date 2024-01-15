<template>
    <div class="container mx-auto p-4">
        <event-displayer :api-url="`${apiBaseUrl}/api/events/search?q=${searchQuery}`" @no-events="handleNoEvents"
            @events-found="handleEventsFound">
        </event-displayer>
        <p v-if="noEvents" class="text-center text-gray-600 text-xl mt-6">
            No results for "{{ searchQuery }}"
        </p>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventDisplayer from './EventDisplayer.vue';

export default defineComponent({
    components: {
        EventDisplayer
    },
    setup() {
        const route = useRoute();
        const searchQuery = ref(route.query.query as string);
        const noEvents = ref(false);
        const apiBaseUrl = getCurrentInstance()!.appContext.config.globalProperties.$apiBaseUrl;

        const handleNoEvents = () => {
            noEvents.value = true;
        };

        const handleEventsFound = () => {
            noEvents.value = false;
        };

        watch(() => route.query.query, (newQuery) => {
            searchQuery.value = newQuery as string;
            noEvents.value = false;
        });

        return { searchQuery, noEvents, handleNoEvents, handleEventsFound, apiBaseUrl };
    }
});
</script>
