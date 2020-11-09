<template>
  <f7-page class="home">
    <f7-navbar class="home--nav">
    <f7-navbar back-link="Withdrawal" back-link-show-text></f7-navbar>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>


    <f7-page-content class="confirm">
      <div class="text-center">
        <f7-block-title large class="withdraw--title">Withdraw Funds</f7-block-title>
      </div>
      <f7-block>
        <f7-block-title medium class="withdraw-title"> Withdrawal Terms</f7-block-title>
        <small class="notice-text">Please read these carefully</small>
        <ul class="terms">
          <li>Withdrawal takes 4 weeks to complete and payments can only be made by bank transfer to the bank account details you provide below. Please ensure that the details provided are accurate. TRIM Homes is not responsible for any problems arising due to incorrect account details.</li>
          <li>You shall no longer receive a calendar monthly payment equivalent to 1% of your payment amount on this property as of this date.</li>
          <li>You confirm that you are responsible for the payment of any tax duty for which you may be personally liable as a result of your earnings under the Trim Homes Rental Scheme and indemnify TRIM HOMES from all such liability.</li>
        </ul>
      </f7-block>

      <f7-block>
        <f7-block-title medium class="withdraw-title"> Payment Account </f7-block-title>
        <small class="notice-text">Which account should the funds be paid to?</small>

        <form @submit.prevent="updateAccount" no-store-data="true" class="list form-store-data" id="demo-form">
          <ul>
            <li class="item-content item-input">
              <country-select v-model="country" :country="country" placeholder="Select your banking Country" topCountry="GB" :countryName="true" :whiteList="['GB', 'NG', 'US']" />
            </li>
            
          <li class="item-content item-input">
              <div class="item-inner">
                <div class="item-title item-label">Account Name</div>
                <div class="item-input-wrap">
                  <input name="AccName" type="text" v-model="accountName">
                  <span class="input-clear-button"></span>
                </div>
              </div>
            </li>
            <li class="item-content item-input">
              <div class="item-inner">
                <div class="item-title item-label">Account Number</div>
                <div class="item-input-wrap">
                  <input name="AccNumber" type="number" v-model="accountNumber" validate pattern="[0-9]*" data-error-message="Only numbers please!">
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
              <div class="item-content">
                <div class="item-inner">
                  <div class="item-title">Save these details for future withdrawals</div>
                  <div class="item-after">
                    <label class="checkbox">
                      <input type="checkbox" id="save-checkbox" @change="updateBank"><i class="icon-checkbox"></i>
                    </label>
                  </div>
                </div>
              </div>
            </li>      
          </ul>
          <div class="text-success">{{bankSuccess}}</div>
        </form>
      </f7-block>

      <f7-block>
        <f7-block-title medium class="withdraw-title"> Withdrawal Summary </f7-block-title>
        <small class="notice-text">Which funds are you withdrawing?</small>
      </f7-block>

      <f7-block>
          <f7-row class="mt-1">
            <f7-col>
              <p class="withdraw-text">You are withdrawing:</p>
              <p class="withdraw-detail">{{convertCurrency(currentProperty.Amount)}}</p>
            </f7-col>

            <f7-col>
              <p class="withdraw-text">From your initial payment for:</p>
              <p class="withdraw-detail">{{currentProperty.propertName + ", " + currentProperty.Location}}</p>
            </f7-col>
          </f7-row>

          <f7-row>
            <f7-col>
              <span class="toggle-pane"> I have read and I accept the withdrawal terms as stated above. </span>
                <label class="checkbox">
                  <input type="checkbox" id="terms-checkbox" @change="terms"><i class="icon-checkbox"></i> 
                </label>
            </f7-col>
          </f7-row>
      </f7-block>

      
      


         <f7-block class="project-info-block">
              <f7-button class="outright--btn" :disabled="disableWithdraw" large @click="withdraw"> Withdraw Funds </f7-button>
        </f7-block>
        
    </f7-page-content>


  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

