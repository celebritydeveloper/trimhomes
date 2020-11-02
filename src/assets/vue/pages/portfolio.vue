<template>
  <f7-page class="portfolio" ptr @ptr:refresh="loadMore" @ptr:pullend="clearPortfolio">
    <f7-navbar class="home--nav">
    <f7-navbar :back-link="currentProperty.propertName" back-link-show-text></f7-navbar>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>


    <f7-page-content class="confirm">
        <f7-row class="mt-1">
          <f7-col>
            <p class="m-0">{{currentProperty.propertName}}</p>
            <p class="m-0">{{currentProperty.Location}}</p>
          </f7-col>
          <f7-col>
            <p class="m-0 text-center">{{percentage}}%</p>
            <p class="m-0 text-center">ROI</p>
          </f7-col>
          <f7-col>
            <p class="h2 m-0 text-right" v-if="days < 2">{{this.days}} Day In </p>
            <p class="h2 m-0 text-right" v-else>{{this.days}} Days In </p>
            <p class="m-0 text-right">JOINED {{day + " " + month + " " + year}}</p>
          </f7-col>
        </f7-row>
        <f7-swiper pagination>
            <f7-swiper-slide class="slide-img"><img :src="currentProperty.image"></f7-swiper-slide>
        </f7-swiper>


         <f7-block class="project-info-block">
           <div class="project-info">
             <p class="project-info-title price"><span><f7-icon class="info-icon" ios="f7:checkmark_alt_circle" aurora="f7:checkmark_alt_circle" md="material:check_circle_outline"></f7-icon> Total Payment: </span> <span>{{convertCurrency(currentProperty.Amount)}}</span></p>
             <p class="m-0">This is the amount you contributed towards the rent earners scheme on this property.</p>
           </div>

           <div class="project-info">
             <p class="project-info-title price"><span><f7-icon class="info-icon" ios="f7:checkmark_alt_circle" aurora="f7:checkmark_alt_circle" md="material:check_circle_outline"></f7-icon> Estimated Monthly Income:</span> <span>{{convertCurrency(currentProperty.monthlyIncome)}}</span></p>
             <p class="m-0">This is the amount of rent that you will receive each month, which is a 1% of your total payment.</p>
           </div>

           <div class="project-info">
             <p class="project-info-title price" v-if="currentProperty.totalIncome == ''"><span><f7-icon class="info-icon" ios="f7:checkmark_alt_circle" aurora="f7:checkmark_alt_circle" md="material:check_circle_outline"></f7-icon>Rental Income To Date: </span> <span>{{convertCurrency(currentProperty.totalIncome)}}</span></p>
             <p class="project-info-title price" v-else><span><f7-icon class="info-icon" ios="f7:checkmark_alt_circle" aurora="f7:checkmark_alt_circle" md="material:check_circle_outline"></f7-icon>Rental Income To Date: </span> <span>{{convertCurrency(currentProperty.totalIncome)}}</span></p>
             <p class="m-0">This is the total amount that you have received in rent each month.</p>
           </div>

           <div class="project-info">
             <p class="project-info-title price"><span><f7-icon class="info-icon" ios="f7:checkmark_alt_circle" aurora="f7:checkmark_alt_circle" md="material:check_circle_outline"></f7-icon>Percentage Gain: </span> <span>{{percentage}}%</span></p>
             <p class="m-0">This is the percentage of your initial payment that you have received back as profit.</p>
           </div>

            <div>
              <p class="withdraw text-center" v-if="withdrawal.withdraw == true">You have already requested payment</p>
            </div>
            <div class="action-btn">
              <f7-button class="part--btn fund-tooltip" large disabled @click="showTooltip"> Add Funds </f7-button>
              <f7-button :class="change" large @click="withdrawFunds" :disabled="withdrawal.withdraw == true" v-if="currentProperty.Status == 'Paid'"> Withdraw </f7-button>
              <f7-button class="outright--btn" large  v-else-if="currentProperty.Status == 'Pending'"> Pay Now </f7-button>
              <f7-button class="outright--btn" large  disabled v-if="currentProperty.Status == 'Under Review'"> Under Review </f7-button>
            </div>
        </f7-block>
        
    </f7-page-content>


  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';
