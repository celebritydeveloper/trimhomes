<template>
  <f7-page class="home" name="property"  ptr @ptr:refresh="loadMore" @ptr:pullend="clearProperty">
    <f7-navbar class="home--nav" :back-link="currentProperty.Title" back-link-show-text>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>

    <f7-page-content class="confirm">

        <f7-swiper pagination>
            <f7-swiper-slide class="slide-img"><img :src="currentProperty.image"></f7-swiper-slide>
        </f7-swiper>

        <div class="project-top price">
            <p class="project-type">
                {{currentProperty.Title}}
                <!--<span class="project-location" v-for="(location, index) in currentProperty.Location" :key="index">
                  {{currentProperty.Location}},
                  </span>-->
                  <span class="project-location">
                  {{currentProperty.Location}}
                  </span>
            </p>
            <p class="project-type text-right">
              12%
              <span class="project-location">Annual Return</span>
            </p>
        </div>

        <f7-block class="project-icons">
        <f7-row>
            <f7-col v-for="(icon, index) in currentProperty.Amenities" :key="index">
                <f7-card class="info-card">
                    <f7-icon class="info-icon" ios="f7:checkmark_seal" aurora="f7:checkmark_seal" md="material:grade"></f7-icon>
                    <p class="info-text">{{icon}}</p>
                </f7-card>
            </f7-col>
        </f7-row>
        </f7-block>

         <f7-block class="project-info-block">
             <div class="project-info">
               <div class="price">
                 <p class="project-info-title">Buy Outright</p>
                 <p class="project-price" v-if="currentProperty.Sold === true">Sold Out</p>
                 <p class="project-price" v-else>{{convertCurrency(currentProperty.Outright)}}</p>
               </div>
                <p class="project-info-text">Acquire full ownership of this property and increase your net worth, asset base and income streams permanently.</p>
                  <f7-button @click="makeOutright" :disabled="currentProperty.Sold === true" class="outright--btn">Buy Outright</f7-button>
            </div>
            <div class="project-info">
              <div class="price">
                <p class="project-info-title">Earn Rental Income</p>
                <p class="project-price" v-if="(max - value) == 0 || (max - value) < 500 ">Sold Out </p>
                <p class="project-price" v-else>{{convertCurrency(currentProperty.PartPrice)}}</p>
              </div>
                <p class="project-info-text">Pay any amount from £500.00 towards the rental income scheme on this property and earn 1% of your payment each month in rent.</p>

                    <div class="mt-1">
                      <f7-progressbar :progress="(value / max) * 100" id="demo-inline-progressbar"></f7-progressbar>
                      <span>{{convertCurrency(max - value)}} of {{convertCurrency(max)}} remaining</span>
                    </div>
                  <f7-button class="part--btn" :disabled="(max - value) == 0 || (max - value) < 500" @click="makePayment">Earn Rental Income</f7-button>
                  <p class="text-left action-note" v-if="(max - value) == 0 || (max - value) < 500">Out of the rental scheme quota of {{convertCurrency(currentProperty.PartPrice)}}, {{convertCurrency(value)}} is paid for. This property is now <b>sold out</b></p>
                  <p class="text-left action-note" v-else>Out of the rental scheme quota of {{convertCurrency(currentProperty.PartPrice)}}, {{convertCurrency(value)}} is paid for. You can pay any amount from £500 to {{convertCurrency(max - value)}} to join this property scheme.</p>
                
            </div>
        </f7-block>

        <!-- Swipe to close demo sheet 
        <f7-sheet ref="actionsOneGroup"
            class="demo-sheet-swipe-to-close"
            style="height:auto; --f7-sheet-bg-color: #fff;"
            swipe-to-close
            backdrop
            >
            <f7-page-content>
                <f7-block>
                  <p class="request-title">How much do you want to pay?</p>
                <form @submit.prevent="makeRequest" no-store-data="true" class="list form-store-data" id="demo-form">
                  <ul>
                    <li class="item-content item-input">
                      <div class="item-inner">
                        <div class="item-input-wrap">
                          <input name="amount" type="number" v-model="amount" placeholder="Enter Amount">
                          <span class="input-clear-button"></span>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <p class="text-center valid" v-if="msg.amount" :class="valid">{{msg.amount}}</p>
                  <p class="request-income">Your Monthly Rental Income:
                    <span>£{{ getPercent()  + '%'}}</span>
                  </p>
                  <p class="request-info">Based on your purchase amount entered above, your monthly rental income of <strong>£{{ getPercent()  + '%'}}</strong> will be paid on the last day of next month.</p>

                  <f7-button fill large raised class="custom--btn" type="submit" :disabled="amount > (max - value) || amount < 500 ">Proceed to Payment</f7-button>
                </form>
                </f7-block>
            </f7-page-content>
        </f7-sheet>-->
        
    </f7-page-content>


  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';
