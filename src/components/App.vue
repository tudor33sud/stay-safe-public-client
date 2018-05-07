<template>

    <body>
        This is app.vue
        <el-button class="tudor" > tudor
          <p class="dummy"> dummy</p>
        </el-button>
        <button @click="logout()"> logout </button>
        <div>
            <router-view></router-view>
        </div>

    </body>
</template>

<style lang="sass" scoped>
  .tudor {
    background-color: red !important;

    .dummy{
      color:blue;
    }
  }
</style>


<script>
module.exports = {
  mounted() {},
  methods: {
    logout: function() {
      this.$store.state.security.auth.logout();
    }
  }
};
</script>
