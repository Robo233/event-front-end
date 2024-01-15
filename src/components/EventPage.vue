<template>
    <div class="container mx-auto p-4 max-w-xl">
        <div class="bg-gray-600 shadow-lg rounded-lg overflow-hidden">
            <div class="p-4">
                <h1 class="text-2xl font-bold mb-2 text-gray-300">{{ event.name }}</h1>
                <p class="text-gray-900 text-sm">{{ event.description }}</p>
            </div>
            <div class="p-4 border-t border-gray-200">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-gray-900 text-sm">
                            <span v-if="isSingleDayEvent">Date:</span>
                            <span v-else>Start date:</span>
                        </span>
                        <p class="text-md text-gray-300">{{ event.start_date }}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-900 text-sm">
                            <span v-if="isSingleDayEvent"></span>
                            <span v-else>End date:</span>
                        </span>
                        <p class="text-md text-gray-300" v-if="!isSingleDayEvent">{{ event.end_date }}</p>
                    </div>
                    <div>
                        <span class="text-gray-900 text-sm">Start Time:</span>
                        <p class="text-md text-gray-300">{{ event.start_time }}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-900 text-sm">End Time:</span>
                        <p class="text-md text-gray-300">{{ event.end_time }}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <span class="text-gray-900 text-sm">Location:</span>
                    <p class="text-md text-gray-300">{{ event.location }}</p>
                </div>
                <div class="mt-4">
                    <h2 class="text-lg font-bold text-gray-300 mb-2">Attendees:</h2>
                    <div class="space-y-2">
                        <div v-for="user in event.going_to_users" :key="user?.id" class="flex items-center">
                            <img :src="user.avatar" alt="User" class="h-10 w-10 rounded-full mr-2">
                            <span class="text-md text-gray-300">{{ user.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="event.imageUrls && event.imageUrls.length" class="p-4 border-t border-gray-200">
            <h2 class="text-lg font-bold text-gray-300 mb-2">Event Images:</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="imageUrl in event.imageUrls" :key="imageUrl" class="overflow-hidden rounded-lg">
                    <img :src="imageUrl" alt="Event Image" class="w-full h-auto object-cover">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, Ref, ref } from "vue";
import { useRoute } from "vue-router";

interface User {
    id: number;
    name: string;
    avatar: string;
}

interface Event {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    location: string;
    imageUrls: string[];
    going_to_users: User[];
}

export default defineComponent({
    setup() {
        const route = useRoute();
        const event = ref<Event>({
            id: route.params.id as string,
            name: route.query.name as string,
            description: route.query.description as string,
            start_date: route.query.start_date as string,
            end_date: route.query.end_date as string,
            start_time: route.query.start_time as string,
            end_time: route.query.end_time as string,
            location: route.query.location as string,
            imageUrls: route.query.imageUrls as string[],
            going_to_users: []
        });

        if (typeof route.query.going_to_users === 'string') {
            event.value.going_to_users = JSON.parse(route.query.going_to_users);
        }

        const isSingleDayEvent = computed(() => {
            return event.value.start_date === event.value.end_date;
        });

        return { event, isSingleDayEvent };
    }
});

</script>