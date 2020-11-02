<template>
  <f7-list  media-list class="listing">
    <f7-list-item
                v-for="property in properties" 
                :key="property.id"
                class="listing-item"
                :link="`/projectSingle/${property.id}`"
                :title="`${property.data().Title + ', ' + property.data().Location}`"
                :subtitle="`${convertCurrency(property.data().Outright) + ' - Outright'}`"
                :text="`${convertCurrency(property.data().PartPrice) + ' - Part Purchase'}`"
                icon-ios="f7:briefcase" icon-aurora="f7:briefcase" icon-md="material:work"
            >
                <img slot="media" :src="property.data().image" height="80" width="80" />
                <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
        </f7-list-item>
    </f7-list>
</template>

<script>
import home from '../images/home.jpg';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { log } from 'util';


let data;
export default {

    data() {
    return {
      home,
      properties: [],
    }
  },

    mounted() {
      this.getProperties();
    },

methods: {
  convertCurrency(value) {
    return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(value);
  },

  getProperties() {
    firebase.firestore().collection("properties").get().then((snapshot) => {
      snapshot.docs.map(doc => {
        this.properties.push(doc);
        console.log(doc);
      });
    });
  }
},

    computed: {
      // getProperties: function () {
      //   firebase.firestore().collection("properties").get().then((snapshot) => {
      //       snapshot.docs.map(doc => {
      //         this.properties.push(doc); 
      //       });
      //   });
      // }
    }

}
</script>

<style>

</style>