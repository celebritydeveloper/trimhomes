<template>
  <f7-page>
  <f7-navbar class="home--nav">
    <f7-navbar back-link="Verify Token" no-shadow no-hairline back-link-show-text></f7-navbar>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
    <!--<f7-navbar back-link="Back"></f7-navbar>-->
    <f7-page-content class="confirm">
    <div class="block block-strong">
      <p class="text-center">
        <f7-icon class="text-center register-icon" ios="f7:envelope_badge" aurora="f7:envelope_badge" md="material:mail_outline"></f7-icon>
      </p>
      <f7-block-title class="confirm--title">You’ve got mail....</f7-block-title>
      <p class="text">Please check your mailbox for an email from Trim Homes UK and enter the confirmation  code you received below:</p>
    </div>
    <form @submit.prevent="verifyToken" no-store-data class="list form-store-data" id="password-form">
      <ul>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-input-wrap">
              <input name="token" v-model="token" type="number" placeholder="Enter Code">              
            </div>
          </div>
        </li>
        <!--<span v-if="msg.token" class="valid">{{msg.token}}</span>-->
        <li>
          <f7-button class="verify--btn" type="submit">Verify</f7-button>
          <p class="terms">If you didn’t recieve a code!  
          <f7-link class="forgot-btn" @click="resendToken">Resend</f7-link></p>
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
import OTP from 'otp-client';


const secret = 'TPQDAHVBZ5NBO5LFEQKC7V7UPATSSMFY';
const otp = new OTP(secret);
const otpCode = otp.getToken();

const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

let userId;
let userInfo;
export default {
  data() {
    return {
      logo,
      msg: [],
      token: '',
      userId: null,
    }
  },
  mounted() {
  console.log('App mounted!');
    if (localStorage.getItem('trimhomeUser'));
    userInfo = JSON.parse(localStorage.getItem('trimhomesUser'));
    console.log(userInfo);
  },
  watch: {
   token(value){
      this.token = value;
      this.validateToken(value);
    }
  },
  methods: {
    validateToken(value){
      if (value === userInfo.token) {
        this.msg['token'] = '';
      } else {
         this.msg['token'] = '';
      }
    },
    async verifyToken() {
        this.$f7.preloader.show();
        try {
            if (this.token === userInfo.token) { 
              if(JSON.parse(localStorage.getItem("trimhomesUser"))) {
                let userToken = JSON.parse(localStorage.getItem('trimhomesUser'));
                userToken.verified = true;
                localStorage.setItem("trimhomesUser", JSON.stringify(userToken));
              }
                this.$f7router.navigate('/set-password/');
                this.$f7.preloader.hide();
            }else {
                this.$f7.preloader.hide();
                this.$f7.dialog.alert("Token Does not Match", "Error");
            }
        } catch (err) {
            this.$f7.dialog.alert(err.message, "Error");
        }

      
    },
    async resendToken() {
        this.$f7.preloader.show();
        try {
            if(JSON.parse(localStorage.getItem("trimhomesUser"))) {
                let userToken = JSON.parse(localStorage.getItem('trimhomesUser'));
                userToken.token = otpCode;
                localStorage.setItem("trimhomesUser", JSON.stringify(userToken));
              }
            Email.send({
              secureToken: "6d7fcff4-680b-48bd-a69c-43f92f919962",
              Host : "smtp.elasticemail.com",
              Username : "mail@trimhomes.co.uk",
              Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
              To : userInfo.email,
              From : "mail@trimhomes.co.uk",
              Subject : "Trim Homes - Verify Your Email",
              Body : `
              <p>Thank you for registering with Trim Homes</p>
              <p>Here is your newly generate token <strong>${otpCode}</strong> to verify your email. </p>
              `
          }).then(
            this.$f7.preloader.hide(),
            this.$f7.dialog.alert(`A new generated token has been sent to ${userInfo.email}`, "Success"),
            message => console.log(message),
          );
          
            
          
            
    
          
      } catch (err) {
        console.log(err);
      }
      return true;
      
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
    padding-right: 35px;
  }

  .text-center {
    text-align: center;
  }

  .register-icon {
    font-size: 2.5rem;
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
