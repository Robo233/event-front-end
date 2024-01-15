import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import vuexStore from './scripts/vuexStore';
import './assets/global.css';
import EventDisplayer from './components/EventDisplayer.vue';
import ProfilePage from './components/ProfilePage.vue';
import LoginPage from './components/LoginPage.vue';
import EventForm from './components/EventForm.vue';
import EventPage from './components/EventPage.vue';
import SearchResults from './components/SearchResults.vue';

const apiBaseUrl = 'http://localhost:8000';
//const apiBaseUrl = 'http://192.168.1.12:8000';
//const apiBaseUrl = 'https://four-meals-lay.loca.lt';



const routes = [
  {
    path: '/', component: EventDisplayer, props: (route: { path: string; }) => {
      const apiUrl = `${apiBaseUrl}/api/events`;
      return { apiUrl };
    }
  },
  { path: '/profile', component: ProfilePage },
  { path: '/login', component: LoginPage },
  { path: '/event-form/:id?', name: "EventForm", component: EventForm, props: true },
  {
    path: '/event/:id',
    name: 'EventPage',
    component: EventPage,
    props: true
  },
  { path: '/search', name: "SearchResults", component: SearchResults, props: true },

];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const app = createApp(App);

app.config.globalProperties.$apiBaseUrl = apiBaseUrl;


function checkForOAuthResponse() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const email = urlParams.get('email');
  const avatar = urlParams.get('avatar');
  const id = urlParams.get('id');

  if (name && email && avatar && id) {
    const user = { name, email, avatar, id };
    localStorage.setItem('oauthUser', JSON.stringify(user));
  }
}

checkForOAuthResponse();

app.use(vuexStore);
app.use(router);
app.mount('#app');