<template>
  <div class="container mx-auto p-4">
    <form class="max-w-lg mx-auto shadow-md rounded" @submit.prevent="submitEvent">

      <div class="mb-4">
        <label for="eventName" class="block text-gray-300 text-sm font-bold mb-2">Event Name:</label>
        <input v-model="eventName" id="eventName" placeholder="Enter event name"
          class="bg-gray-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
        <p v-if="eventNameError" class="text-red-500 text-xs italic">{{ eventNameError }}</p>
      </div>

      <div class="mb-4">
        <label for="eventDescription" class="block text-gray-300 text-sm font-bold mb-2">Description:</label>
        <input v-model="eventDescription" id="eventDescription" placeholder="Enter description"
          class="bg-gray-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
        <p v-if="eventDescriptionError" class="text-red-500 text-xs italic">{{ eventDescriptionError }}</p>
      </div>

      <div class="sm:mb-4 flex flex-wrap -mx-2">
        <div class="px-2 w-full sm:w-1/2 mb-4 sm:mb-0 relative">
          <label for="eventStartDate" class="block text-gray-300 text-sm font-bold mb-2">Start Date:</label>
          <input type="date" v-model="eventStartDate" id="eventStartDate"
            class="bg-gray-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
          <p v-if="eventStartDateError" class="text-red-500 text-xs italic">{{ eventStartDateError }}</p>
        </div>
        <div class="px-2 w-full sm:w-1/2 mb-4 sm:mb-0 relative">
          <label for="eventStartTime" class="block text-gray-300 text-sm font-bold mb-2">Start Time:</label>
          <input type="time" v-model="eventStartTime" id="eventStartTime"
            class="bg-gray-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
          <p v-if="eventStartTimeError" class="text-red-500 text-xs italic">{{ eventStartTimeError }}</p>
        </div>
      </div>

      <div class="sm:mb-4 flex flex-wrap -mx-2">
        <div class="px-2 w-full sm:w-1/2 mb-4 sm:mb-0 relative">
          <label for="eventEndDate" class="block text-gray-300 text-sm font-bold mb-2">End Date:</label>
          <input type="date" v-model="eventEndDate" id="eventEndDate"
            class="bg-gray-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
          <p v-if="eventEndDateError" class="text-red-500 text-xs italic">{{ eventEndDateError }}</p>
        </div>
        <div class="px-2 w-full sm:w-1/2 mb-4 sm:mb-0 relative">
          <label for="eventEndTime" class="block text-gray-300 text-sm font-bold mb-2">End Time:</label>
          <input type="time" v-model="eventEndTime" id="eventEndTime"
            class="bg-gray-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
          <p v-if="eventEndTimeError" class="text-red-500 text-xs italic">{{ eventEndTimeError }}</p>
        </div>
      </div>

      <div class="mb-4 relative">
        <label for="eventImage" class="block text-gray-300 text-sm font-bold mb-2">Event Profile Image:</label>
        <div v-if="eventProfileImageUrl" class="relative">
          <img :src="eventProfileImageUrl" alt="Event Image" class="mb-4">
          <button @click="removeProfileImage"
            class="absolute top-0 right-0 bg-gray-600 text-gray-300 rounded-full h-7 w-7 flex items-center justify-center text-lg"
            style="background-color: rgba(75, 85, 99, 0.75);">X</button>

        </div>
        <button type="button" id="uploadButton"
          class="rounded-lg px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700 flex items-center justify-center"
          @click="triggerProfileImageInput">
          <img src="@/assets/images/upload-icon.png" class="mr-2" style="height: 20px;"> Upload Profile Image
        </button>


        <input type="file" id="eventImage" ref="profileImageInput" @change="handleProfileImageUpload"
          accept="image/png, image/jpeg" class="hidden">
      </div>

      <div class="mb-4">
        <label for="eventImages" class="block text-gray-300 text-sm font-bold mb-2">Event Images:</label>
        <div class="flex flex-wrap">
          <div v-for="(url, index) in eventImageUrls" :key="index" class="p-2 relative">
            <img :src="url" alt="Event Image" class="mb-4 max-h-40">
            <button @click="removeImage(index)"
              class="absolute bg-gray-600 text-gray-300 rounded-full h-7 w-7 flex items-center justify-center text-lg"
              style="top:7px; right:7px; background-color: rgba(75, 85, 99, 0.75);">X</button>
          </div>
        </div>

        <button type="button" id="uploadImagesButton"
          class="rounded-lg px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700 flex items-center justify-center"
          @click="triggerEventsImagesInput"> <img src="@/assets/images/upload-icon.png" class="mr-2"
            style="height: 20px;"> Upload Event Images</button>

        <input type="file" id="eventImage" ref="eventImagesInput" @change="handleEventsImagesUpload" multiple
          accept="image/png, image/jpeg" class="hidden">
      </div>

      <div class="mb-4">
        <label for="place-search" class="block text-gray-300 text-sm font-bold mb-2">Location:</label>
        <input id="place-search" type="text" placeholder="Search for places"
          class="bg-gray-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline">
      </div>

      <div id="map" class="h-72 mb-4"></div>

      <div class="flex items-center justify-between">
        <button type="submit" class="rounded-lg px-4 py-2 bg-gray-600 text-gray-300 hover:bg-gray-700">
          {{ isUpdate ? 'Update event' : 'Create event' }}
        </button>
      </div>
    </form>
  </div>
