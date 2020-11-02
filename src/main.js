// Import Vue
import Vue from 'vue';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle';

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import F7 Style
import Framework7CSS from 'framework7/css/framework7.bundle.min.css';

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css';

// Import Material Icons
import MaterialIcons from 'material-design-icons/iconfont/material-icons.css';

// Import Fontawesome Theme Styles
import FontAwesome from '@fortawesome/fontawesome-free/css/all.min.css';

//import './css/main.css';


// Import fastClick
import FastClick from 'fastclick';

// Import App Custom Styles
import AppStyles from './assets/sass/main.scss'

// Import App Component
import app from './main.vue';

import axios from 'axios';
window.axios = axios;


import store from './assets/vuex/storage.js';

import firebase from 'firebase/app';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAilC3T0gVurZW32xDy4Bo2T6Evg8YEAL8",
  authDomain: "trimhomesapp.firebaseapp.com",
  databaseURL: "https://trimhomesapp.firebaseio.com",
  projectId: "trimhomesapp",
  storageBucket: "trimhomesapp.appspot.com",
  messagingSenderId: "293671043570",
  appId: "1:293671043570:web:5dcf461110966314a5eb6b",
  measurementId: "G-3XRPE3WGW6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//const storage = firebase.storage();


import VueTelInput from 'vue-tel-input';
Vue.use(VueTelInput);

import vueCountryRegionSelect from 'vue-country-region-select'
Vue.use(vueCountryRegionSelect)

// Different F7-Vue plugin initialization with f7 v3.0
Framework7.use(Framework7Vue);

// Init Vue App
export default new Vue({
  // Root Element
  el: '#app',
  store,
  render: c => c('app'),
  components: {
    app
  },
  mounted() {
    window.addEventListener('load', () => {
      // run after everything is in-place
      FastClick.attach(document.body);
    });
  }
});
