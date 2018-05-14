<template>
    <p v-show="false">{{defaultView}}</p>
</template>

<script>
import { mapGetters } from "vuex";
module.exports = {
  computed: {
    ...mapGetters({
      auth: "auth"
    }),
    defaultView: function() {
      if (this.auth) {
        if (this.auth.hasResourceRole("ambulance", "stay-safe-api")) {
          return this.$router.push("/activity");
        } else if (this.auth.hasResourceRole("dispatcher", "stay-safe-api")) {
          return this.$router.push("/assignments");
        } else {
          return this.$router.push("/report");
        }
      }
      return "";
    }
  },
  methods: {}
};
</script>
