<template>
  <f7-page name="home">
    <!-- Top Navbar -->
    <f7-navbar>
      <f7-nav-left>
        <f7-nav-title>Trim Homes</f7-nav-title>
      </f7-nav-left>
      
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>

    <!-- Page content-->
    <f7-page-content class="confirm">
      <div class="top-bar">
            Welcome, {{name}}
          </div>
            <f7-card class="info-card">
              <f7-icon class="info-icon" ios="f7:building_2_fill" aurora="f7:building_2_fill" md="material:location_city"></f7-icon>
              <p class="info-title">Buy a Property</p>
              <p class="info-text">Buy a buy-to-let property <br> Buy your first or next residential property <br> Buy a joint-venture property</p>
              <f7-button fill raised class="primary--btn" name="properties" href="/properties/">Start Here</f7-button>
            </f7-card>
            <f7-card class="info-card">
              <f7-icon class="info-icon" ios="f7:creditcard" aurora="f7:creditcard" md="material:credit_card"></f7-icon>
              <p class="info-title">Rental Income</p>
              <p class="info-text">Earn rental income on any Trim Homes property and get a share of the rental income. 
                    You can purchase with any amount from as low as £500.</p>
              <f7-button fill raised class="primary--btn" name="properties" href="/properties/">Get Started</f7-button>
            </f7-card>
            <f7-card class="info-card">
              <f7-icon class="info-icon" ios="f7:person_circle" aurora="f7:person_circle" md="material:account_circle"></f7-icon>
              <p class="info-title">Update Your Details</p>
              <p class="info-text">Review and update your personal and contact information here.</p>
              <f7-button fill raised class="primary--btn" href="/settings/">Update Now</f7-button>
            </f7-card>
    </f7-page-content>

    <f7-login-screen id="my-login-screen" :opened="loginScreenOpened" @loginscreen:closed="loginScreenOpened = false">
      <f7-view>
        <f7-page login-screen>
          <div class="block block-strong">
            <img :src="loginLogo" class="logo">
            <p>Welcome to our exclusive collection of project and contributor community, where we pool resources to achieve our goals.</p>
            <f7-block-title class="login--title">Login</f7-block-title>
          </div>
          <form @submit.prevent="loginUser" no-store-data="true" class="list form-store-data" id="demo-form">
            <ul>
              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">E-mail</div>
                  <div class="item-input-wrap">
                    <input name="email" type="email" v-model="email">
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>
              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Memorable Number</div>
                  <div class="item-input-wrap">
                    <input name="mom" type="number" v-model="mom">
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>
              <li class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Password</div>
                  <div class="item-input-wrap">
                    <input name="password" type="password" v-model="password">
                    <span class="input-clear-button"></span>
                  </div>
                </div>
              </li>
              <li>
                <f7-button class="forgot-btn" href="/forgot-password/">Forgot password?</f7-button>
                <f7-button fill raised class="signup--btn" type="submit">Sign In</f7-button>
              </li>
              
            </ul>
          </form>
          <div>
            <f7-block-title class="login--title">New user?</f7-block-title>
            <f7-button fill raised large class="login--btn" href="/register/">Sign Up</f7-button>
            <p class="small-text">Not ready to create an account? You can just make an enquiry to find out more about Trim Homes and what's on offer at the moment.</p>
            <f7-button fill raised large href="/contact/" class="login--btn">Make Enquiry</f7-button>
          </div>



        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-page>
</template>

<script>
import logo from '../../images/logo-nav.png';
import loginLogo from '../../images/logo-small.png';
import user from '../../images/user.png';
// import home from '../../images/home.jpg';


import * as firebase from 'firebase/app';
import 'firebase/firestore';

let data;

export default {
    data() {
    return {
      loginScreenOpened: false,
      logo,
      loginLogo,
      user,
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
      pay: null,
      email: '',
      password: '',
      mom: '',
      number: null
    }
  },
   mounted(){
    firebase.auth().onAuthStateChanged(users => {
    if(users) {
        const user = firebase.auth().currentUser;
      let name, email, photoUrl, uid, emailVerified;

     if (user != null) {
      this.name = user.displayName.split(' ').slice(0, -1).join(' ');
      // email = user.email;
      this.image = user.photoURL;
      // emailVerified = user.emailVerified;
      this.id = user.uid;
    }else {
      this.loginScreenOpened = true;
    }
    }else {
        this.loginScreenOpened = true;
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
    openProperties() {
      //this.$f7router.view('/properties/');
      //console.log(this.$f7router.view);
      this.$f7views.get('#view-properties')
    },

    convertCurrency(value) {
        return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(value);
    },

    logout() {
      firebase.auth().signOut().then(function() {
        this.$f7router.navigate('/');
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
            });            

            });
          
      } catch (err) {
        console.log(err);
      }
      return true;
      
      },

      

  },
}
</script>

<style scoped>
  body {
        font-family: 'Montserrat', sans-serif;
    }
    .confirm {
      padding-top: 0;
    }
  .top-bar {
      background: #0d919b;
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.6rem 0;
      text-align: center;
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


    .primary--btn {
      background:#2B3D4C;
      color: #fff;
      margin-top: 0.4rem;
    }





    .login {
    background: #fff;
    padding-top: 0px;
    padding-left: 20px;
    padding-right: 20px;

  }

  .block-strong {
    margin-bottom: 5px;
    margin-top: 15px;
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

  .login--title {
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

  .forgot-btn {
    color: #2B3D4C;
    font-size: 0.8rem;
    font-weight: lighter;
    text-transform: capitalize;
  }

  .login--btn {
    background: #2B3D4C;
    color: #fff;
    margin: 0 auto;
    width: 80%;
  }

  .signup--btn {
    background: #fff;
    color: #2B3D4C;
    border: 1px solid #2B3D4C;
    margin: 0 auto;
    width: 80%;
  }

  .small-text {
    color:  #2B3D4C;
    font-size: 0.8rem;
    padding: 0 1rem;
  }
</style>