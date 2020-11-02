<template>
  <f7-page class="home" name="bankdetails">
    <f7-navbar class="home--nav" back-link="Bank Details" back-link-show-text>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>

    <f7-page-content class="body">
        <f7-block>
            <f7-block-title class="title">Account Details For Bank Transfers</f7-block-title>
            <div>
                <div class="card">
                    <div class="bank-top text-left card-header">
                        <img :src="uk">
                        <div class="bank-currency text-left">
                            <p class="h5 my-0">£ - Pound Sterling</p>
                            <p class="h5 my-0">United Kingdom</p>
                        </div>
                    </div>
                    <div class="card-content card-content-padding text-center">
                        <div class="account-step mb-3">
                            <p class="h6">Bank Name</p>
                            <p class="h3">Natwest Bank</p>
                        </div>
                        <div class="account-step mb-3">
                            <p class="h6">Account Name</p>
                            <p class="h3">Trim Homes Limited</p>
                        </div>
                        <div class="account-step mb-3">
                            <p class="h6">Account Number</p>
                            <p class="h3">62090917</p>
                        </div>
                        <div class="account-step mb-3">
                            <p class="h6">Sort Code</p>
                            <p class="h3">60-14-10</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="bank-top text-left card-header">
                        <img :src="naija">
                        <div class="bank-currency text-left">
                            <p class="h5 my-0">£ - Pound Sterling</p>
                            <p class="h5 my-0">Nigeria</p>
                        </div>
                    </div>
                    <div class="card-content card-content-padding text-center">
                        <div class="account-step mb-3">
                            <p class="h6">Bank Name</p>
                            <p class="h3">Fidelity Bank</p>
                        </div>
                        <div class="account-step mb-3">
                            <p class="h6">Account Name</p>
                            <p class="h3">Trim Integrated Services Limited</p>
                        </div>
                        <div class="account-step mb-3">
                            <p class="h6">Account Number</p>
                            <p class="h3">5250198195</p>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="bank-top text-left card-header">
                        <img :src="naija">
                        <div class="bank-currency text-left">
                            <p class="h5 my-0">₦ - Naira</p>
                            <p class="h5 my-0">Nigeria</p>
                        </div>
                    </div>
                    <div class="card-content card-content-padding text-center">
                        <div class="account-step mb-3">
                            <p class="h6">Bank Name</p>
                            <p class="h3">Fidelity Bank</p>
                        </div>
                        <div class="account-step mb-3">
                            <p class="h6">Account Name</p>
                            <p class="h3">Trim Integrated Services Limited</p>
                        </div>
                        <div class="account-step mb-3">
                            <p class="h6">Account Number</p>
                            <p class="h3">5620072850</p>
                        </div>
                    </div>
                </div>

                <div class="text-left mb-5">
                    <p class="text-danger mb-0 h6">PLEASE NOTE FOR NAIRA PAYMENTS:</p>
                    <p class="notice">If you pay Naira into our Nigerian account, please note that the funds will be converted to pounds sterling using the exchange rate on the day we receive the naira in our account. Your account on the online platform/app will be updated with the pound equivalent. If you can convert your naira into pounds yourself then please do so by all means and pay the pounds into our pound account.</p>
                </div>
                <p class="h3 text-center">Have you made your payment?</p>

                <div>
                    <label class="checkbox">
                        <input type="checkbox" id="terms-checkbox" @change="terms"><i class="icon-checkbox"></i> 
                    </label>
                    <span class="toggle-pane"> By proceeding with this payment, I confirm that I have read and I accept the terms and conditions of part-purchase with Trim Homes Limited. </span>
                </div>
                <f7-row>
                    <f7-col>
                        <f7-button fill large raised @click="handleNotPaid" class="no--btn">No</f7-button>
                    </f7-col>
                    <f7-col>
                        <f7-button fill large raised @click="markAsComplete" class="yes--btn" size="lg" :disabled="disableWithdraw">Yes</f7-button>
                    </f7-col>
                </f7-row>
            </div>
        </f7-block>
    </f7-page-content>
  </f7-page>
</template>

<script>
import logo from '../../images/logo-nav.png';
import naija from '../../images/naija.png';
import uk from '../../images/uk.png';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };


