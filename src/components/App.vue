<template>

  <body>
    <el-container class="container">
      <el-header class="ss-header">
        Stay safe
        <el-button @click="logout()">Logout</el-button>
      </el-header>
      <el-container class="ss-body">
        <el-aside style="width:200px;" class="ss-nav">
          <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse">
            <el-menu-item v-for="(menuItem,index) in menuItems" :key="menuItem.name" :index="index.toString()" @click="handleClick">
              <i :class="menuItem.icon"></i>
              <span slot="title">{{menuItem.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="ss-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- This is app.vue
        <el-button class="tudor" > tudor
          <p class="dummy"> dummy</p>
        </el-button>
        <button @click="logout()"> logout </button>
        <div>
            <router-view></router-view>
        </div> -->

  </body>
</template>

<style lang="sass" scoped>
  .container{
    height: 100vh;

    .ss-header{
      background-color: #414141;
      line-height: 60px;
      color:white;
    }
  }


  .el-menu{
    height:100%;
  }
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
      if (menu.index == 0) {
        this.$router.push("/");
      } else if (menu.index == 1) {
        this.$router.push("/events");
      } else if (menu.index == 2) {
        this.$router.push("/contact");
      }
    }
  }
};
</script>
