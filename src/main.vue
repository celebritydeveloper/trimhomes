<template>
    <!-- App -->
    <f7-app :params="f7params">
        <!-- Views/Tabs container -->
        <f7-views tabs class="safe-areas">
            <!-- Tabbar for switching views-tabs -->
            <f7-toolbar tabbar labels bottom>
            <f7-link tab-link="#view-home" tab-link-active icon-ios="f7:house_fill" icon-aurora="f7:house_fill" icon-md="material:home" text="Home"></f7-link>
            <f7-link tab-link="#view-properties" icon-ios="f7:square_list_fill" icon-aurora="f7:square_list_fill" icon-md="material:view_list" text="Properties"></f7-link>
            <f7-link tab-link="#view-portfolios" icon-ios="f7:briefcase" icon-aurora="f7:briefcase" icon-md="material:work" text="Portfolio"></f7-link>
            <f7-link tab-link="#view-menu" icon-ios="f7:bars" icon-aurora="f7:bars" icon-md="material:menu" text="Menu"></f7-link>
            </f7-toolbar>

            <!-- Your main view/tab, should have "view-main" class. It also has "tab-active" class -->
            <f7-view id="view-home" main tab tab-active url="/"></f7-view>

            <!-- Catalog View -->
            <f7-view id="view-properties" name="properties" tab url="/properties/"></f7-view>

            <!-- Settings View -->
            <f7-view id="view-portfolios" name="portfolios" tab url="/portfolios/"></f7-view>

            <!-- Settings View -->
            <f7-view id="view-menu" name="menu" tab url="/menu/"></f7-view>

        </f7-views>
    </f7-app>
</template>
<script>
// Import Routes...
import { f7App, f7Panel, f7View, f7Statusbar } from 'framework7-vue';
import routes from './routes.js';

let theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

export default {
    components: {
      f7App,
      f7Panel,
      f7View,
      f7Statusbar,
    },
    data() {
        return {
            f7params: {
                theme,
                routes,
                id: 'io.framework7.testapp',
            }
        }
    }
}
</script>