export default {
    data() {
        return {
            logo,
            naija,
            uk,
            disableWithdraw: true,
            name: null,
            email: null,
            id: null,
            info: null,
            infoId: null,
            amountInfo: null,
            income: null,
            newAmount: null,
            value: null
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged(user => {
            if(user) {
                const user = firebase.auth().currentUser;
            let name, email, photoUrl, uid, emailVerified;

            if (user != null) {
            this.name = user.displayName;
            this.email = user.email;
            this.id = user.uid;
            this.getTotalContribution();
            if (localStorage.getItem('trimhomeUser'));
            this.info = JSON.parse(localStorage.getItem('trimhomesProperty'));
            this.infoId = JSON.parse(localStorage.getItem('trimhomesPropertyId'));
            console.log(this.info);
            
            this.income = parseInt(this.amountInfo.amount) * 0.01;
            console.log(this.income);
            }else {
                this.$f7router.navigate('/');
            }
            }else {
                console.log("User logged out");
                this.$f7router.navigate('/');
            }
        });
        this.amountInfo = JSON.parse(localStorage.getItem('userPropertyAmount'));
        console.log(this.amountInfo);
    },
    computed: {
        getParam() {
        return this.$f7route.params.id;
        }
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

        handleNotPaid() {
            this.$f7router.navigate('/properties/');
        },

        async getTotalContribution() {
        try {
            firebase.firestore().collection("contributions").where(firebase.firestore.FieldPath.documentId(), "==", this.getParam).get().then((snapshot) => {
            let result = snapshot.docs.map(doc => {
              this.value = doc.data().amount;
            });
            this.newAmount = this.value + parseInt(this.amountInfo.amount);
        });
        } catch (error) {
          this.$f7.preloader.hide();
          this.$f7.dialog.alert(error + "Please refresh the page to try again", "Error");
        }
      },

        async markAsComplete() {
            
            this.$f7.dialog.confirm("Are you sure you have made payment?", "Confirm Payment", () => {
            try {
            this.$f7.preloader.show();
            Email.send({
                    secureToken: "df141b53-cbb5-423c-92ac-ecc8b9a2b245",
                    Host : "smtp.elasticemail.com",
                    Username : "mail@trimhomes.co.uk",
                    Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
                    To : "mail@trimhomes.co.uk",
                    From : "mail@trimhomes.co.uk",
                    Subject : `${this.name} Has Confirmed A Payment`,
                    Body : `
                    <!doctype html>
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width">
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <title>MARK AS PAID - Email notification</title>
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
                                        <p style="background: #2B3D4C; padding: 0; text-align: center;"><img src="https://lirp-cdn.multiscreensite.com/7e157610/dms3rep/multi/opt/3-68f7e3f4-218w.png" style="width: 70px;"></p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This is to inform you that <strong> ${this.name} </strong> with email <strong>${this.email}</strong> has confirmed payment on their Trim Homes account.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Below are the details of the property.</p>


                                        <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Title:</p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.info.Title}</p>

                                            <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Property Location:</p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${this.info.Location}</p>

                                            <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Invested Amount:</p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${this.amountInfo.amount}</p>

                                            <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Rental Income:</p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">£${this.income}</p>

                                            <p style="font-family: sans-serif; font-size: 16px; font-weight: bold; margin: 0; Margin-bottom: 8px;">Payment Date:</p>
                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${new Date()}</p>

                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Kindly check and confirm that this is accurate.</p>



                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Regards</p>
                                        
                                        
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
                }).then(()=> {
                firebase.firestore().collection("portfolio").add({
                    userId: this.id,
                    propId: this.infoId,
                    Name: this.name,
                    Email: this.email,
                    Amount: parseInt(this.amountInfo.amount),
                    monthlyIncome: this.income,
                    image: this.info.image,
                    propertName: this.info.Title,
                    Location: this.info.Location,
                    totalIncome: 0, 
                    Requested: false,
                    Status: "Under Review",
                    Paid: true,
                    Date: new Date(),
                    paymentDate: new Date()
                });
                }).then(() => {
                    firebase.firestore().collection("contributions").doc(this.infoId).update({
                        amount: this.newAmount
                    })  
                }).then(() => {
                    this.$f7.dialog.alert("Your Portfolio has been created. Wait for 2 business days for Admin to confirm your payment.", "Congratulations");
                setTimeout(() => {
                    this.$f7.preloader.hide();
                    this.$f7router.navigate('/properties/', {
                        force: true
                    })
                    }, 2000);
                }).then(() => {
                    localStorage.removeItem('userPropertyAmount');
                }).then(
                message => console.log(message),
                );
                
            } catch (error) {
                this.$f7.preloader.hide();
                this.$f7.dialog.alert(error, "Error");
            }                    
        });
        }
    }
}
</script>

<style scoped>

    .body {
        padding-top: 1.5rem;
    }

    .block {
        margin: 0;
    }

    .title {
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
    }

    .bank-top {
        align-items: center;
        background: #2c3e50;
        color: #fff;
        display: flex;
        justify-content: start;
        padding: 0.5rem 0.7rem;
    }
    .bank-currency p{
        margin: 0;
        margin-left: 1rem;
        padding: 0;
    }

    .text-center {
        text-align: center;
    }

    .text-left {
        text-align: left;
    }

    .h3 {
        font-size: 1.3rem;
        margin: 0;
    }

    .h6 {
        margin: 0;
    }

    .mb-3 {
        margin-bottom: 1rem;
    }

    .notice {
      font-size: 0.8rem;
      margin: 0;
      margin-bottom: 0.5rem;
    }

    .text-danger {
      color: red;
      margin: 0;
      margin-top: 1rem;
    }

     .terms {
    font-size: 0.8rem;
    font-weight: lighter;
    text-align: center;
  }
  .yes--btn {
    background: #0d919b;
    color: #fff;
    margin-top: 0.5rem;
    width: 100%;
  }
  .no--btn {
    background: #2c3e50;
    color: #fff;
    margin-top: 0.5rem;
    width: 100%;
  }

  .toggle-pane {
      font-size: 0.75rem;
      font-style: italic;
  }

</style>