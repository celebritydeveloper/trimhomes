<template>
  <f7-page class="home" name="payment">
    <f7-navbar class="home--nav" back-link="Paypal Payment" back-link-show-text>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>

    <f7-page-content class="confirm">
      <f7-block>
        <form @submit.prevent="makeRequest" no-store-data="true" class="list form-store-data" id="demo-form">
        <ul>
          <li class="item-content item-input">
            <div class="item-inner">
              <div class="item-input-wrap">
                <input name="amount" type="number" v-model="amount" placeholder="Enter Amount">
              </div>
            </div>
          </li>
        </ul>
      </form>
      <p v-if="msg.amount" :class="valid" style="margin: 0;">{{msg.amount}}</p>
        <div class="percentage mt-3 mb-2 text-center">
            <p class="h6 mt-4">Your Monthly Rental Income:</p>
            <h3 class="badge-icon"><f7-badge color="blue">£{{ getPercent()}}</f7-badge></h3>
            <div class="mx-auto" ref="paypal" style="width: 50%;"></div>
        </div>
        <div class="my-3">
          <p class="text-center modal-text-small">Based on your purchase payment amount entered above, <br> your monthly rental income of <strong>£{{ getPercent()}}</strong> will be paid on the last day of next month.</p>
        </div>
        <div class="mx-auto" ref="paypal" style="width: 80%;"></div>
        <div class="mx-auto" style="width: 80%;">
          <f7-button fill raised large class="primary--btn" :disabled="amount > (max - value) || amount < 500" @click="displayBank">Bank Transfer</f7-button>
        </div>
      </f7-block>
      
    </f7-page-content>
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
            amount: "",
            info: null,
            infoId: null,
            newPropId: null,
            name: null,
            email: null,
            msg: [],
            valid: null,
            currentProperty: {},
            propId: null,
            userId: null,
            user: null,
            property: null,
            price: null,
            value: null,
            max: null,
            newAmount: null
        }
    },
    mounted: function() {
     firebase.auth().onAuthStateChanged(user => {
      if(user) {
          const user = firebase.auth().currentUser;
        let name, displayName, email, photoUrl, uid, emailVerified;

      if (user != null) {
        this.name = user.displayName;
        this.email = user.email;
        this.getTotalContribution();
        this.fetchByParam();
        const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?currency=GBP&client-id=AazWtpSvPKtPln5tZWzSDw1qYV2jTrQFyR1vdbEFz_myIccfMJG4tmlui62RysanOCCgZH-npS6E63Eg";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
      }else {
        this.$f7router.navigate('/login/');
      }
      }else {
          this.$f7router.navigate('/login/');
      }
      });
    
    if (localStorage.getItem('trimhomeUser'));
      this.info = JSON.parse(localStorage.getItem('trimhomesProperty'));
      this.infoId = JSON.parse(localStorage.getItem('trimhomesPropertyId'));
      console.log(this.info);
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
   async getTotalContribution() {
        try {
            firebase.firestore().collection("contributions").where(firebase.firestore.FieldPath.documentId(), "==", this.getParam).get().then((snapshot) => {
            let result = snapshot.docs.map(doc => {
              this.value = doc.data().amount;
            });
            this.newAmount = this.value + parseInt(this.amountInfo.amount);
            console.log(this.newAmount);
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
    getPercent() {
      return Number(this.amount * 0.01).toFixed(2);
    },
    async displayBank() {
        const userAmount = {
          amount: this.amount,
        }
      localStorage.setItem('userPropertyAmount', JSON.stringify(userAmount));
      await this.$f7router.navigate(`/bank-details/${this.getParam}/`);
      
    },
    setLoaded: function() {
      this.loaded = true;
      window.paypal
        .Buttons({
          style: {
            layout:  'vertical',
            color:   'gold',
            shape:   'rect',
            label:   'pay',
            height:   45,
            size:     'medium',
          },
          createOrder: (data, actions) => {
            if(this.amount < 500 || this.amount > (this.max - this.value)) {
              this.$f7.dialog.alert(`Please make sure your payment amount is not less than £500 or greater than £${(this.max - this.value)}.`, "Error");
              return false;
            }else {
              return actions.order.create({
                purchase_units: [
                  {
                    description: this.info.Title + ", " + this.info.Location,
                    amount: {
                      currency_code: "GBP",
                      value: this.amount
                    }
                  }
                ]
              });
            }
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            this.data;
            this.$f7.dialog.alert(`Your Payment for ${this.info.Title + ", " + this.info.Location} was successful`, "Payment Success");
            await firebase.firestore().collection("payments").add({
              userId: this.user.data.id,
              propertyId: this.infoId,
              transactionId: order.id,
              createdTime: order.create_time,
              email: order.payer.email_address,
              name: order.payer.name.given_name,
              name: order.payer.name.surname,
              address: order.payer.address,
              payerId: order.payer.payer_id,
              amount: order.purchase_units[0].amount.value,
              currency: order.purchase_units[0].amount.currency_code,
              property: order.purchase_units[0].description,
              payeeEmail: order.purchase_units[0].payee.email_address,
              payeeMerchant: order.purchase_units[0].payee.merchant_id,
              status: order.status,
              updatedTime: order.update_time,
            }).then(() => {
              firebase.firestore().collection("portfolio").add({
                userId: this.user.data.id,
                propId: this.infoId,
                Name: this.user.data.name,
                Email: this.user.data.email,
                Amount: order.purchase_units[0].amount.value,
                monthlyIncome: this.getPercent(),
                image: this.info.image,
                propertName: this.info.Title,
                Location: this.info.Location,
                totalIncome: "", 
                Requested: false,
                Status: "Pending",
                Paid: false,
                Date: new Date()
              });
            })

            await firebase.firestore().collection("portfolio").get().then((snapshot) => {
            let result = snapshot.docs.map(doc => {
                if(doc.data().userId === this.user.data.id && doc.data().propId === this.infoId && doc.data().Amount === order.purchase_units[0].amount.value) {
                  this.newPropId = doc.id;
                }
              });
            }).then(() => {
              if (order.status === "COMPLETED") {
                firebase.firestore().collection("portfolio").doc(this.newPropId).update({
                  Status: "Paid"
                });
                
                firebase.firestore().collection("contributions").doc(this.getParam).update({
                  amount: this.newAmount
                })  
              }else {
                firebase.firestore().collection("portfolio").doc(this.newPropId).update({
                  Status: "Pending",
                });
                this.$f7.dialog.alert(`Your Payment was unsucessful, although we have created your portfolio to "Pending".`, "Payment Error");
                return false
              }
            }).then(() => {
              Email.send({
                secureToken: "df141b53-cbb5-423c-92ac-ecc8b9a2b245",
                Host : "smtp.elasticemail.com",
                Username : "mail@trimhomes.co.uk",
                Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
                To : `${this.email}`,
                From : "mail@trimhomes.co.uk",
                Subject : "We have received your payment",
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
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi ${this.user.data.name},</p>


                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This is to confirm your payment of £${order.purchase_units[0].amount.value}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Date:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${order.create_time}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.info.Title}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.info.Location}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Invested Amount:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${order.purchase_units[0].amount.value}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Rental Income:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${Number(order.purchase_units[0].amount.value * 0.01).toFixed(2)}</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Your rental income will be paid to you on the last day of each month.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">For any queries please contact our support team on <strong> timi@trimhomes.co.uk </strong></p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Regards, <br> <strong>The Trim Homes Team</strong> </p>
                                       
                                       
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
                message => console.log(message + "Sent"),
                this.show = false,
              );
            }).then(()=> {
              Email.send({
                secureToken: "df141b53-cbb5-423c-92ac-ecc8b9a2b245",
                Host : "smtp.elasticemail.com",
                Username : "mail@trimhomes.co.uk",
                Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
                To : "mail@trimhomes.co.uk",
                From : "mail@trimhomes.co.uk",
                Subject : `${this.name} - Has made a successful payment`,
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
                                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, Admin</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">A new payment was received from <strong>${this.name}</strong>, Here are the details.</p>


                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Date:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${order.create_time}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.info.Title}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.info.Location}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Invested Amount:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${order.purchase_units[0].amount.value}</p>

                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Rental Income:</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${Number(order.purchase_units[0].amount.value * 0.01).toFixed(2)}</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have notified the user of the new addition to their portfolio.</p>
                                       
                                       
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
                message => console.log(message + "Sent")
              );
            }).then(() => {
              this.$f7router.back();
            })
          },
          onError: err => {
            console.log(err);
          }
        }).render(this.$refs.paypal);
      }
  }
}
</script>

<style scoped>

  .mx-auto {
    margin: 0 auto;
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

  .status {
    margin: 0;
  }

  .text-center {
    text-align: center;
  }

  .amount-error {
    color: red;
    font-size: 0.8rem;
    text-align: center;
  }

  .amount-success {
    color: green;
    font-size: 0.8rem;
    text-align: center;
  }

  .primary--btn {
    background:#2B3D4C;
    color: #fff;
    margin-top: 0.4rem;
  }
  .badge-icon {
    margin: 0;
    padding: 0;
  }

  .badge {
    background: #0d919b;
    border-radius: 6px;
    margin: 0;
    padding: 1rem 1.5rem;
    font-size: 1.2rem;
  }

  .mt-3 {
    margin-top: 1rem;
  }

  .mb-2 {
    margin-bottom: 1rem;
  }

  .my-3 {
    margin: 0 0 2rem 0;
  }
</style>