// import home from '../../images/home.jpg';
// import slide from '../../images/props.jpg';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

let userId;
let userInfo;
let userName;
let data;

export default {
  data: function() {
    return {
      logo,
      amount: '',
      isBottom: true,
      properties: [],
      currentProperty: {},
      userName,
      propId: null,
      userId: null,
      user: null,
      property: null,
      name: null,
      email: null,
      phone: null,
      valid: null,
      msg: [],
      price: null,
      value: null,
      max: null,
    }
  },
  mounted() {
    //$refs.actionsOneGroup.open()
    if (localStorage.getItem('trimhomeUser'));
    userInfo = JSON.parse(localStorage.getItem('trimhomesUser'));

    firebase.auth().onAuthStateChanged(user => {
      if(user) {
          const user = firebase.auth().currentUser;
        let name, displayName, email, photoUrl, uid, emailVerified;

      if (user != null) {
        this.name = user.displayName;
        this.email = user.email;
        this.id = user.uid;
        this.fetchByParam();
        this.getAccount();
        this.getTotalContribution();
      }else {
        this.$f7router.navigate('/');
      }
      }else {
          console.log("User logged out");
        this.$f7router.navigate('/');
      }
    });
  },
  watch: {
    amount(value){
      // binding this to the data value in the email input
      this.amount = value;
      this.validateAmount(value);
    }
  },
  computed: {
    getParam() {
      return this.$f7route.params.id;
    }
  },
  methods: {
    validateAmount(value){
      if (value < 500) {
        this.msg['amount'] = 'Payment amount cannot be less than £500';
        this.valid = "amount-error";
      } else if (value > (this.max - this.value)) {
        this.msg['amount'] = `Payment amount cannot be greater than £${this.max - this.value}`;
        this.valid = "amount-error";
      } else if (!/^[0-9]*$/.test(value)) {
        this.msg['amount'] = 'Must contain only number';
        this.valid = "amount-error";
      } else {
        this.msg['amount'] = 'Great! This looks good.';
        this.valid = "amount-success";
      }
    },
    loadMore(done) {
      this.fetchByParam();
      this.getAccount();
      this.getTotalContribution();
      let toastBottom = this.$f7.toast.create({
        text: 'Property Updated',
        closeTimeout: 1500,
        position: 'bottom',
      });
      toastBottom.open();
      done();
    },
    clearProperty() {
      this.currentProperty = {};
      this.value = "";
      this.user = "";
    },
    makePayment() {
      setTimeout(() => {
        localStorage.setItem('trimhomesProperty', JSON.stringify(this.currentProperty));
        localStorage.setItem('trimhomesPropertyId', JSON.stringify(this.userId));
      }, 500);
      this.$f7router.navigate(`/payment/${this.userId}/`);
      console.log("Yes");
    },
    async getAccount() {
      try {
        firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "==", this.id).get().then((snapshot) => {
          let results = snapshot.docs.map(doc => {
            this.propId = doc.id;
            this.user = doc.data();
        });
          this.phone = this.user.phone;
        });     
      } catch (err) {
        console.log(err);
      }
      return true;  
    },

    getPercent() {
      return Number(parseInt(this.amount) * 100 / parseInt(this.currentProperty.PartPrice));
    },

    async getTotalContribution() {
        try {
            firebase.firestore().collection("contributions").where(firebase.firestore.FieldPath.documentId(), "==", this.getParam).get().then((snapshot) => {
            let result = snapshot.docs.map(doc => {
              this.value = doc.data().amount;
            });
        });
        } catch (error) {
          this.$f7.preloader.hide();
          this.$f7.dialog.alert(error + "Please refresh the page to try again", "Error");
        }
      },

    fetchByParam() {
      firebase.firestore().collection("properties").where(firebase.firestore.FieldPath.documentId(), "==", this.getParam).get().then((snapshot) => {
        let results = snapshot.docs.map(doc => {
          this.userId = doc.id;
          this.property = doc.data();
        });
          this.currentProperty = this.property;
          this.max = this.currentProperty.PartPrice;
      })
    },
    convertCurrency(value) {
      return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(value);
    },

    async makeOutright() {
      this.$f7.preloader.show();
      try {
        const outrightProperty = {
              ref: this.userId,
              propertyName: this.currentProperty.Title,
              location: this.currentProperty.Location,
              outright: this.currentProperty.Outright,
              partPrice: this.currentProperty.PartPrice,
              amount: this.amount,
              image: this.currentProperty.image,
          }
        localStorage.setItem('outrightProperty', JSON.stringify(outrightProperty))
          this.$f7.preloader.hide();
          this.$f7router.navigate("/outright-payment/");
        
      }  catch (error) {
        console.log(error);
        this.$f7.dialog.alert(error.message, "Error");
      }
    },

    async makeRequest() {
        this.$f7.preloader.show();
        try {
          if(this.amount.trim() !== "" && this.amount > 0) {
            const user = firebase.auth().currentUser;
          if(user != null) {
            this.userName = user.displayName;
            this.emailAddress = user.email;
            firebase.firestore().collection("Requests").add({
              userId: this.id,
              propId: this.userId,
              Name: this.userName,
              Email: this.emailAddress,
              Amount: this.amount,
              image: this.currentProperty.image,
              monthlyIncome: this.getPercent(),
              totalIncome: 0,
              Paid: false,
              Date: new Date()
            }).then(() => {
              firebase.firestore().collection("portfolio").add({
              userId: this.userUid,
              propId: this.userId,
              Name: this.userName,
              Email: this.emailAddress,
              Amount: this.amount,
              monthlyIncome: this.getPercent(),
              image: this.currentProperty.image,
              propertName: this.currentProperty.Title,
              Location: this.currentProperty.Location,
              totalIncome: 0,
              Paid: false,
              Date: new Date()
            });
            }).then(() => {
              const userProperty = {
              ref: this.userId,
              propertyName: this.currentProperty.Title,
              location: this.currentProperty.Location,
              outright: this.currentProperty.Outright,
              partPrice: this.currentProperty.PartPrice,
              amount: this.amount,
            }
            localStorage.setItem('userProperty', JSON.stringify(userProperty));

            }).then(() => {
              Email.send({
                secureToken: "6d7fcff4-680b-48bd-a69c-43f92f919962",
                Host : "smtp.elasticemail.com",
                Username : "mail@trimhomes.co.uk",
                Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
                To : this.emailAddress,
                From : "mail@trimhomes.co.uk",
                Subject : "TrimHomes - Investment Request",
                Body : `
                <!doctype html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>TrimHomes Welcome Email</title>
                    <style>
                    /* -------------------------------------
                        INLINED WITH htmlemail.io/inline
                    ------------------------------------- */
                    /* -------------------------------------
                        RESPONSIVE AND MOBILE FRIENDLY STYLES
                    ------------------------------------- */
                    @media only screen and (max-width: 620px) {
                      table[class=body] h1 {
                        font-size: 28px !important;
                        margin-bottom: 10px !important;
                      }
                      table[class=body] p,
                            table[class=body] ul,
                            table[class=body] ol,
                            table[class=body] td,
                            table[class=body] span,
                            table[class=body] a {
                        font-size: 16px !important;
                      }
                      table[class=body] .wrapper,
                            table[class=body] .article {
                        padding: 10px !important;
                      }
                      table[class=body] .content {
                        padding: 0 !important;
                      }
                      table[class=body] .container {
                        padding: 0 !important;
                        width: 100% !important;
                      }
                      table[class=body] .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important;
                      }
                      table[class=body] .btn table {
                        width: 100% !important;
                      }
                      table[class=body] .btn a {
                        width: 100% !important;
                      }
                      table[class=body] .img-responsive {
                        height: auto !important;
                        max-width: 100% !important;
                        width: auto !important;
                      }
                    }

                    /* -------------------------------------
                        PRESERVE THESE STYLES IN THE HEAD
                    ------------------------------------- */
                    @media all {
                      .ExternalClass {
                        width: 100%;
                      }
                      .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                        line-height: 100%;
                      }
                      .apple-link a {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        text-decoration: none !important;
                      }
                      #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                      }
                      .btn-primary table td:hover {
                        background-color: #34495e !important;
                      }
                      .btn-primary a:hover {
                        background-color: #34495e !important;
                        border-color: #34495e !important;
                      }
                    }
                    </style>
                  </head>
                  <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                          <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                            <!-- START CENTERED WHITE CONTAINER -->
                            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                              <!-- START MAIN CONTENT AREA -->
                              <tr>
                                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                    <tr>
                                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                      <p style="background: #2B3D4C; padding: 0.2rem 0; text-align: center;"><img src="https://lirp-cdn.multiscreensite.com/7e157610/dms3rep/multi/opt/3-68f7e3f4-218w.png" style="width: 120px;"></p>
                                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ${this.userName}</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thank you so much for your interest to invest <strong>£${this.amount}</strong> in our property.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you made payment via our bank account, wait for an hour or two for Admin to verify your payment but if you paid via our Paypal channel then your payment will be automatically reflected on your portfolio page.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thank you for you business.</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Title}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Location}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Part-Purchase Price:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.PartPrice}</p>
                                       
                                       
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                            <!-- END MAIN CONTENT AREA -->
                            </table>

                            <!-- START FOOTER -->
                            <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">12 Streatham Place, Bradwell Common, Milton Keynes, England MK13 8RG</span>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <!-- END FOOTER -->

                          <!-- END CENTERED WHITE CONTAINER -->
                          </div>
                        </td>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                      </tr>
                    </table>
                  </body>
                </html>
                `
            }).then(
              message => console.log(message)
            );
            }).then(() => {
              Email.send({
                secureToken: "6d7fcff4-680b-48bd-a69c-43f92f919962",
                Host : "smtp.elasticemail.com",
                Username : "mail@trimhomes.co.uk",
                Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
                To : "mail@trimhomes.co.uk",
                From : "mail@trimhomes.co.uk",
                Subject : "TrimHomes - Investment Request",
                Body : `
                <!doctype html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>Request Email</title>
                    <style>
                    /* -------------------------------------
                        INLINED WITH htmlemail.io/inline
                    ------------------------------------- */
                    /* -------------------------------------
                        RESPONSIVE AND MOBILE FRIENDLY STYLES
                    ------------------------------------- */
                    @media only screen and (max-width: 620px) {
                      table[class=body] h1 {
                        font-size: 28px !important;
                        margin-bottom: 10px !important;
                      }
                      table[class=body] p,
                            table[class=body] ul,
                            table[class=body] ol,
                            table[class=body] td,
                            table[class=body] span,
                            table[class=body] a {
                        font-size: 16px !important;
                      }
                      table[class=body] .wrapper,
                            table[class=body] .article {
                        padding: 10px !important;
                      }
                      table[class=body] .content {
                        padding: 0 !important;
                      }
                      table[class=body] .container {
                        padding: 0 !important;
                        width: 100% !important;
                      }
                      table[class=body] .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important;
                      }
                      table[class=body] .btn table {
                        width: 100% !important;
                      }
                      table[class=body] .btn a {
                        width: 100% !important;
                      }
                      table[class=body] .img-responsive {
                        height: auto !important;
                        max-width: 100% !important;
                        width: auto !important;
                      }
                    }

                    /* -------------------------------------
                        PRESERVE THESE STYLES IN THE HEAD
                    ------------------------------------- */
                    @media all {
                      .ExternalClass {
                        width: 100%;
                      }
                      .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                        line-height: 100%;
                      }
                      .apple-link a {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        text-decoration: none !important;
                      }
                      #MessageViewBody a {
                        color: inherit;
                        text-decoration: none;
                        font-size: inherit;
                        font-family: inherit;
                        font-weight: inherit;
                        line-height: inherit;
                      }
                      .btn-primary table td:hover {
                        background-color: #34495e !important;
                      }
                      .btn-primary a:hover {
                        background-color: #34495e !important;
                        border-color: #34495e !important;
                      }
                    }
                    </style>
                  </head>
                  <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                          <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

                            <!-- START CENTERED WHITE CONTAINER -->
                            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

                              <!-- START MAIN CONTENT AREA -->
                              <tr>
                                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                    <tr>
                                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                      <p style="background: #2B3D4C; padding: 0.2rem 0; text-align: center;"><img src="https://lirp-cdn.multiscreensite.com/7e157610/dms3rep/multi/opt/3-68f7e3f4-218w.png" style="width: 120px;"></p>
                                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, Timi</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>${this.userName}</strong> has just requested to invested <strong>£${this.amount}</strong>. Here is their Email Address <strong>${this.emailAddress}</strong></p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Title}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Location}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Part-Purchase Price:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.PartPrice}</p>
                                       
                                       
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                            <!-- END MAIN CONTENT AREA -->
                            </table>

                            <!-- START FOOTER -->
                            <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                <tr>
                                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">12 Streatham Place, Bradwell Common, Milton Keynes, England MK13 8RG</span>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            <!-- END FOOTER -->

                          <!-- END CENTERED WHITE CONTAINER -->
                          </div>
                        </td>
                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                      </tr>
                    </table>
                  </body>
                </html>
                `
            }).then(
              message => console.log(message)
            );
            this.$f7.dialog.alert(`Your request was registered, please make payment to confirm your investment!`, "Success");
            this.$refs.actionsOneGroup.close();
            this.$f7router.navigate('/payment-detail/');
            }).then(() => {
            this.$f7.preloader.hide();
          });
          }else {
            this.$f7.preloader.hide();
            this.$f7.dialog.alert(`You are not a registered user`, "Error");
            this.$f7router.navigate('/register/');
          }
          }else {
            this.$f7.preloader.hide();
            this.$f7.dialog.alert(`Amount must not be empty of less than $1`, "Error");
          }
          
            
          
      } catch (error) {
        console.log(error);
        this.$f7.preloader.hide();
        this.$f7.dialog.alert(error.message, "Error");
      }
      return true;
      
    },
  },
};
</script>


