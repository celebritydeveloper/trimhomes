<template>
  <f7-page class="home">
    <f7-navbar class="home--nav">
    <f7-nav-left>
        Trimhomes
      </f7-nav-left>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
    <f7-toolbar tabs labels :position="isBottom ? 'bottom' : 'top'">
      <f7-link tab-link="#tab-1" tab-link-active text="Home" icon-ios="f7:house_fill" icon-aurora="f7:house_fill" icon-md="material:home"></f7-link>
      <f7-link tab-link="#tab-2" text="Properties" icon-ios="f7:building_2_fill" icon-aurora="f7:building_2_fill" icon-md="material:local_offer"></f7-link>
      <f7-link tab-link="#tab-3" text="Portfolio" icon-ios="f7:briefcase" icon-aurora="f7:briefcase" icon-md="material:work"></f7-link>
      <f7-link tab-link="" raised panel-open="right" cover text="More" icon-ios="f7:bars" icon-aurora="f7:bars" icon-md="material:menu"></f7-link>
    </f7-toolbar>
<f7-panel class="panel" right resizable theme-dark>
    <f7-view>
      <f7-page>
        <f7-link class="panel-close" panel-close @click="homepage"><f7-icon ios="f7:close" aurora="f7:close" md="material:close"></f7-icon></f7-link>
        
        <f7-link class="panel-link" panel-close @click="settings">Settings</f7-link>
        <f7-link class="panel-link"  panel-close @click="contact" >Contact Us</f7-link>
        <f7-link class="panel-link" panel-close  @click="logout">Logout</f7-link>
      </f7-page>
    </f7-view>
  </f7-panel>

    <f7-page-content class="confirm">
    
    <f7-tabs>
      <f7-tab id="tab-1" class="page-conten" tab-active>
          <div class="top-bar">
            Welcome, {{name}}
          </div>
            <f7-card class="info-card">
              <f7-icon class="info-icon" ios="f7:building_2_fill" aurora="f7:building_2_fill" md="material:location_city"></f7-icon>
              <p class="info-title">Buy a property</p>
              <p class="info-text">Buy a buy-to-let investment property <br> Buy your first or next residential property <br> Buy a joint-venture property</p>
              <f7-button class="info-btn" tab-link="#tab-2">Start Here</f7-button>
            </f7-card>
            <f7-card class="info-card">
              <f7-icon class="info-icon" ios="f7:creditcard" aurora="f7:creditcard" md="material:credit_card"></f7-icon>
              <p class="info-title">Rent-purchase</p>
              <p class="info-text">Part-purchase any Trim Homes property and get a share of the rental income. 
                    You can purchase with any amount from as low as £500.</p>
              <f7-button class="info-btn" tab-link="#tab-2">Get Started</f7-button>
            </f7-card>
            <f7-card class="info-card">
              <f7-icon class="info-icon" ios="f7:person_circle" aurora="f7:person_circle" md="material:account_circle"></f7-icon>
              <p class="info-title">Update your details</p>
              <p class="info-text">Review and update your personal and contact information here.</p>
              <f7-button class="info-btn" href="/update-profile/">Update Now</f7-button>
            </f7-card>
      </f7-tab>
      <f7-tab id="tab-2" class="page-conten" name="Properties">
          <Project />
          
      </f7-tab>
      <f7-tab id="tab-3" class="page-conten" name="Portfolio">
        <div class="card card-outline user-card">
          <div class="card-header user-detail">
            <img :src="image" alt="" class="user-image">
            <p class="user-name">{{name}}</p>
            <p class="user-location"><f7-icon ios="f7:placemark" aurora="f7:placemark" md="material:location_on"></f7-icon> {{city}}, {{country}}</p>
          </div>
          <div class="card-content invest-list">
            <div class="invest-item">
              <p class="invest-amount">{{convertCurrency(total)}}</p>
              <p class="invest-title">Investment</p>
            </div>
            <div class="invest-item">
              <p class="invest-amount">{{convertCurrency(parseFloat(totalIncome))}}</p>
              <p class="invest-title">Monthly Income</p>
            </div>
          </div>
        </div>
        <f7-list  media-list class="listing">
        <f7-list-item
                    v-for="property in properties" 
                    :key="property.id"
                    class="listing-item"
                    :link="`/portfolioSingle/${property.id}`"
                    :title="`${property.data().propertName + ', ' + property.data().Location}`"
                    :text="`${convertCurrency(property.data().Amount) + ' - Invested Amount'}`"
                    icon-ios="f7:briefcase" icon-aurora="f7:briefcase" icon-md="material:work"
                >
                    <img slot="media" :src="property.data().image" height="80" width="80" />
                    <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
        </f7-list>
      </f7-tab>
    </f7-tabs>
    </f7-page-content>


  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';
import user from '../../images/user.png';
import home from '../../images/home.jpg';

import Project from '../../components/project';
import Portfolio from '../../components/portfolio';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

let data;

