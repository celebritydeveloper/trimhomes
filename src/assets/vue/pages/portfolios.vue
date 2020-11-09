<template>
  <f7-page name="portfolios" ptr @ptr:refresh="loadMore" @ptr:pullend="clearPortfolio">
      <f7-navbar>
        <f7-nav-left>
          <f7-nav-title>My Portfolio</f7-nav-title>
        </f7-nav-left>
        
        <f7-nav-right>
          <img :src="logo" class="logo">
        </f7-nav-right>
      </f7-navbar>
        <f7-block v-if="active">
            <f7-list media-list class="portfolio-list">
            <f7-list-item
                v-for="(portfolio, index) in portfolios" 
                :key="index"
                class="listing-item"
                :link="`/portfolio/${portfolio.id}/`"
                :title="`${portfolio.data().propertName + ', ' + portfolio.data().Location}`"
                :subtitle="`${convertCurrency(portfolio.data().Amount) + ' - Payment Amount'}`"
                :text="`${convertCurrency(portfolio.data().totalIncome) + ' - Total Income To Date'}`"
                icon-ios="f7:briefcase" icon-aurora="f7:briefcase" icon-md="material:work"
            >
                <img slot="media" :src="portfolio.data().image" height="80" width="80" />
                <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
          </f7-list>
        </f7-block>

        <f7-block v-else class="text-center none">
          <div class="text-center">
            <img :src="wallet" class="begin-img" alt="">
            <p>You currently have no active portfolio</p>
            <f7-button fill raised class="primary--btn" href="/properties/">Earn Rental Income</f7-button>
          </div>
        </f7-block>
        

  </f7-page>
  
</template>

<script>
import logo from '../../images/logo-nav.png';
import wallet from '../../images/step3.svg';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


export default {
    data() {
    return {
      logo,
      wallet,
      portfolios: [],
      name: null,
      propsId: null,
      paid: null,
      id: null,
    }
  },

    mounted() {      
        firebase.auth().onAuthStateChanged(users => {
            if(users) {
                this.user = firebase.auth().currentUser;
            let name, email, photoUrl, uid, emailVerified;

            if (this.user != null) {
                this.name = this.user.displayName;
                // email = user.email;
                this.image = this.user.photoURL;
                // emailVerified = user.emailVerified;
                this.id = this.user.uid;
                this.getPortfolio();
            }else {
                this.$f7.dialog.alert("You are logged out.", "Logged Out");
            }
            }else {
                this.$f7.dialog.alert("You are logged out.", "Logged Out");
                console.log("User logged out");
            }
        });       
    },
    computed: {
      active: function() {
        if (this.portfolios.length === 0) {
          return false  
        }else {
          return true
        }
      },
    },


    methods: {
      convertCurrency(value) {
        return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(value);
      },
      loadMore(done) {
        this.getPortfolio();
        if(done()) {
          let toastBottom = this.$f7.toast.create({
            text: 'Portfolio Updated',
            closeTimeout: 1500,
            position: 'bottom',
          });
          toastBottom.open();
        }
        done();
      },

      clearPortfolio() {
        this.portfolios = [];
      },

      async getPortfolio() {
        try {
          firebase.firestore().collection("portfolio").where("userId", "==", this.id).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                this.portfolios.push(doc);
            });
        });
      } catch (err) {
        console.log(err);
      }
        return true;
      },

    }
}
</script>

<style scoped>
  .text-center {
    text-align: center;
  }

  .block {
    padding: 0;
  }


  .begin-img {
    object-fit: cover;
    width: 50%;
  }
  .primary--btn {
      background: #0d919b;
      color: #fff;
      margin: 0 auto;
      margin-top: 0.4rem;
      width: 60%;
  }
</style>
