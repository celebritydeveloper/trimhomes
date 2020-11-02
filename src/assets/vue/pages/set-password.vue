<template>
  <f7-page>
  <f7-navbar class="home--nav">
    <f7-navbar back-link="Set Password" no-shadow no-hairline back-link-show-text></f7-navbar>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
    <!--<f7-navbar back-link="Back"></f7-navbar>-->
    <f7-page-content class="confirm">
    <div class="block block-strong">
      <f7-block-title class="confirm--title">Welcome {{name}}</f7-block-title>
      <p class="text">You can now set a password for your brand new account.</p>
    </div>
    <form @submit.prevent="registerUser" no-store-data="true" class="list form-store-data" id="password-for">
      <ul>
        <li class="item-content item-input disabled">
          <div class="item-inner">
            <div class="item-input-wrap">
              <input name="token" v-model="token" :placeholder="token" type="text">              
            </div>
          </div>
        </li>
        <span class="valid">Awesome! Your email address has been verified.</span>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Create a strong password:</div>
            <div class="item-input-wrap">
              <input name="password" v-model="password" type="password"  data-error-message="Must contain number and letters please!">
              <span v-if="msg.password">{{msg.password}}</span>
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Confirm password:</div>
            <div class="item-input-wrap">
              <input name="cPassword" v-model="cPassword" type="password">
              <span class="input-clear-button"></span>
            </div>
            <span v-if="msg.cPassword">{{msg.cPassword}}</span>
          </div>
        </li>
        <li>
          <f7-button class="verify--btn" type="submit" >Go To Dashboard</f7-button>
        </li>
        
      </ul>
    </form>
    </f7-page-content>
  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