<style scoped>
    body {
        font-family: 'Montserrat', sans-serif;
    }

    .home .navbar .navbar-bg {
        background: none !important;
        background-color: #2B3D4C !important;
        background: #2B3D4C !important;
        background-image: none !important;
        height: 0px;
    }

    .home {
        background: #fff;
    }

    .mt-1 {
      margin-top: 0.7rem;
    }

    .custom--btn {
    background: #2B3D4C;
    color: #fff;
    margin: 1rem auto 0 auto;
    width: 90%;
  }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .amount-error {
      color: red;
      font-size: 0.7rem;
      margin: 0;
      padding: 0;
    }

    .amount-success {
      color: green;
      font-size: 0.7rem;
      margin: 0;
      padding: 0;
    }

    .confirm {
      padding-top: 0;
    }

    .slide-img {
        height: 280px;
        width: 100%;
    }

    .slide-img img{
        object-fit: cover;
        width: 100%;
    }

    .project-top {
        align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
    }

    .project-type {
        display: flex;
        color: #2B3D4C;;
        flex-direction: column;
        font-size:1.5rem;
        font-weight: 500;
        margin-top: 0.2rem;
    }

    .project-type span {
      color: #2B3D4C;;
      font-size: 1.1rem;
      font-weight: lighter;
    }

    .project-location {
      display: flex !important;
      flex-direction: row !important;
      font-size: 1.3rem;
    }

    .project-price {
        color: rgb(43, 61, 76);
        border-radius: 0.3rem;
        font-size: 0.9rem !important;
        font-weight: bold !important;
        text-align: center;
    }

    .project-icons {
        margin: 0.3rem 0 0.3rem 0;
    }

    .project-info-block {
        margin: 2.2rem 0 0.2rem 0;
    }

    .project-info {
        margin-bottom: 0.8rem;
    }

    .project-info-title {
        color: #2B3D4C;
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
        padding: 0;
    }

    .project-info-text {
        color: #2B3D4C;
        display: inline;
        font-size: 0.7rem;
        margin: 0;
        padding: 0;
    }

    .price {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }

    .action-note {
      color: #7E93AB;
      font-size: 0.9rem;
    }

    .request-title {
      font-size: 1.2rem;
      font-weight: bold;
      text-align: center;
    }

    .request-income {
      align-items: center;
      display: flex;
      flex-direction: column;
    }

    .request-income span {
      background: rgba(7, 153, 144, 0.4);
      border-radius: 10px;
      display: block;
      font-size: 1.1rem;
      margin: 0 auto;
      padding: 0.2rem 1rem;
      text-align: center;
      width: 30%;
    }

    .request-info {
      font-size: 0.9rem;
      text-align: center;
    }

    .inline {
      display: inline;
    }

    .listing {
        color: red;
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

    .listing .listing-item .item-inner::after{
      height: 0px !important;
      width: 0;
    }

    .info-card {
      align-items: center;
      border: 1px solid #2B3D4C;
      border-radius: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0;
      padding: 0.5rem 0;
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
      padding: 0 0.2rem;
      margin: 0;
      text-align: center;
    }

    .info-icon {
      color: #899CB2;
      font-size: 2rem;
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

    .outright--btn {
    background: #2B3D4C;
    background: #0d919b;
    color: #fff;
    margin-top: 0.7rem;
    width: 50%;
  }

  .part--btn {
    background: #2B3D4C;
    color: #fff;
    margin-top: 0.7rem;
    width: 60%;
  }

  .inactive-register--btn {
    background: #d6d6d6;
    border-radius: 0px;
    color: rgb(99, 99, 99);
    font-weight: 500;
    padding: 0.5rem 0.7rem;
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

  .text {
    font-size: 0.9rem;
    font-weight: 350;
    margin-bottom: 1.5rem !important;
    padding-right: 35px;
  }

  .list {
    margin: 0;
  }

  .list .item-content .item-inner .item-title{
    color: #2B3D4C;
  }

  .list .item-content .item-inner .item-input-wrap input {
    font-size: 1.5rem;
    padding-bottom: 0rem;
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
    display: flex;
    height: 2.6rem;
    justify-content: center;
    margin: 2rem auto 1.5rem auto;
    width: 90%;
  }

  .demo-sheet-swipe-to-close {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
</style>
