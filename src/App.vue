<template>
  <div id="app" class="bg-gray-900 min-h-screen">
    <AppHeader></AppHeader>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppHeader from './components/AppHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    AppHeader
  }
});
</script>
