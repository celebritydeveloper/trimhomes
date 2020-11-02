<template>
  <f7-page name="profile">
  <f7-navbar class="home--nav" back-link="Settings" back-link-show-text>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
    <!--<f7-navbar back-link="Back"></f7-navbar>-->
    <f7-page-content class="confirm">
      <div class="user-image">
        <img :src="avatar" alt="" class="user-image">
      </div>
      <div class="list no-chevron setting-menu">
        <ul>
          <li>
            <a href="#" class="item-link item-content">
              <div class="item-media">
                <f7-icon ios="f7:person_alt_circle_fill" aurora="f7:person_alt_circle_fill" md="material:account_circle"></f7-icon>
              </div>
              <div class="item-inner">
                <div class="item-title">
                  <div class="item-header">Name</div>
                  {{name}}
                </div>
              </div>
            </a>
          </li>
          <li>
            <a href="#" class="item-link item-content">
              <div class="item-media">
                <f7-icon ios="f7:envelope" aurora="f7:envelope" md="material:email"></f7-icon>
              </div>
              <div class="item-inner">
                <div class="item-title">
                  <div class="item-header">Email</div>
                  {{email}}
                </div>
              </div>
            </a>
          </li>
          <li>
            <a href="/update-password/" class="item-link item-content">
              <div class="item-media">
                <f7-icon ios="f7:lock" aurora="f7:lock" md="material:vpn_key"></f7-icon>
              </div>
              <div class="item-inner">
                <div class="item-title">
                  <div class="item-header">Password</div>
                  ********************
                </div>
                <div class="item-after">
                  <f7-icon ios="f7:pencil" aurora="f7:pencil" md="material:edit"></f7-icon>
                </div>
              </div>
            </a>
          </li>
          <li>
            <a href="/update-account/" class="item-link item-content">
              <div class="item-media">
                <f7-icon ios="f7:creditcard" aurora="f7:creditcard" md="material:payment"></f7-icon>
              </div>
              <div class="item-inner">
                <div class="item-title">
                  <div class="item-header">Bank Details</div>
                  {{bankName}}
                </div>
                <div class="item-after">
                  <f7-icon ios="f7:pencil" aurora="f7:pencil" md="material:edit"></f7-icon>
                </div>
              </div>
            </a>
          </li>
          <li>
            <a href="/update-profile/" class="item-link item-content">
              <div class="item-media">
                <f7-icon ios="f7:person_fill" aurora="f7:person_fill" md="material:accessibility"></f7-icon>
              </div>
              <div class="item-inner">
                <div class="item-title">
                  <div class="item-header">Personal Data</div>
                </div>
                <div class="item-after">
                  <f7-icon ios="f7:pencil" aurora="f7:pencil" md="material:edit"></f7-icon>
                </div>
              </div>
            </a>
          </li>
          <!--<li>
            <a href="#" class="item-link item-content">
              <div class="item-inner">
                <div class="item-title">
                  Logout
                </div>
              </div>
            </a>
          </li>-->
        </ul>
      </div>
    
    </f7-page-content>
  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';
import avatar from '../../images/user.png';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

let data;

export default {
    data() {
    return {
      logo,
      avatar,
      image: null,
      name: null,
      email: null,
      isBottom: true,
      properties: [],
      uid: null,
      bankName: null
    }
  },
  methods: {

    convertCurrency(value) {
        return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(value);
    },


    settings() {
        this.$f7router.navigate('/settings/');
    },

    contact() {
        this.$f7router.navigate('/contact/');
    },

    async getAccount() {
        try {
          firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "==", this.uid).get().then((snapshot) => {
            let results = snapshot.docs.map(doc => {
              this.userId = doc.id;
              this.user = doc.data();
            })

            this.bankName = this.user.bankName;
            this.AccName = this.user.bankAccountName;
            this.AccNumber = this.user.bankNumber;
            this.sortCode = this.user.bankSortCode;
            
          })
          
      } catch (err) {
        console.log(err);
      }
      return true;
      
    },

    async submitted() {
      try {
          firebase.firestore().collection("users").get().then((snapshot) =>{
            snapshot.docs.map(doc => {
              console.log(doc);
              console.log(doc.data());
            });
          })
          
      } catch (err) {
        console.log(err);
      }
  }
  },

  mounted(){
    firebase.auth().onAuthStateChanged(users => {
    if(users) {
        const user = firebase.auth().currentUser;
      let name, email, photoUrl, uid, emailVerified;

     if (user != null) {
      this.name = user.displayName;
      this.email = user.email;
      this.image = user.photoURL;
      // emailVerified = user.emailVerified;
      this.uid = user.uid;
    }else {
      this.$f7router.navigate('/login/');
    }
    }else {
        this.$f7router.navigate('/login/');
        console.log("User logged out");
    }
    this.getAccount();
});


  }
}
</script>

<style scoped>

  body {
        font-family: 'Montserrat', sans-serif;
    }

  .confirm {
    background: #fff;
    padding-top: 0px;

  }

  .block-strong {
    margin-bottom: 5px;
    margin-top: 3.8rem;
    padding-top: 10px;
    padding-bottom: 5px;
  }

  .block-strong::before, .block-strong::after{
    height: 0px;
    width: 0px;
  }

  .logo {
    object-fit: cover;
    width: 100%
  }

  .confirm--title {
    color: #2B3D4C;
    font-size: 1.1rem;
    font-weight: 550;
    text-align: center;
  }

  .user-image {
    align-items: center;
    background: #2B3D4C;
    display: flex;
    margin-bottom: 2.5rem;
    padding: 0.5rem 0 0rem 0;
    justify-content: center;
  }

  .user-image img {
    border-radius: 50%;
    height: 90px;
    width: 90px;
  }

  .setting-menu li {
    margin-bottom: 2rem;
  }

  .text {
    font-size: 0.9rem;
    font-weight: 350;
    margin-bottom: 1.5rem !important;
    padding-right: 35px;
  }

  .valid {
    color: #18BC46;
    display: block;
    font-size: 0.6rem;
    text-align: center;
  }

  .list {
    margin: 0px;
  }

  .list .item-content .item-inner .item-title{
    color: #2B3D4C;
  }

  .list .item-content .item-inner .item-input-wrap input {
    font-size: 1.6rem;
    padding-bottom: 1rem;
    text-align: center;
  }

  .list .item-content .item-inner .item-input-wrap::after{
    background-color: #2B3D4C;
  }

  .list ul::after, .list ul::before {
    height: 0px;
    width: 0px;
  }

  .terms {
    font-size: 0.8rem;
    font-weight: lighter;
    text-align: center;
  }

  .forgot-btn {
    color: #2B3D4C;
    font-size: 0.8rem;
    font-weight: 550;
    text-align: center;
    text-transform: capitalize;
  }

  .verify--btn {
    align-items: center;
    background: #2B3D4C;
    border-radius: 0px;
    color: #fff;
    height: 2.8rem;
    justify-content: center;
    margin: 2rem auto 1.5rem auto;
    width: 90%;
  }
</style>