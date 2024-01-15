<template>
  <div class="flex justify-center mt-10">
    <div class="flex flex-col mr-20 items-center">

      <div class="relative mb-4">
        <img v-if="user?.avatar" :src="user.avatar" alt="User Avatar" class="rounded-full h-28 w-28 object-cover">
        <label for="avatarImage" style="left:90px; top:100px" class="absolute cursor-pointer">
          <img src="../assets/images/edit-icon.png" alt="Edit Avatar" class="h-6 w-6">
        </label>
        <input type="file" id="avatarImage" @change="handleFileUpload" style="display: none;">
      </div>

      <div class="flex items-center">
        <div v-if="!editingName" class="flex items-center">
          <p class="text-lg text-gray-300">{{ user?.name }}</p>
          <button @click="enableNameEdit" class="p-1">
            <img src="../assets/images/edit-icon.png" alt="Edit Name" class="h-6 w-6">
          </button>
        </div>
        <form v-else @submit.prevent="submitNewName" class="flex items-center bg-gray-600">
          <input v-model="newName" class="p-1 bg-gray-600 placeholder-gray-300 text-gray-300" placeholder="Enter new name"
            required>
          <button type="submit" class="flex items-center justify-center ml-2 text-gray-300 p-1 cursor-pointer">
            ✔
          </button>
        </form>

      </div>
    </div>

    <div class="flex flex-col items-center">
      <button class="rounded-lg px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700 mb-2" @click="openCreateEventPage">
        Create Event
      </button>
      <button class="rounded-lg px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700 mb-2" @click="logout">
        Logout
      </button>
    </div>
  </div>
  <div class="flex justify-center mt-4">
    <p v-if="!noEventsOrganizedByUser" class="text-lg text-gray-300">Organized by you</p>
  </div>
  <div v-if="userId" class="event-displayer-container">
    <event-displayer :key="eventsOrganizedByUserKey" @no-events="handleNoEventsOrganizedByUser"
      @events-found="handleEventsFoundOrganizedByUser"
      :api-url="`${apiBaseUrl}/api/events-organized-by-user/${userId}`"></event-displayer>
  </div>
  <div class="flex justify-center mt-4">
    <p v-if="!noEventsToWhichUserIsGoing" class="text-lg text-gray-300">You are going</p>
  </div>
  <div v-if="userId" class="event-displayer-container">
    <event-displayer :key="eventsToWhichUserIsGoingKey" @no-events="handleNoEventsToWhichUserIsGoing"
      @events-found="handleEventsFoundToWhichUserIsGoing"
      :api-url="`${apiBaseUrl}/api/events-to-which-user-is-going/${userId}`"></event-displayer>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent, computed, onMounted, ref, watch, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import EventDisplayer from './EventDisplayer.vue';

export default defineComponent({
  components: {
    EventDisplayer
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const editingName = ref(false);
    const newName = ref('');
    const eventsOrganizedByUserKey = ref(0); // It is needed in order to change the user's name which is displayed on the event's card
    const eventsToWhichUserIsGoingKey = ref(0);
    const noEventsOrganizedByUser = ref(false);
    const noEventsToWhichUserIsGoing = ref(false);
    const apiBaseUrl = getCurrentInstance()!.appContext.config.globalProperties.$apiBaseUrl;


    const handleNoEventsOrganizedByUser = () => {
      noEventsOrganizedByUser.value = true;
    };

    const handleEventsFoundOrganizedByUser = () => {
      noEventsOrganizedByUser.value = false;
    };

    const handleNoEventsToWhichUserIsGoing = () => {
      noEventsToWhichUserIsGoing.value = true;
    };

    const handleEventsFoundToWhichUserIsGoing = () => {
      noEventsToWhichUserIsGoing.value = false;
    };

    onMounted(() => {
      const userFromStorage = localStorage.getItem('oauthUser');
      if (userFromStorage) {
        const user = JSON.parse(userFromStorage);
        store.dispatch('setUser', user);
        localStorage.removeItem('oauthUser');
      }
    });

    const logout = () => {
      store.dispatch('logoutUser');
      router.push('/login');
    };

    const user = computed(() => store.getters.getUser);
    const userId = computed(() => store.getters.getUser ? store.getters.getUser.id : null);

    watch(() => store.getters.getUser, (newUser) => {
      if (!newUser) {
        router.push('/login');
      }
    });

    return { user, noEventsOrganizedByUser, noEventsToWhichUserIsGoing, handleNoEventsOrganizedByUser, handleEventsFoundOrganizedByUser, handleNoEventsToWhichUserIsGoing, handleEventsFoundToWhichUserIsGoing, logout, editingName, newName, eventsOrganizedByUserKey, eventsToWhichUserIsGoingKey, store, userId, apiBaseUrl };
  },
  methods: {
    handleFileUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        const formData = new FormData();
        formData.append('avatar', input.files[0]);
        this.user.avatar = URL.createObjectURL(input.files[0]);
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          if (user && user.id) {
            formData.append('user_id', user.id);
            axios.post(`${this.apiBaseUrl}/api/upload-avatar`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            })
              .then(response => {
                console.log("respones: " + response);
              })
              .catch(error => {
                console.error("Error: " + error);
              });
          }
        }

      }

    },
    enableNameEdit() {
      this.editingName = true;
      this.newName = '';
    },
    submitNewName() {
      this.editingName = false;
      const formData = new FormData();
      formData.append('name', this.newName);
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (user && user.id) {
          formData.append('user_id', user.id);
          axios.post('${this.$apiBaseUrl}/api/update-name', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          })
            .then(response => {
              console.log("resp: " + response);
              console.log("setting name");
              user.name = this.newName;
              if (this.user.avatar) {
                user.avatar = this.user.avatar;
              }
              localStorage.setItem('user', JSON.stringify(user));
              this.store.dispatch('setUser', user);
              this.eventsOrganizedByUserKey++;
              this.eventsToWhichUserIsGoingKey++;

            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    },
    openCreateEventPage() {
      this.$router.push({
        name: 'EventForm',
        query: {
          currentPath: this.$route.fullPath
        }
      });
    },
  }
});
</script>