<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
      <div v-for="event in formattedEvents" :key="event.id" @click="goToEventDetails(event)"
        class="max-w-sm rounded overflow-hidden shadow-lg justify-self-center">

        <img class="w-full h-60 object-contain"
          :src="event.imageUrl ? event.imageUrl : 'src/assets/images/event-icon.png'" alt="Event Image">
        <div class="flex flex-col justify-between p-6">
          <div>
            <div class="font-bold text-lg mb-2 text-gray-300">{{ event.name }}</div>
            <div class="text-sm mb-2 text-gray-300">{{ event.start_date }} {{ event.start_time }} - {{ event.end_date }}
              {{
                event.end_time
              }}</div>
            <div class="text-sm mb-2 text-gray-300">{{ event.location }}</div>
            <div class="text-sm mb-2 text-gray-300">Created by: {{ event.user ? event.user.name : 'Unknown' }}</div>
          </div>

          <button v-if="isLoggedIn" :key="event.id" @click.stop="toggleGoing(event.id)" :class="{
            'bg-gray-900 border-2 border-gray-300 hover:border-gray-400 py-1.5': !event.is_current_user_going,  // Adjusted padding
            'bg-gray-300 hover:bg-gray-400 py-2': event.is_current_user_going
          }" class="flex items-center justify-center text-gray-300 font-bold w-20 rounded-lg box-border">
            Going
          </button>
          <button v-if="event.user.id === Number(user.id)" @click.stop="openCreateEventPageToEditEvent(event)"
            class="relative bottom-7 left-40">
            <img src="../assets/images/edit-icon.png" alt="Edit Name" class="h-6 w-6">
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, getCurrentInstance } from 'vue';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  avatar: string;

}

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  user: User;
  image: string;
  imageUrl: string;
  additional_images: string;
  imageUrls: string[];
  going_to_users: User[];
  is_current_user_going: boolean;
}

export default defineComponent({
  emits: ['no-events', 'events-found'], // It is needed to know for the component where this component is used, whether there are any events returned
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    currentComponentName: String,
  },

  setup(props, context) {
    const events = ref<Event[]>([]);
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const isLoggedIn = computed(() => !!user);
    const noEvents = ref(false);
    const apiBaseUrl = getCurrentInstance()!.appContext.config.globalProperties.$apiBaseUrl;

    const formattedEvents = computed(() => {

      return events.value.map(event => {
        let formattedEvent = {
          ...event
        };

        if (event.image) {
          formattedEvent.imageUrl = `${apiBaseUrl}/storage/users/${event.user.id}/events/${event.id}/${event.image}`;
        }

        if (event.additional_images) {
          const additionalImageFilenames = JSON.parse(event.additional_images) as string[];
          formattedEvent.imageUrls = additionalImageFilenames.map(filename =>
            `${apiBaseUrl}/storage/users/${event.user.id}/events/${event.id}/${filename}`);
        }

        if (formattedEvent.location) {
          if (/^[A-Z2-7]{2,4}\+[A-Z2-7]{2,4}/.test(formattedEvent.location.split(' ')[0])) { // Checks if it's a plus code, it's possbble that this is wrong and a location name that contains a "+""
            formattedEvent.location = formattedEvent.location.substring(formattedEvent.location.indexOf(' ') + 1);
          } else if (formattedEvent.location.startsWith('Coordinates: ')) { // If only the coordinates are specified, the word "Coordinates: " is removed
            formattedEvent.location = formattedEvent.location.replace('Coordinates: ', '').split(', ').map(coord => parseFloat(coord).toFixed(3)).join(', ');
          }
        }
        else {
          formattedEvent.location = "No Location";
        }

        if (formattedEvent.start_time.endsWith('00')) {
          formattedEvent.start_time = formattedEvent.start_time.substring(0, formattedEvent.start_time.length - 3);
        }

        if (formattedEvent.end_time.endsWith('00')) {
          formattedEvent.end_time = formattedEvent.end_time.substring(0, formattedEvent.end_time.length - 3);
        }
        formattedEvent.going_to_users = event.going_to_users.map(user => {
          return {
            ...user,
            avatar: `${apiBaseUrl}/storage/users/${user.id}/avatar.jpg`
          };
        });

        return formattedEvent;
      });
    });

    const fetchEvents = async () => {
      try {
        axios.get(props.apiUrl)
          .then(response => {
            events.value = response.data;
            events.value.forEach(event => {
              event.is_current_user_going = user && event.going_to_users.some(u => u.id === Number(user.id));
            });

            if (events.value.length === 0) {
              context.emit('no-events');
            } else {
              context.emit('events-found');
            }
          })
          .catch(error => {
            console.error('Error 1 fetching data:', error);
          });
      } catch (error) {
        console.error('Error 2 fetching data:', error);
      }
    };

    watch(() => props.apiUrl, fetchEvents, { immediate: true }); // Because the immediate is set to true, the fetchEvents is called when the component is loaded as well


    return { formattedEvents, events, noEvents, isLoggedIn, apiBaseUrl, user };
  },
  methods: {
    async toggleGoing(eventId: number) {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (user && user.id) {
          const formData = new FormData();
          formData.append('user_id', user.id);
          formData.append('event_id', eventId as unknown as string);
          const event = this.events.find(e => e.id === eventId);
          formData.append('is_going', event?.is_current_user_going ? 'false' : 'true');

          try {
            const response = await axios.post(`${this.apiBaseUrl}/api/toggle-going`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            });

            this.updateEventUsers(eventId, user, !event?.is_current_user_going);
          } catch (error) {
            console.error("Error: ", error);
          }
        }
      }
    },
    updateEventUsers(eventId: number, newUser: User, isAdding: boolean) {
      const eventIndex = this.events.findIndex(event => event.id === eventId);
      if (eventIndex !== -1) {
        const updatedEvent = { ...this.events[eventIndex] };
        if (isAdding) {
          if (!updatedEvent.going_to_users.some(u => u.id === newUser.id)) {
            updatedEvent.going_to_users.push(newUser);
          }
        } else {
          console.log("removing user");
          updatedEvent.going_to_users = updatedEvent.going_to_users.filter(u => u.id !== Number(newUser.id));
        }
        updatedEvent.is_current_user_going = isAdding;

        this.events = [
          ...this.events.slice(0, eventIndex),
          updatedEvent,
          ...this.events.slice(eventIndex + 1),
        ];

      }
    },
    goToEventDetails(event: any) {
      this.$router.push({
        name: 'EventPage',
        params: { id: event.id },
        query: {
          name: event.name,
          description: event.description,
          start_date: event.start_date,
          end_date: event.end_date,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          imageUrls: event.imageUrls,
          going_to_users: JSON.stringify(event.going_to_users)
        }
      });
    },
    openCreateEventPageToEditEvent(event: any) {
      this.$router.push({
        name: 'EventForm',
        params: { id: event.id },
        query: {
          name: event.name,
          description: event.description,
          start_date: event.start_date,
          end_date: event.end_date,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          image_url: event.imageUrl,
          image_urls: event.imageUrls,
          currentPath: this.$route.fullPath
        }
      });
    },
  }

});
</script>