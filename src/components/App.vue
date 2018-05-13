<template>
  <div class="page-container md-layout-column">
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
        <md-list-item v-for="(menuItem,index) in menuItems" :key="menuItem.name" class="navigation-button" @click="handleClick(index)">
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
  // .page-container {
  //   overflow:auto;
  // }

   // Demo purposes only
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
import { mapGetters } from "vuex";
import * as eventService from "../service/events";
module.exports = {
  mounted: function() {
    let googleMapsScript = document.createElement("script");
    googleMapsScript.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=[keyhere]");
    document.head.appendChild(googleMapsScript);
  },
  computed: {
    ...mapGetters({
      auth: "auth"
    }),
    username: function() {
      if (this.auth) {
        const tokenParsed = this.auth.idTokenParsed;
        return tokenParsed.name;
      }
      return "";
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
      menuItems: [
        {
          name: "Report",
          icon: "add_location"
        },
        {
          name: "My events",
          icon: "event"
        },
        {
          name: "Contact",
          icon: "contact_support"
        }
      ]
    };
  },
  methods: {
    logout: function() {
      this.$store.state.security.auth.logout();
    },
    handleClick(menu) {
      if (menu == 0) {
        this.$router.push("/");
      } else if (menu == 1) {
        this.$router.push("/events");
      } else if (menu == 2) {
        this.$router.push("/events");
      }
      setTimeout(() => {
        this.showNavigation = false;
      }, 100);
    }
  }
};
</script>
