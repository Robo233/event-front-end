<template>
    <div class="relative">
        <input type="text" ref="searchInput" v-model="searchQuery" @keyup.enter="onEnterPressed"
            class="pl-10 py-2 border rounded-full text-gray-300 focus:outline-none bg-gray-900 placeholder-gray-300"
            placeholder="Search...">
        <div class="absolute left-0 top-1/2 transform -translate-y-1/2 ml-2 cursor-pointer" @click="focusInput">
            <img src="@/assets/images/search-icon.png" alt="Search" class="h-4 w-4" />
        </div>
    </div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const searchQuery: Ref<string> = ref('');
        const router = useRouter();
        const searchInput = ref() as Ref<HTMLInputElement | null>;

        const focusInput = () => {
            if (searchInput.value) {
                searchInput.value.focus();
            }
        };

        const onEnterPressed = () => {
            if (searchQuery.value) {
                router.push({ name: 'SearchResults', query: { query: searchQuery.value } });
            }
        };

        return { searchQuery, onEnterPressed, focusInput, searchInput };
    }
};
</script>