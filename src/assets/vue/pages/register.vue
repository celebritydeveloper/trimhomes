<template>
  <f7-page>
  <f7-navbar class="home--nav">
    <f7-navbar back-link="Create Account" back-link-show-text></f7-navbar>
      <f7-nav-right>
        <img :src="logo" class="logo">
      </f7-nav-right>
    </f7-navbar>
    
    <f7-page-content class="register">
    <div class="block">
      <!--<div   class="dp">
        <img :src="user" class="user">
        <p>{{uploadValue.toFixed() + "%"}}
        <progress id="progress" :value="uploadValue" max="100" ></progress>  </p>
      </div>-->
   
       <img :src="user" class="user">
      
      
    </div>
    <form @submit.prevent="registerUser" no-store-data="true" class="list form-store-data" id="demo-form">
      <ul>
      <!--<li class="item-content item-input image">
          <div class="item-inner">
            <div class="item-input-wrap">
            
              <div class="preview">
                <img v-if="url" :src="url" class="user">
              </div>
              
              <div class="dp">
                <input name="image" id="image" class="upload" accept="image/*" type="file" @change="onFileChange" required validate data-error-message="Please upload your image!">
                <p>{{uploadValue.toFixed() + "%"}}
                <progress id="progress" :value="uploadValue" max="100" ></progress>  </p>
              </div>
            </div>
          </div>
      </li>-->
      <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">First Name</div>
            <div class="item-input-wrap">
              <input name="firstName" type="text" v-model="firstName" required validate data-error-message="Your Name is Required!">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Surname</div>
            <div class="item-input-wrap">
              <input name="lastName" type="text" v-model="lastName" required validate data-error-message="Your Name is Required!">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">E-mail</div>
            <div class="item-input-wrap">
              <input name="email" type="email" v-model="email" autocomplete="off" required validate data-error-message="Email must not be empty and should be valid!">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Phone Number</div>
            <div class="item-input-wrap">
              <vue-tel-input v-model="phone" enabledCountryCode showDialCode="true" tabindex="0" defaultCountry required></vue-tel-input>
              <small>{{phone}}</small>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Memorable Number</div>
            <div class="item-input-wrap">
              <input name="password" type="number" v-model="memorableNumber" required validate pattern="[0-9]*" data-error-message="Only numbers please!">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">How Did You Hear About Us?:</div>
            <div class="item-input-wrap input-dropdown-wrap">
              <select v-model="selected">
                <option :value="medium.value" v-for="(medium, index) in referrer" :key="index">
                    {{medium.text}}
                </option>
              </select>
            </div>
          </div>
        </li>
        <li class="item-content item-input" v-if="showStaff">
          <div class="item-inner">
            <div class="item-title item-label">Staff Name or Number</div>
            <div class="item-input-wrap">
              <input name="password" type="text" v-model="staff"  required validate data-error-message="Cannot be empty">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li>
          <p class="terms">By clicking ‘Create Account’, you agree to our  
          <f7-link class="forgot-btn" href="https://trimhomes.co.uk/privacy-policy" external target="_blank">Terms &amp; Conditions</f7-link> 
          and our  
          <f7-link class="forgot-btn" href="https://trimhomes.co.uk/privacy-policy" external target="_blank" > Privacy Policy.</f7-link></p>
          <f7-button fill raised large class="register--btn" type="submit">Create Account</f7-button>
        </li>
        
      </ul>
    </form>
    </f7-page-content>
  </f7-page>
</template>
<script>
import logo from '../../images/logo-nav.png';
import user from '../../images/user.png';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage'
import OTP from 'otp-client';


const secret = 'TPQDAHVBZ5NBO5LFEQKC7V7UPATSSMFY'
const otp = new OTP(secret);
const token = otp.getToken();

const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