let userId;
let userInfo;
export default {

  data() {
    return {
      logo,
      msg: [],
      token: null,
      password: '',
      cPassword: '',
      name: null,
    }
  },
  mounted() {
  console.log('App mounted!');
    if (localStorage.getItem('trimhomeUser'));
    userInfo = JSON.parse(localStorage.getItem('trimhomesUser'));
    this.token = userInfo.token;
    this.name = userInfo.firstName;
    console.log(userInfo);
  },
  watch: {
    password(value){
      this.password = value;
      this.validatePassword(value);
    },
    cPassword(value){
      this.cPassword = value;
      this.confirmPassword(value);
    }
  },
  methods: {
    validatePassword(value) {
      let difference = 8 - value.length;
      if (value.length < 8) {
        this.msg['password'] = 'Must be 8 characters or  more!';
      } else {
         this.msg['password'] = 'Good Enough';
      }
    },
    confirmPassword(value){
      if (value !== this.password) {
        this.msg['cPassword'] = 'Password Does not match';
      } else {
         this.msg['cPassword'] = 'Password Match';
      }
    },
    async registerUser() {
      this.$f7.preloader.show();
      if(this.password.trim() !== "" && this.cPassword.trim() !== "" && this.cPassword === this.password) {
        try {
          firebase.auth().createUserWithEmailAndPassword(userInfo.email, this.password).then(users => {
          return firebase.firestore().collection("users").doc(users.user.uid).set({
              fullName: userInfo.firstName + ' ' + userInfo.lastName,
              phone: userInfo.phone,
              address: '',
              city: '',
              country: userInfo.country,
              email: userInfo.email,
              memorableNumber: userInfo.memorableNumber,
              bankName: '',
              bankNumber: '',
              bankAccountName: '',
              bankSortCode: '',
              postalCode: '',
              image: userInfo.image,
              referrer: userInfo.referrer,
              staff: userInfo.staff,
              token: userInfo.token,
              verified: true,
              created: userInfo.created,
        });
        }).then(() => {
          let user = firebase.auth().currentUser;
            user.updateProfile({
            displayName: userInfo.firstName + ' ' + userInfo.lastName,
            photoURL: userInfo.image
          }).then(()=> {
            Email.send({
              secureToken: "df141b53-cbb5-423c-92ac-ecc8b9a2b245",
              Host : "smtp.elasticemail.com",
              Username : "mail@trimhomes.co.uk",
              Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
              To : userInfo.email,
              From : "mail@trimhomes.co.uk",
              Subject : "Welcome to TrimHomes UK",
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
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Dear ${this.name},</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>Thank you for signing up with Trim Homes.  Here are our key offerings.</strong></p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>1. Property Consultancy: </strong></p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We are a one-stop shop property company who assist our clients in bringing their property visions to life. We are involved from the property viewing stage to the property rental stage.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We work within the budgets of our clients in selecting the best properties to generate profitable rental income .</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px; text-decoration: underline;">How do we do this? </p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Our knowledge of the market is unrivalled, and we utilise this knowledge to assist with your property vision.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Are you looking to buy? Should you buy from an auction? Do you have enough money saved for a mortgage deposit? where is the best place to get a property? You have X amount, how do you get a home with this? how do you get into the property market? how do you get a conveyancer? Do you need a mortgage broker? How can you access finance to enter the property market?</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">These and so many other questions are what we can assist with in addition to assisting with the leg work required.</p>                                        
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We will engage thoroughly with you to understand your needs and to create strategies that help you achieve those needs at the best possible prices with the best possible yields.</p>  
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you think you may be ready or not ready to enter the UK property company, contact us and we will be happy to assist with your journey.</p>

                                        p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>2. Rent Earners Scheme </strong></p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Trim Homes Limited owns an extensive list of properties which are all rented. Members of the Trim Homes Rent Earners Scheme are able to buy a part of any available property according to their own budget, and in return, they receive a part of the rental income that is paid to Trim Homes for that property. This income is proportionate to their contribution to the property and varies between 1% of the purchase amount.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">For instance, if you contribute £500 towards one property, you earn about £5.00 every month in rental income. When you want to withdraw your contribution, we withdraw immediately for you (no pre-condition) and you get your £500 back in 4 weeks. It’s that straightforward and you can start putting your money to work right away.</p>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">a) <strong>How to join the Rent Earners Scheme</strong></p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">1. <a href="trimhomesapp.web.app/#/properties/ target="_blank">Select a property</a> from our portfolio. You will see how much is available for contribution with each property. If you do not have a Trim Homes account, you will be prompted to create one.</p>


                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">2. <strong> Make a payment</strong></p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>3.</strong> Earn monthly rental income on your payment.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>4.</strong> Withdraw your payment whenever you are ready.</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>5.</strong> You can withdraw your funds at any time from your Trim Homes Limited online account.</p>
                                        
                                        
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><strong>The terms of the Rent Earners Scheme are as follows: </strong></p>
                                                                               

                                        <ul style="font-family: sans-serif; font-size: 12px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
                                          <li>Trim Homes Limited is the registered proprietor of the property which is registered at the land registry.</li>
                                          <li>The Property is let on a residential tenancy.</li>
                                          <li>You shall receive a calendar monthly payment equivalent to 1% of your rent earners contribution amount.</li>
                                          <li>You can request for your payment at any time and your account will be credited within 4 weeks from the date of your request..</li>
                                          <li>Trim will continue to pay your rent up until the point of your request to withdraw your paid amount.</li>
                                          <li>The Parties hereto agree and covenant with the other that they shall individually be responsible for the payment of any tax or duty for which they may be personally liable and indemnify each the other from all such liability.</li>
                                        </ul>

                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Please note that Trim Homes is registered with Companies House in the UK- Registration number 12442185</p>
                                        <p style="font-family: sans-serif; font-size: 12px; color:#6c757d; font-weight: normal; margin: 0; Margin-bottom: 18px;">Companies House is the United Kingdom's registrar of companies and is an executive agency and trading fund of Her Majesty's Government. It falls under the remit of the Department for Business, Energy and Industrial Strategy and is also a member of the Public Data Group</p>

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
            message => console.log(message + "Sent")
          );
          }).then(()=> {
            this.$f7.preloader.hide();
            this.$f7router.navigate('/home/', {
                reloadCurrent: true,
                ignoreCache: true,
            });
          })
        })
          
      } catch (err) {
        this.$f7.preloader.hide();
        console.log(err);
      }
      return true;
      }else {
        this.$f7.preloader.hide();
        this.$f7.dialog.alert("You must set a password", "Error");
      }
      
    }
  },
  components: {},
};
</script>

<style scoped>

  body {
        font-family: 'Montserrat', sans-serif;
    }

  .confirm {
    background: #fff;
    padding-top: 0px;
    padding-left: 10px;
    padding-right: 10px;

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
    text-align: center;
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