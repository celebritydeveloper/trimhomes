<template>
  <f7-page name="properties" ptr @ptr:refresh="loadMore" @ptr:pullend="clearProperty">
    <f7-navbar>
      <f7-nav-left>
        <f7-nav-title>Properties</f7-nav-title>
      </f7-nav-left>
      
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
    <!--<f7-list>
      <f7-list-item
        v-for="(product) in products"
        :key="product.id"
        :title="product.title"
        :link="`/product/${product.id}/`"
      ></f7-list-item>
    </f7-list>-->
    <f7-list  media-list class="listing">
      <f7-list-item
        v-for="(property, index) in properties" 
        :key="index"
        class="listing-item"
        :link="`/property/${property.id}/`"
        :title="`${property.data().Title + ', ' + property.data().Location}`"
        :subtitle="`${convertCurrency(property.data().Outright) + ' - Outright'}`"
        :text="`${convertCurrency(property.data().PartPrice) + ' - Part Purchase'}`"
        icon-ios="f7:briefcase" icon-aurora="f7:briefcase" icon-md="material:work"
      >
          <img slot="media" :src="property.data().image" height="80" width="80" />
          <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
      </f7-list-item>
    </f7-list>
  </f7-page>
  
</template>

<script>
import logo from '../../images/logo-nav.png';
import * as firebase from 'firebase/app';
import 'firebase/firestore';



let data;
export default {
  data: function () {
    return {
      logo,
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

  loadMore(done) {
    this.getProperties();
    let toastBottom = this.$f7.toast.create({
      text: 'Properties Updated',
      closeTimeout: 1500,
      position: 'bottom',
    });
    toastBottom.open();
    done();
  },
  clearProperty() {
    this.properties = [];
  },

  async getProperties() {
    this.$f7.preloader.show();
    try {
      firebase.firestore().collection("properties").get().then((snapshot) => {
      snapshot.docs.map(doc => {
          this.properties.push(doc);
        });
      }).then(() => {
        this.$f7.preloader.hide();
      })
    } catch (error) {
      this.$f7.preloader.hide();
      console.log(err);
    }
    
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

<style scoped>

</style>