let pics;
export default {
  name: "Upload",
  data() {
    return {
      errors: [],
      logo,
      user,
      selected: null,
      img: null,
      imageData: null,
      picture: null,
      url: null,
      uploadValue: 0,
      firstName: '',
      lastName: '',
      email: "",
      region: "",
      phone: "",
      memorableNumber: "",
      staff: "",
      referrer: [
          { value: null, text: 'How did you hear about us?' },
          { value: 'Family', text: 'Family' },
          { value: 'Friend', text: 'Friend' },
          { value: 'Private Institution', text: 'Private Institution' },
          { value: 'Advert', text: 'Advert' },
          { value: 'Social Media', text: 'Social Media'},
          { value: 'Member of Staff', text: 'Member of Staff'}
      ],
    }
  },
  computed: {
    showStaff: function(){
          if(this.selected === 'Member of Staff') {
            return true;
          }
      }
  },
  methods: {

    // previewImage(event) {
    //   this.uploadValue = 0;
    //   this.picture = null;
    //   this.imageData = event.target.files[0];
    // },

    // onFileChange(e) {
    //   this.imageData = event.target.files[0];
    //   const file = e.target.files[0];
    //   this.url = URL.createObjectURL(file);
    // },

    async registerUser() {
      this.$f7.preloader.show();
      try {
            Email.send({
              secureToken: "6d7fcff4-680b-48bd-a69c-43f92f919962",
              Host : "smtp.elasticemail.com",
              Username : "mail@trimhomes.co.uk",
              Password : "70C480D70078C27D7CC5C00B9A747FB3D19D",
              To : this.email,
              From : "mail@trimhomes.co.uk",
              Subject : "Verify Your Email - Trim Homes",
              Body : `
              <!doctype html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>TrimHomes Verify Token Email</title>
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
                                      <p style="background: #2B3D4C; padding: 0 0; text-align: center;"><img src="https://lirp-cdn.multiscreensite.com/7e157610/dms3rep/multi/opt/3-68f7e3f4-218w.png" style="width: 120px;"></p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello <strong>${this.firstName}</strong>,</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thank you for registering with Trim Homes</p>
                                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Use the following code to verify your email address</p>
                                        <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                          <tbody>
                                            <tr>
                                              <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                  <tbody>
                                                    <tr>
                                                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <span style="display: inline-block; color: #ffffff; background-color: #2B3D4C; border: solid 1px #2B3D4C; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">${token}</span> </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
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
          ).then(() => {
            const userInfo = {
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email,
              image: '',
              memorableNumber: this.memorableNumber,
              phone: this.phone,
              country: '',
              bankName: '',
              bankNumber: '',
              bankAccountName: '',
              bankSortCode: '',
              referrer: this.selected,
              staff: this.staff,
              verified: false,
              created: new Date(),
              token
            }
            localStorage.setItem('trimhomesUser', JSON.stringify(userInfo));
          }).then(() => {
          this.$f7.preloader.hide();
          this.$f7router.navigate('/verify-token/');
        }); 
          
      } catch (err) {
        this.$f7.dialog.alert(err, "Error");
        console.log(err);
      }

      this.errors = [];

      if (!this.fullName) {
        this.errors.push('Name required.');
      }
      if (!this.email) {
        this.errors.push('Age required.');
      }
    }
  },
  components: {},
};
</script>

<style scoped>

  body {
        font-family: 'Montserrat', sans-serif;
        overflow: hidden;
    }

    .navbar .navbar-bg {
        background: none !important;
        background-color: #2B3D4C !important;
        background-image: none !important;
        height: 0px;
    }


    .text-black {
        color: #000;
    }

  .register {
    background: #fff;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    padding-bottom: 1rem;
    padding-top: 1rem;
    padding-left: 0.8rem;
    padding-right: 0.5rem;

  }

  .block {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 5px;
    margin-top: 0.5rem;
    padding-bottom: 5px;
  }

  .block-strong::before, .block-strong::after{
    height: 0px;
    width: 0px;
  }

  .image {
    text-align: center;
  }


  .dp {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .user {
    border-radius: 50%;
    height: 100px;
    object-fit: cover;
    width: 100px;
  }

  .upload::-webkit-file-upload-button {
    color: transparent;
    display: none;
    text-align: center;
  }

  .preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview img {
  max-width: 100%;
  max-height: 500px;
}

  /* The overlay effect (full height and width) - lays on top of the container and over the image */
.overlay {
  border-radius: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  width: 100px;
  opacity: 1;
  transition: .3s ease;
  background-color: rgba(0, 0, 0, 0.5);
}

.icon {
  color: white;
  font-size: 1.2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}
  

  .upload::before {
    align-items: center;
    border: 1px solid #2B3D4C;;
    content: 'Upload a Profile Picture';
    display: flex;
    border-radius: 3px;
    justify-content: center;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
    margin-top: 1rem;
    padding: 0.5rem;
    text-align: center;
  }

  .register--title {
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

  .list .image .item-inner{
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center !important;
    width: 100%;
  }

  .list .image .item-inner .item-input-wrap::after {
    height: 0px;
    width: 0px;
  }

  .terms {
    color: #2B3D4C;
    font-size: 0.6rem;
    font-weight: lighter;
    padding: 5px 90px 5px 20px;
  }

  .terms .forgot-btn {
    color: #2B3D4C;
    display: inline;
    font-size: 0.6rem;
    font-weight: 500;
    text-decoration: underline;
    text-transform: capitalize;
  }

  .register--btn {
    background: #2B3D4C;
    color: #fff;
    margin: 0 auto;
    width: 90%;
  }

  .signup--btn {
    background: #fff;
    color: #2B3D4C;
    border: 1px solid #2B3D4C;
    border-radius: 0px;
    margin: 0 auto;
    width: 90%;
  }
</style>