<template>
  <div class="flex flex-col justify-center items-center mt-10 space-y-2">
    <button class="flex items-center rounded-lg px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700"
      @click="loginWithGoogle">
      Login with Google
    </button>
    <button class="flex items-center rounded-lg px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700"
      @click="loginWithFacebook">
      Login with Facebook
    </button>
  </div>
</template>


<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

interface User {
  name: string;
  email: string;
  avatar: string;
  id: string;
}

export default defineComponent({
  setup() {
    const apiBaseUrl = getCurrentInstance()!.appContext.config.globalProperties.$apiBaseUrl;

    const loginWithGoogle = () => {
      window.location.href = `${apiBaseUrl}/auth/google`;

    };

    const loginWithFacebook = () => {
      //  window.location.href = `${apiBaseUrl}/auth/facebook`;
    }

    return { loginWithGoogle, loginWithFacebook };
  },
  mounted() {
    const store = useStore();
    const route = useRoute();
    const name = route.query.name as string;
    const email = route.query.email as string;
    const avatar = route.query.avatar as string;
    const id = route.query.id as string;
    console.log(route.query)

    if (name && email && avatar) {
      const user: User = {
        name,
        email,
        avatar,
        id
      };

      store.dispatch('setUser', user);
    }
  }
});
</script>
