<template>
  <header class="bg-gray-600 w-full py-3 flex items-center justify-between">
    <div class="flex items-center absolute left-1">
      <search-bar></search-bar>
    </div>

    <div class="h-8 w-8"></div>

    <div class="flex items-center mr-1">
      <button @click="navigateTo('/')">
        <img src="@/assets/images/home-icon.png" alt="Home" class="h-8 mr-2 md:mr-4">
      </button>
      <button @click="navigateBasedOnAuth">
        <img src="@/assets/images/profile-icon.png" alt="Profile" class="rounded-full h-8">
      </button>
    </div>
  </header>
</template>
  
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SearchBar from './SearchBar.vue';

export default defineComponent({
  components: {
    SearchBar
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const isUserLoggedIn = computed(() => store.getters.isAuthenticated);

    const navigateBasedOnAuth = () => {
      if (isUserLoggedIn.value) {
        router.push('/profile');
      } else {
        router.push('/login');
      }
    };

    const navigateTo = (route: RouteLocationRaw) => {
      router.push(route);
    };

    return { navigateBasedOnAuth, isUserLoggedIn, navigateTo };
  }
});
</script>
