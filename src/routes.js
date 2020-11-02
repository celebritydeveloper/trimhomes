import Home from './assets/vue/pages/home.vue';
import Menu from './assets/vue/pages/menu.vue';
import AboutPage from './assets/vue/pages/about.vue';
import SplashPage from './assets/vue/pages/splash.vue';
import PropertiesPage from './assets/vue/pages/properties.vue';
import PortfoliosPage from './assets/vue/pages/portfolios.vue';
import IndexPage from './assets/vue/pages/index.vue';
import RegisterPage from './assets/vue/pages/register.vue';
import SignInPage from './assets/vue/pages/login.vue';
import WithdrawalPage from './assets/vue/pages/withdrawal.vue';
import ContactPage from './assets/vue/pages/contact.vue';
import VerifyTokenPage from './assets/vue/pages/verify-token.vue';
import SetPasswordPage from './assets/vue/pages/set-password.vue';
import SettingsPage from './assets/vue/pages/settings.vue';
import UpdateProfilePage from './assets/vue/pages/update-profile.vue';
import UpdateAccountPage from './assets/vue/pages/update-account.vue';
import UpdatePasswordPage from './assets/vue/pages/update-password.vue';
import ForgotPasswordPage from './assets/vue/pages/forgot-password.vue';
import PropertyPage from './assets/vue/pages/property.vue';
import PortfolioPage from './assets/vue/pages/portfolio.vue';
import OutrightPaymentPage from './assets/vue/pages/outright-payment.vue';
import PaymentPage from './assets/vue/pages/payment.vue';
import BankDetailsPage from './assets/vue/pages/bank-details.vue';

import DynamicRoutePage from './assets/vue/pages/dynamic-route.vue';

import PanelLeftPage from './assets/vue/pages/panel-left.vue';
import ColorThemes from './assets/vue/pages/color-themes.vue';
import Chat from './assets/vue/pages/chat.vue';
import Vuex from './assets/vue/pages/vuex.vue';

export default [
  {
    path: '/',
    component: SignInPage
  },
  {
    path: '/home/',
    component: Home,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/menu/',
    component: Menu
  },
  {
    path: '/about/',
    component: AboutPage
  },
  {
    path: '/splash/',
    component: SplashPage
  },
  {
    path: '/index/',
    component: IndexPage
  },
  {
    path: '/register/',
    component: RegisterPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/properties/',
    component: PropertiesPage
  },
  {
    path: '/portfolios/',
    component: PortfoliosPage
  },
  {
    path: '/withdrawal/:id/',
    component: WithdrawalPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/contact/',
    component: ContactPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/verify-token/',
    component: VerifyTokenPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/set-password/',
    component: SetPasswordPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/settings/',
    component: SettingsPage,
    options: {
      transition: 'f7-circle',
    },
  }, 
  {
    path: '/update-profile/',
    component: UpdateProfilePage,
    options: {
      transition: 'f7-circle',
    },
  },  
  {
    path: '/update-account/',
    component: UpdateAccountPage,
    options: {
      transition: 'f7-circle',
    },
  },  
  {
    path: '/update-password/',
    component: UpdatePasswordPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/forgot-password/',
    component: ForgotPasswordPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/property/:id/',
    component: PropertyPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/portfolio/:id',
    component: PortfolioPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/outright-payment/',
    component: OutrightPaymentPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/payment/:id/',
    component: PaymentPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/bank-details/:id/',
    component: BankDetailsPage,
    options: {
      transition: 'f7-circle',
    },
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage
  },
  {
    path: '/color-themes/',
    component: ColorThemes
  },
  {
    path: '/chat/',
    component: Chat
  },
  {
    path: '/vuex/',
    component: Vuex
  },
];