</template>


<script lang="ts">
/// <reference types="@types/googlemaps" />
/* global google */
import { defineComponent, getCurrentInstance, onMounted, Ref, ref, watch } from 'vue';
import axios from 'axios';
import { initMap } from '../scripts/initMap';
import { useRoute, useRouter } from 'vue-router';


export default defineComponent({

  data() {
    return {
      locationCoordinates: null as null | { latitude: number, longitude: number },
      locationName: '',
      eventImage: null as File | null,
      eventImages: [] as File[],
      userId: '',
      eventNameError: '',
      eventDescriptionError: '',
      eventStartDateError: '',
      eventStartTimeError: '',
      eventEndDateError: '',
      eventEndTimeError: '',
    }
  },
  setup() {
    const route = useRoute();

    const router = useRouter();
    const apiBaseUrl = getCurrentInstance()!.appContext.config.globalProperties.$apiBaseUrl;
    const eventId = ref(route.params.id);
    const isUpdate = eventId.value !== undefined && !isNaN(Number(eventId.value));

    const eventName = ref('');
    const eventDescription = ref('');
    const eventStartDate = ref('');
    const eventStartTime = ref('');
    const eventEndDate = ref('');
    const eventEndTime = ref('');
    const eventProfileImageUrl = ref('');
    const eventImageUrls: Ref<string[]> = ref([]);
    const currentPath = ref('');

    onMounted(() => {
      if (route.params) {
        console.log(route.query);
        eventName.value = typeof route.query.name === 'string' ? route.query.name : '';
        eventDescription.value = typeof route.query.description === 'string' ? route.query.description : '';
        eventStartDate.value = typeof route.query.start_date === 'string' ? route.query.start_date : '';
        eventStartTime.value = typeof route.query.start_time === 'string' ? route.query.start_time : '';
        eventEndDate.value = typeof route.query.end_date === 'string' ? route.query.end_date : '';
        eventEndTime.value = typeof route.query.end_time === 'string' ? route.query.end_time : '';
        eventProfileImageUrl.value = typeof route.query.image_url === 'string' ? route.query.image_url : '';

        const imageUrls = route.query.image_urls;
        if (Array.isArray(imageUrls)) {
          eventImageUrls.value = imageUrls.map(url => typeof url === 'string' ? url : '').filter(url => url !== '');
        }

        currentPath.value = typeof route.query.currentPath === 'string' ? route.query.currentPath : '';

      }
    });



    return { router, apiBaseUrl, eventId, isUpdate, eventName, eventDescription, eventStartDate, eventStartTime, eventEndDate, eventEndTime, eventProfileImageUrl, eventImageUrls, currentPath };
  },
  methods: {
    submitEvent() {
      let isValid = true;

      this.eventNameError = '';
      this.eventDescriptionError = '';
      this.eventStartDateError = '';
      this.eventStartTimeError = '';
      this.eventEndDateError = '';
      this.eventEndTimeError = '';

      if (!this.eventName) {
        this.eventNameError = 'Event name is required';
        isValid = false;
      }
      if (!this.eventDescription) {
        this.eventDescriptionError = 'Description is required';
        isValid = false;
      }
      if (!this.eventStartDate) {
        this.eventStartDateError = 'Start date is required';
        isValid = false;
      }
      if (!this.eventStartTime) {
        this.eventStartTimeError = 'Start time is required';
        isValid = false;
      }
      if (!this.eventEndDate) {
        this.eventEndDateError = 'End date is required';
        isValid = false;
      }
      if (!this.eventEndTime) {
        this.eventEndTimeError = 'End time is required';
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      const formData = new FormData();
      formData.append('name', this.eventName);
      formData.append('description', this.eventDescription);
      formData.append('start_date', this.eventStartDate);
      formData.append('start_time', this.eventStartTime);
      formData.append('end_date', this.eventEndDate);
      formData.append('end_time', this.eventEndTime);
      formData.append('location', this.locationName);

      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (user && user.id) {
          formData.append('user_id', user.id);
        }
      }

      if (this.eventImage) {
        formData.append('image', this.eventImage);
      }

      if (this.eventProfileImageUrl) {
        URL.revokeObjectURL(this.eventProfileImageUrl); // Removes the url to save memory
      }

      this.eventImages.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });


      if (this.isUpdate) {
        const eventIdAsString = Array.isArray(this.eventId) ? this.eventId.join('') : this.eventId;
        formData.append('event_id', eventIdAsString);
      }

      const apiUrl = this.isUpdate ? `${this.apiBaseUrl}/api/events/update` : `${this.apiBaseUrl}/api/events`;
      console.log("apiUrl: " + apiUrl);
      axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(response => {
          console.log(response);
          this.router.push(this.currentPath);
        })
        .catch(error => {
          console.error(error);
        });

      this.router.push(this.currentPath);

    },
    handleProfileImageUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        this.eventImage = input.files[0];
        this.eventProfileImageUrl = URL.createObjectURL(this.eventImage);
      }
    },
    handleEventsImagesUpload(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        const files = Array.from(input.files);
        this.eventImages = [...this.eventImages, ...files];
        const newImageUrls = files.map(file => URL.createObjectURL(file));
        this.eventImageUrls = [...this.eventImageUrls, ...newImageUrls];
      }
    },
    removeProfileImage() {
      if (this.eventProfileImageUrl) {
        URL.revokeObjectURL(this.eventProfileImageUrl);
        this.eventProfileImageUrl = '';
      }
      this.eventImage = null;
      const inputElement = this.$refs.profileImageInput as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    },
    removeImage(index: number) {
      if (index >= 0 && index < this.eventImageUrls.length) {
        URL.revokeObjectURL(this.eventImageUrls[index]);
        this.eventImageUrls.splice(index, 1);
      }
      if (index >= 0 && index < this.eventImages.length) {
        this.eventImages = this.eventImages.filter((_, fileIndex) => fileIndex !== index);
      }
      const inputElement = this.$refs.eventImagesInput as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    },
    triggerProfileImageInput() {
      const inputElement = this.$refs.profileImageInput as HTMLInputElement;
      if (inputElement) {
        inputElement.click();
      }
    },
    triggerEventsImagesInput() {
      const inputElement = this.$refs.eventImagesInput as HTMLInputElement;
      if (inputElement) {
        inputElement.click();
      }
    }

  },
  mounted() {
    initMap(
      (name: string) => { this.locationName = name; console.log("name:" + name) }
    );

  },

});
</script>