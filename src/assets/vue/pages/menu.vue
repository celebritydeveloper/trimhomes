<template>
<f7-page class="home" name="menu">
    <f7-navbar class="home--nav">
    <f7-nav-left>
        <f7-nav-title>Menu</f7-nav-title>
      </f7-nav-left>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
  <f7-block>
    <f7-list>
      <f7-list-item
        title="Settings"
        link="/settings/"
      ></f7-list-item>
      <f7-list-item
        title="Contact Us"
        link="/contact/"
      ></f7-list-item>
      <f7-list-item
        @click="logout"
        title="Logout"
      ></f7-list-item>
    </f7-list>
        <!--<f7-block></f7-block>
        <f7-link class="panel-link" href="/settings/">Settings</f7-link>
        <f7-link class="panel-link" href="/contact/">Contact Us</f7-link>
        <f7-link class="panel-link"  @click="logout">Logout</f7-link>-->
  </f7-block>
</f7-page>
</template>

<script>
import logo from '../../images/logo-nav.png';


import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


export default {
    data() {
        return {
            logo,
        }
    },

    methods: {
        logout() {
        firebase.auth().signOut().then(function() {
          this.$f7router.navigate('/', {
              reloadCurrent: true,
              ignoreCache: true,
          });
        }).catch(function(error) {
          this.$f7.dialog.alert(error, "Error");
        });
      },
    }

}
</script>

<style scoped>
  .panel-link {
    color: #2B3D4C; 
    border-bottom: 2px solid#2B3D4C; 
    display: block;
    font-size: 1rem;
    margin: 0 2rem 2rem 2rem;
    padding: 0 0 0.5rem 0.5rem;
  }
</style>