//import home from '../../images/home.jpg';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

//let userId;
let userInfo;
let userName;
let data;

export default {
    data() {
    return {
      logo,
      amount: '',
      isBottom: true,
      properties: [],
      currentProperty: {},
      withdrawal: {},
      withdrawData: null,
      userName,
      name: null,
      email:  null,
      day: null,
      month: null,
      year: null,
      days: null,
      percentage: null,
      change: "outright--btn",
    }
  },
  mounted() {
    if (localStorage.getItem('trimhomeUser'));
    userInfo = JSON.parse(localStorage.getItem('trimhomesUser'));
    console.log(userInfo);

    firebase.auth().onAuthStateChanged(user => {
    if(user) {
      const user = firebase.auth().currentUser;
      let name, email, photoUrl, uid, emailVerified;

     if (user != null) {
      this.name = user.displayName;
      this.email = user.email;
      // uid = user.uid;
      this.fetchByParam();
      this.fetchWithdrawal();
    }else {
      this.$f7router.navigate('/');
    }
    }else {
      console.log("User logged out");
      this.$f7router.navigate('/');
    }
    });
  },
  computed: {
    getParam() {
      return this.$f7route.params.id
    }
  },

  methods: {
    withdrawFunds() {
      this.$f7router.navigate(`/withdrawal/${this.getParam}/`);
    },
    loadMore(done) {
      this.fetchByParam();
      this.fetchWithdrawal();
      let toastBottom = this.$f7.toast.create({
        text: 'Portfolio Updated',
        closeTimeout: 1500,
        position: 'bottom',
      });
      toastBottom.open();
      done();
    },
    clearPortfolio() {
      this.currentProperty = {};
      this.withdrawal = {};
    },
    showTooltip() {
        this.$f7.tooltip.create({
        targetEl: '.fund-tooltip',
        text: 'Tooltip text',
      });
    },
    fetchWithdrawal() {
      firebase.firestore().collection("withdrawal").where(firebase.firestore.FieldPath.documentId(), "==", this.getParam).get().then((snapshot) => {
        snapshot.docs.map(doc => {
          this.withdrawData = doc.data();
        });
          this.withdrawal = this.withdrawData;
          if(this.withdrawal.withdraw == true) {
            return this.change = "part--btn"
          }else {
            return this.change = "outright--btn"
          }
        });
    },
    fetchByParam() {
      firebase.firestore().collection("portfolio").where(firebase.firestore.FieldPath.documentId(), "==", this.getParam).get().then((snapshot) => {
        let results = snapshot.docs.map(doc => {
          this.userId = doc.id;
          this.property = doc.data();
      });
        this.currentProperty = this.property;
        this.percentage = Math.round((this.currentProperty.totalIncome / this.currentProperty.Amount) * 100); 
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.day = this.currentProperty.Date.toDate().getDate();
        this.month = monthNames[this.currentProperty.Date.toDate().getMonth()];
        this.year = this.currentProperty.Date.toDate().getFullYear();
        this.days = Math.round((new Date() - this.currentProperty.Date.toDate()) / (1000*60*60*24))
      })
    },
    convertCurrency(value) {
      return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'GBP' }).format(value);
    },

    async sellProperty() {
      this.$f7.preloader.show();
      try {
        Email.send({
          secureToken: "6d7fcff4-680b-48bd-a69c-43f92f919962",
            Host : "smtp.elasticemail.com",
            Username : "essiensaviour.a@gmail.com",
            Password : "2B06ACCA5856C1F7EE2F6CFB5BCC7C4218C6",
            To : "essiensaviour.a@gmail.com",
            From : "essiensaviour.a@gmail.com",
            Subject : "TrimHomes - Sell Request",
            Body : `
            <!doctype html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title>TrimHomes Sell Request Email</title>
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
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>${this.name}</strong> has made a request to sell their property. Below are the property details.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Here is their email <strong>${this.email}</strong> so you can reach out to them.</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.propertName}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Location}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Invested Amount:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Amount}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Total Income:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.monthlyIncome}</p>
                                       
                                       
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
              this.$f7.preloader.hide(),
              this.$f7.dialog.alert("Your funds will be credited to your account in 4 weeks", "Sale Successful"),
          );
        
      }  catch (error) {
        console.log(error);
        this.$f7.preloader.hide();
        this.$f7.dialog.alert(error.message, "Error");
      }
    },

    async widthdraw() {
      this.$f7.preloader.show();
      try {
        Email.send({
                secureToken: "6d7fcff4-680b-48bd-a69c-43f92f919962",
                Host : "smtp.elasticemail.com",
                Username : "essiensaviour.a@gmail.com",
                Password : "2B06ACCA5856C1F7EE2F6CFB5BCC7C4218C6",
                To : "essiensaviour.a@gmail.com",
                From : "essiensaviour.a@gmail.com",
                Subject : "TrimHomes - Withdrawal Request",
                Body : `
                <!doctype html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>TrimHomes Widthdraw Request Email</title>
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
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>${this.name}</strong> has made a request to widthdraw their property. Below are the property details.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Here is their email <strong>${this.email}</strong> so you can reach out to them.</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.propertName}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Location}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Invested Amount:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Amount}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Total Income:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.monthlyIncome}</p>
                                       
                                       
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
              this.$f7.preloader.hide(),
              this.$f7.dialog.alert("Your request has been recorded, Admin will contact you shortly", "Success"),
          );
        
      }  catch (error) {
        console.log(error);
        this.$f7.preloader.hide();
        this.$f7.dialog.alert(error.message, "Error");
      }
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

    .m-0 {
      margin: 0;
    }

    .mt-1 {
      margin-bottom: 0.8rem;
      margin-top: 0.6rem;
      padding: 0 0.4rem;
    }

    .confirm {
      padding-top: 0;
    }

    .outright--btn {
    background: #0d919b;
    color: #fff;
    margin-top: 0.7rem;
    width: 50%;
  }

  .part--btn {
    background: #2B3D4C;
    color: #fff;
    margin-top: 0.7rem;
    margin-right: 0.4rem;
    width: 49%;
  }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }

    .slide-img {
        height: 280px;
        width: 100%;
    }

    .slide-img img{
        object-fit: cover;
        width: 100%;
    }

    .price {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
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
        background: rgba(7, 153, 144, 0.4);
        color: rgb(43, 61, 76);
        display: block;
        border-radius: 0.3rem;
        font-size: 0.9rem !important;
        font-weight: bold !important;
        margin-top: 0.9rem;
        margin-bottom: 2.5rem;
        padding: 0.3rem 0rem;
        text-align: center;
        width: 50%;
    }

    .action-btn {
      align-items: center;
      display: flex;
      justify-content: space-around;
      margin-bottom: 1rem;
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

    .withdraw {
      color: rgb(235, 84, 84);
      margin: 0;
      margin-top: 1.5rem;
      padding: 0;
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
      color:  #E5D117;
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

    .register--btn {
    background: #2B3D4C;
    border: 1px solid #2B3D4C;;
    border-radius: 0px;
    color: #fff;
    font-size: 1rem;
    font-weight: 400;
    padding: 0.5rem 0.2rem;
    outline: none;
    width: 45%;
  }

  .register--white {
    background: #fff;
    border: 1px solid #2B3D4C;
    border-radius: 0px;
    color:#2B3D4C;
    font-size: 1rem;
    font-weight: 400;
    padding: 0.5rem 0.2rem;
    outline: none;
    width: 45%;
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
    margin: 0px;
  }

  .list .item-content .item-inner .item-title{
    color: #2B3D4C;
  }

  .list .item-content .item-inner .item-input-wrap input {
    font-size: 1.1rem;
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