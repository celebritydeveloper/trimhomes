<template>
  <f7-page name="Update Account">
  <f7-navbar class="home--nav" back-link="Update Account" back-link-show-text>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
    
    <f7-page-content class="register">
    <div class="user-image">
      <div class="dp">
        <img :src="avatar" class="user-image">
      </div>
      
    </div>
    <form @submit.prevent="updateAccount" no-store-data="true" class="list form-store-data" id="demo-form">
      <ul>
        <li class="item-content item-input">
          <country-select v-model="country" :country="country" placeholder="Select your banking Country" topCountry="GB" :countryName="true" :whiteList="['GB', 'NG', 'US']" />
      </li>
      <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Account Name</div>
            <div class="item-input-wrap">
              <input name="AccName" type="text" v-model="AccName">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Account Number</div>
            <div class="item-input-wrap">
              <input name="AccNumber" type="number" v-model="AccNumber" validate pattern="[0-9]*" data-error-message="Only numbers please!">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Bank Name</div>
            <div class="item-input-wrap">
              <input name="bankName" type="text" v-model="bankName" autocomplete="off">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Sort/Swift Code</div>
            <div class="item-input-wrap">
              <input name="sortCode" type="text" v-model="sortCode" autocomplete="off">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li>
          <f7-button fill large raised class="custom--btn" type="submit">Update Bank Account</f7-button>
        </li>
        
      </ul>
    </form>
    </f7-page-content>
  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';
import avatar from '../../images/user.png';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'
import 'firebase/auth';




const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

let pics;
export default {
  name: "Upload",
  data() {
    return {
      errors: [],
      logo,
      avatar,
      image: null,
      AccName: '',
      AccNumber: '',
      bankName: "",
      sortCode: "",
      country: "",
    }
  },
  mounted(){
    firebase.auth().onAuthStateChanged(users => {
      if(users) {
          const user = firebase.auth().currentUser;
        let displayName, email, photoUrl, uid, emailVerified;

      if (user != null) {
        this.image = user.photoURL;
        this.id = user.uid;
        console.log(this.id);
        this.getAccount();
      }else {
        this.$f7router.navigate('/login/');
      }
      }else {
          this.$f7router.navigate('/login/');
          console.log("User logged out");
      }
  });    

},


  methods: {

    previewImage(event) {
      this.uploadValue = 0;
      this.picture = null;
      this.imageData = event.target.files[0];
    },

    async getAccount() {
        try {
          firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "==", this.id).get().then((snapshot) => {
            let results = snapshot.docs.map(doc => {
              this.userId = doc.id;
              this.user = doc.data();
            })

            this.bankName = this.user.bankName;
            this.AccName = this.user.bankAccountName;
            this.AccNumber = this.user.bankNumber;
            this.sortCode = this.user.bankSortCode;
            this.country = this.user.country;
            
          })
          
      } catch (err) {
        console.log(err);
      }
      return true;
      
    },

    async updateAccount() {
      this.$f7.preloader.show();
      try {
              return firebase.firestore().collection("users").doc(this.id).update({
              bankName: this.bankName,
              bankAccountName: this.AccName,
              bankNumber: this.AccNumber,
              bankSortCode: this.sortCode,
          }).then(() => {
          this.$f7.preloader.hide();
          this.$f7.dialog.alert(`Your bank account details has been updated`, "Success");
        });
            
          
      } catch (err) {
        console.log(err);
      }

      this.errors = [];

      if (!this.fullName) {
        this.errors.push('Name required.');
      }
      if (!this.email) {
        this.errors.push('Age required.');
      }
    }
  },
  components: {},
};
</script>

<style scoped>

  body {
        font-family: 'Montserrat', sans-serif;
        overflow: hidden;
    }

    .navbar .navbar-bg {
        background: none !important;
        background-color: #2B3D4C !important;
        background-image: none !important;
        height: 0px;
    }

    .text-black {
        color: #000;
    }

  .register {
    background: #fff;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    padding-top: 0px;

  }

  .custom--btn {
    background: #2B3D4C;
    color: #fff;
    margin: 1rem auto 0 auto;
    width: 90%;
  }

  .image {
    background: #2B3D4C;
    margin-bottom: 2.5rem;
    padding: 1.5rem 0;
    text-align: center;
  }


  .dp {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .user {
    border-radius: 50%;
    height: 80px;
    object-fit: cover;
    width: 80px;
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

  .upload-text {
      color: #fff;
  }

  .upload::-webkit-file-upload-button {
    color: transparent;
    display: none;
  }

  /* The overlay effect (full height and width) - lays on top of the container and over the image */
.overlay {
  border-radius: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  width: 100px;
  opacity: 1;
  transition: .3s ease;
  background-color: rgba(0, 0, 0, 0.5);
}

.icon {
  color: white;
  font-size: 1.2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
  

  /* .upload::before {
    content: 'Upload a profile picture';
    display: inline-block;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
  } */

  .register--title {
    color: #2B3D4C;
    font-size: 1.1rem;
    font-weight: 550;
    text-align: center;
  }

  .list {
    margin: 0px;
  }

  .list .item-content .item-inner .item-title{
    color: #2B3D4C;
  }

  .list .item-content .item-inner .item-input-wrap::after{
    background-color: #2B3D4C;
  }

  .list ul::after, .list ul::before {
    height: 0px;
    width: 0px;
  }

  .list .image .item-inner{
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center !important;
    width: 100%;
  }

  .list .image .item-inner .item-input-wrap::after {
    height: 0px;
    width: 0px;
  }

  .terms {
    color: #2B3D4C;
    font-size: 0.6rem;
    font-weight: lighter;
    padding: 5px 90px 5px 20px;
  }

  .terms .forgot-btn {
    color: #2B3D4C;
    display: inline;
    font-size: 0.6rem;
    font-weight: 500;
    text-decoration: underline;
    text-transform: capitalize;
  }

  .register--btn {
    background: #2B3D4C;
    border-radius: 0px;
    color: #fff;
    margin: 1rem auto 0 auto;
    width: 90%;
  }

  .signup--btn {
    background: #fff;
    color: #2B3D4C;
    border: 1px solid #2B3D4C;
    border-radius: 0px;
    margin: 0 auto;
    width: 90%;
  }

  select {
    -webkit-appearance: menulist;
    appearance: menulist;
    -moz-appearance: menulist;
    border: 1px solid #2B3D4C;
    border-radius: 4px;
    margin-bottom: 1rem;
    margin-right: 1rem;
    padding: 0 1rem;
  }
</style>