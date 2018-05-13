<template>

  <body>
    <!-- <md-content>
       <md-icon>menu</md-icon>
    <md-button @click="logout()">Tudor</md-button>
    <md-button class="md-icon-button">
        <md-icon>thumb_up</md-icon>
      </md-button>
      <div>
      <small>Raised</small>
      <md-button class="md-raised" @click="handleClick(1)">Default</md-button>
      <md-button class="md-raised" :md-ripple="false" @click="handleClick(0)">Ripple Off</md-button>
      <md-button class="md-raised md-primary" @click="handleClick(2)">Primary</md-button>
      <md-button class="md-raised md-accent">Accent</md-button>
      <md-button class="md-raised" disabled>Disabled</md-button>
          </div>
    </md-content> -->
    <router-view></router-view>
  </body>
</template>

<style lang="sass" scoped>

</style>


<script>
module.exports = {
  mounted() {},
  data() {
    return {
      isCollapse: false,
      menuItems: [
        {
          name: "Report",
          icon: "el-icon-location"
        },
        {
          name: "My events",
          icon: "el-icon-info"
        },
        {
          name: "Contact",
          icon: "el-icon-question"
        }
      ]
    };
  },
  methods: {
    logout: function() {
      this.$store.state.security.auth.logout();
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClick(menu) {
      if (menu == 0) {
        this.$router.push("/");
      } else if (menu == 1) {
        this.$router.push("/events");
      } else if (menu == 2) {
        this.$router.push("/events");
      }
    }
  }
};
</script>