export default {
    data() {
        return {
          logo,
          portfolioId: null,
          amount: '',
          isBottom: true,
          properties: [],
          currentProperty: {},
          bankName: "",
          accountName: "",
          accountNumber: "",
          sortCode: "",
          country: "",
          user: null,
          name: null,
          email:  null,
          id: null,
          bankSuccess: null,
          disableWithdraw: true,
        }
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
    if(user) {
      const user = firebase.auth().currentUser;
      let name, email, photoUrl, uid, emailVerified;

     if (user != null) {
      this.name = user.displayName;
      //this.email = user.email;
      this.id = user.uid;
      this.getAccount();
      this.fetchByParam();
    }else {
      this.$f7router.navigate('/', {
        reloadCurrent: true,
        ignoreCache: true,
      });
    }
    }else {
      console.log("User logged out");
      this.$f7router.navigate('/', {
        reloadCurrent: true,
        ignoreCache: true,
      });
    }
    });
  },
  methods: {
    terms() {
      const toggle = document.querySelector('#terms-checkbox');
      if(toggle.checked) {
        return this.disableWithdraw = false;
      }else {
        return this.disableWithdraw = true;
      } 
    },
    showTooltip() {
       this.$f7.tooltip.create({
        targetEl: '.fund-tooltip',
        text: 'Tooltip text',
      });
    },
    async updateBank() {
      const toggle = document.querySelector('#save-checkbox');
      if(toggle.checked) {
        this.$f7.preloader.show();
          try {
            return firebase.firestore().collection("users").doc(this.id).update({
              bankName: this.bankName,
              bankAccountName: this.accountName,
              bankNumber: this.accountNumber,
              bankSortCode: this.sortCode,
              country: this.country
          }).then(() => {
            this.$f7.preloader.hide();
            this.bankSuccess = "This detail has been saved successfully."
        }).then(()=> {
          setTimeout(() => {
            this.bankSuccess = "";
          }, 2000);
        })
          } catch (err) {
            this.$f7.preloader.hide();
            //this.$f7.dialog.alert(err, "Error");
          }
      }
      
    },
    async getAccount() {
      try {
        firebase.firestore().collection("users").where(firebase.firestore.FieldPath.documentId(), "==", this.id).get().then((snapshot) => {
        let results = snapshot.docs.map(doc => {
          this.user = doc.data();
        });
          this.bankName = this.user.bankName;
          this.accountName = this.user.bankAccountName;
          this.accountNumber = this.user.bankNumber;
          this.sortCode = this.user.bankSortCode;
          this.country = this.user.country
        });
      } catch (err) {
        this.$f7.dialog.alert(err, "Error");
      }
      return true;
    },

    fetchByParam() {
      firebase.firestore().collection("portfolio").where(firebase.firestore.FieldPath.documentId(), "==", this.getParam).get().then((snapshot) => {
        let results = snapshot.docs.map(doc => {
          this.portfolioId = doc.id;
          this.property = doc.data();
        });
          this.currentProperty = this.property;
          console.log(this.currentProperty);
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

    async withdraw() {
      this.$f7.dialog.confirm("Are you sure you want to withdraw?", "Withdraw Fund", () => {
        this.$f7.preloader.show();
      try {
        return firebase.firestore().collection("withdrawal").doc(this.portfolioId).set({
          user: this.id,
          name: this.name,
          email: this.email,
          property: this.currentProperty.propertName,
          propertyId: this.portfolioId,
          location: this.currentProperty.Location,
          amount: this.currentProperty.Amount,
          requestDate: new Date(),
          paid: false,
          paidDate: "",
          withdraw: true,
        }).then(() => {
        Email.send({
                secureToken: "df141b53-cbb5-423c-92ac-ecc8b9a2b245",
                Host : "smtp.elasticemail.com",
                Username : "mail@trimhomes.co.uk",
                Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
                To : this.email,
                From : "mail@trimhomes.co.uk",
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
                                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Dear, ${this.name}</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px; text-align: center;"><strong>We Recieved Your Withdrawal Request</strong></p>


                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You have submitted a request to withdraw <strong>£${this.currentProperty.Amount}</strong> from your rent earners scheme property: <strong>${this.currentProperty.propertName}, ${this.currentProperty.Location}</strong>.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You will receive your payment in <strong>4 weeks</strong>, and we will send an email confirmation as soon as a payment has been made to you.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">As per the withdrawal terms, please note that no further monthly rental income payments will be made to you following this request.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">You do not need to take any further action at this time.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thank you for being a part of the Trim Homes Rental Scheme.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Best regards, <br> <strong>The Trim Homes Team</strong> </p>
                                       
                                       
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
          );
        }).then(()=> {
          Email.send({
                secureToken: "df141b53-cbb5-423c-92ac-ecc8b9a2b245",
                Host : "smtp.elasticemail.com",
                Username : "mail@trimhomes.co.uk",
                Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
                To : "mail@trimhomes.co.uk",
                From : "mail@trimhomes.co.uk",
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
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">A new payment was received from <strong>${this.name}</strong>, Here are the details.</p>


                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.propertName}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.currentProperty.Location}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Invested Amount:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${this.currentProperty.Amount}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Rental Income:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${this.currentProperty.monthlyIncome}</p>
                                       
                                       
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
          );
        }).then(()=> {
          this.$f7.dialog.alert("Withdrawal requests take 4 weeks to complete. As soon as we make the payment, you will receive an email confirmation. <br> You do not need to take any further action.", "We Have Received Your Request!");
        }).then(()=> {
          setTimeout(() => {
            this.$f7router.navigate('/portfolios/')
          }, 2000);
        })
        
      }  catch (error) {
        this.$f7.preloader.hide();
        this.$f7.dialog.alert(error, "Error");
        console.log(error);
      }
        
      })
      
    },
  },
  computed: {
    getParam() {
      return this.$f7route.params.id
    }
  },
};
</script>


<style scoped>
    body {
      color: #2B3D4C;
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
    margin-bottom: 0.7rem;
    margin-top: 0.4rem;
    width: 100%;
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

    .terms {
      margin: 0;
    }

    .terms li{
      text-align: left;
      font-style: italic;
      margin-bottom: 0.6rem;
    }

    .notice-text {
      color: #899CB2;
      display: block;
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }

    .withdraw-title {
      border-bottom: 1px solid rgb(168, 168, 168);
      margin-bottom: 0;
      margin-top: 0.2rem;
      padding-bottom: 0.4rem;
    }

    .withdraw--title {
        margin-bottom: 0;
        margin-top: 0.9rem;
        padding: 0;
    }

    .withdraw-text {
      color: #17A2B8;
      font-size: 0.8rem;
      margin-bottom: 0.3rem;
    }

    .withdraw-detail {
      color: #2B3D4C;
      font-size: 1rem;
      font-weight: bold;
      margin: 0;
    }

    .toggle-pane {
      color: #fc5c5c;
      list-style: none;
      padding: 0 1rem;
      margin: 0;
    }

    .form-toggle {
      color: #2B3D4C;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .text-success {
      color: rgb(20, 182, 20);
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
        margin: 1rem 0 0.2rem 0;
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