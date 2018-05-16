<template>
  <div class="page-container">
    <md-toolbar class="md-primary fixedSizeToolbar">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">Stay safe</span>

      <div class="md-toolbar-section-end" v-show="authenticated">
        <md-menu md-align-trigger>
          <span md-menu-trigger>
            <md-avatar class="md-avatar-icon" style="margin:0">{{username.substr(0,1)}}</md-avatar>
          </span>
          <md-menu-content>
            <md-menu-item class="md-primary">{{username}}</md-menu-item>
            <md-divider></md-divider>
            <md-menu-item @click="logout()">Logout</md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </md-toolbar>

    <md-drawer :md-active.sync="showNavigation">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Stay safe</span>
      </md-toolbar>

      <md-list>
        <md-list-item v-for="menuItem in menuItems" :key="menuItem.name" class="navigation-button" @click="handleClick(menuItem.name)">
          <md-icon>{{menuItem.icon}}</md-icon>
          <span class="md-list-item-text">{{menuItem.name}}</span>
        </md-list-item>
      </md-list>
    </md-drawer>
    <router-view class="router-view">
    </router-view>
  </div>
</template>


<style lang="sass" scoped>
  .fixedSizeToolbar{
    min-height:56px;
  }
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .router-view{
    height: calc(100vh - 56px);
    overflow:auto;
  }
</style>


<script>
import { mapGetters, mapActions } from "vuex";
import * as eventService from "../service/events";
const menus = {
  REPORT: "Report",
  MY_EVENTS: "My events",
  CONTACT: "Contact",
  TRACKING: "Tracking",
  ASSIGNMENTS: "Assignments"
};
module.exports = {
  mounted: function() {
    //add viewport meta tag
    let metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "viewport");
    metaTag.setAttribute("content", "width=device-width,initial-scale=1.0");
    document.head.appendChild(metaTag);
    //add google maps scripts
    let googleMapsScript = document.createElement("script");
    googleMapsScript.setAttribute(
      "src",
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCxFJ9kHyBMxweAlD_2mx_LiXxiDeV7kx4"
    );
    document.head.appendChild(googleMapsScript);
  },
  computed: {
    ...mapGetters({
      auth: "auth",
      userInfo: "userInfo"
    }),
    username: function() {
      if (this.auth) {
        const tokenParsed = this.auth.idTokenParsed;
        return tokenParsed.name;
      }
      return "";
    },
    menuItems: function() {
      if (this.auth) {
        if (this.auth.hasResourceRole("ambulance", "stay-safe-api")) {
          return this.menuItemsAmbulance;
        }
        if (this.auth.hasResourceRole("dispatcher", "stay-safe-api")) {
          return this.menuItemsDispatcher;
        }
      }
      return this.menuItemsUser;
    },
    authenticated: function() {
      if (this.auth) {
        return this.auth.authenticated;
      }
      return false;
    }
  },
  data() {
    return {
      showNavigation: false,
      menuItemsUser: [
        {
          name: menus.REPORT,
          icon: "add_location"
        },
        {
          name: menus.MY_EVENTS,
          icon: "event"
        },
        {
          name: menus.CONTACT,
          icon: "contact_support"
        }
      ],
      menuItemsAmbulance: [
        {
          name: menus.TRACKING,
          icon: "add_location"
        },
        {
          name: menus.CONTACT,
          icon: "contact_support"
        }
      ],
      menuItemsDispatcher: [
        {
          name: menus.ASSIGNMENTS,
          icon: "add_location"
        },
        {
          name: menus.CONTACT,
          icon: "contact_support"
        }
      ]
    };
  },
  methods: {
    ...mapActions(["loadUserInfo"]),
    logout: function() {
      this.$router.push("/");
      this.$store.state.security.auth.logout();
    },
    handleClick(menu) {
      if (menu == menus.REPORT) {
        this.$router.push("/report");
      } else if (menu == menus.MY_EVENTS) {
        this.$router.push("/events");
      } else if (menu == menus.CONTACT) {
        this.$router.push("/contact");
      } else if (menu == menus.TRACKING) {
        this.$router.push("/tracking");
      } else if (menu == menus.ASSIGNMENTS) {
        this.$router.push("/assignments");
      }
      setTimeout(() => {
        this.showNavigation = false;
      }, 100);
    }
  }
};
</script>
