<template>

    <body>
        This is app.vue
        <button @click="logout()"> logout </button>
        <div>
            <router-view></router-view>
        </div>

    </body>
</template>

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