export default {
    data() {
    return {
      logo,
      user,
      home,
      name: null,
      isBottom: true,
      properties: [],
      name:  null,
      image: null,
      id: null,
      city: null,
      country: null,
      portfolioId: null,
      singlePortfolio: null,
      amount: null,
      total: null,
      paid:  null,
      income: null,
      totalIncome: null,
      propsId: null,
      userId: null,
      pay: null
    }
  },
   mounted(){
    firebase.auth().onAuthStateChanged(users => {
    if(users) {
        const user = firebase.auth().currentUser;
      let name, email, photoUrl, uid, emailVerified;

     if (user != null) {
      this.name = user.displayName;
      // email = user.email;
      this.image = user.photoURL;
      // emailVerified = user.emailVerified;
      this.id = user.uid;
    }else {
      this.$f7router.navigate('/login/');
    }
    }else {
        this.$f7router.navigate('/login/');
        console.log("User logged out");
    }

    this.getProfile();
    this.getInvestment();
});

    
    
    // axios.get('https://firestore.googleapis.com/v1/projects/trimhomesapp/databases/(default)/documents/properties')
    // .then((response) => data = response);
    // .then(() => this.properties.push(data))
    // .then(() => console.log(data))

    

  },
  methods: {

    convertCurrency(value) {
        return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(value);
    },

    logout() {
      firebase.auth().signOut().then(function() {
        this.$f7router.navigate('/login/');
      }).catch(function(error) {
        this.$f7.dialog.alert(error.message, "Error");
      });
    },

    homepage() {
        this.$f7router.navigate('/');
    },

    settings() {
        this.$f7router.navigate('/settings/');
    },

    contact() {
        this.$f7router.navigate('/contact/');
    },
    async getProfile() {
        try {
          firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "==", this.id).get().then((snapshot) => {
            let results = snapshot.docs.map(doc => {
              this.userId = doc.id;
              this.user = doc.data();
            });
            this.phone = this.user.phone;
            this.address = this.user.address
            this.memorableNumber = this.user.memorableNumber;
            this.city = this.user.city;
            this.country = this.user.country;
            this.zip = this.user.postalCode;
            
          })
          
      } catch (err) {
        console.log(err);
      }
      return true;
      
    },

    async getInvestment() {
        try {
          firebase.firestore().collection("portfolio").where("userId", "==", this.id).where("Requested", "==", false).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
              this.propsId = doc.data().propId;
              this.paid = doc.data().Amount;
              this.total += parseFloat(this.paid);
              this.income = doc.data().monthlyIncome;
              this.totalIncome += parseFloat(this.income);
              this.properties.push(doc);
                console.log(this.properties);
            });            

            });
          
      } catch (err) {
        console.log(err);
      }
      return true;
      
      },

      

  },
  components: {
    Project,
    Portfolio
  },

 
}
</script>


<style scoped>
    body {
        font-family: 'Montserrat', sans-serif;
    }

    .navbar-bg {
        background: none !important;
        background-color: #2B3D4C !important;
        background: #2B3D4C !important;
        background-image: none !important;
        height: 0px;
    }

    .home {
        background: #fff;
    }

    .confirm {
      padding-top: 0;
    }

    .top-bar {
      background: #E3E6E0;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.6rem 0;
      text-align: center;
    }

    .user-detail {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }



  .user-image {
    border-radius: 50%;
    height: 120px;
    width: 120px;
  }

  .user-name {
      color: #2B3D4C;
      font-size: 1.2rem;
      font-weight: bold;
      margin-bottom: 0;
      margin-top: 0.4rem;
      padding: 0;
    }

    .user-location {
      color: #2B3D4C;
      font-weight: lighter;
      margin-top: 0.4rem;
      padding: 0;
    }

    .invest-list {
      align-items: center;
      display: flex;
      justify-content: space-around;
      padding-bottom: 0.4rem;
      padding-top: 0.4rem;
    }

    .invest-item {
      text-align: center;
    }

    .invest-amount {
      color: #2B3D4C;
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0;
      padding: 0;
    }

    .invest-title {
      color: #2B3D4C;
      font-size: 1.2rem;
      margin-top: 0.1rem;
      margin-bottom: 0;
      padding: 0;
    }

    .listing {
        margin-top: 0;
        margin-bottom: 0.3rem;
    }

    .listing .listing-item {
        box-shadow: 0px 2px 8px rgb(220, 220, 220);
        margin-bottom: 0.3rem;
    }

    .listing img {
        object-fit: cover;
    }

    .listing title {
        font-size: 7rem;
    }

    .listing .listing-item .item-subtitle {
      display: none !important;
      background: blue;
    }

    .listing .listing-item .item-text {
      display: none !important;
      background: red;
    }

    .listing .listing-item .item-inner::after{
      height: 0px !important;
      width: 0;
    }

    .info-card {
      align-items: center;
      box-shadow: 0px 2px 8px rgb(220, 220, 220);
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0 0 0.3rem 0;
      padding: 1.3rem 0;
      width: 100%;
    }

    .info-title {
      color: #2B3D4C;
      font-size: 0.8rem;
      font-weight: 500;
      margin: 0.5rem 0 0 0.3rem;
      padding: 0;
    }

    .info-text {
      color: #2B3D4C;
      font-size: 0.8rem;
      font-weight: lighter;
      padding: 0 2rem;
      margin: 0;
      text-align: center;
    }

    .info-icon {
      color: #899CB2;
      font-size: 2.5rem;
    }

    .info-btn {
      background: #fff;
      border: 1px solid #2B3D4C;
      border-radius: 0;
      color: #06124E;
      font-weight: 350;
      padding: 0 1rem;
      text-transform: capitalize;
    }

    .panel-backdrop-in {
      background-color: #2B3D4C; 
    }

    .panel {
      background-color: #2B3D4C;
      height: 91vh;
      width: 100%;
    }

    .panel-close {
      color: #fff;
      display: block;
      font-size: 1.5rem;
      margin: 2rem 2rem 5rem 2rem;
    }

    .panel-link {
      color: #fff;
      border-bottom: 2px solid #fff;
      display: block;
      font-size: 1rem;
      margin: 0 2rem 2rem 2rem;
      padding: 0 0 0.5rem 0.5rem;
    }
</style>
