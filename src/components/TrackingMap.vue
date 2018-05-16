<template>
    <googlemap name="tracking" 
    :currentLocationDraggable="false" 
     :markers="[targetMarker]"
     :syncGeolocation="true"
    @currentLocationChanged="currentLocationChanged" >
   </googlemap>
</template>

<style lang="sass" scoped>

</style>

<script>
import { mapGetters } from "vuex";
import * as liveFeedService from "../service/live-feed";
import * as eventService from "../service/events";
module.exports = {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  mounted() {},
  data() {
    return {
      trackingWS: null,
      currentLocation: null,
      targetMarker: Object.assign(eventService.getLatLon(this.event), {
        title: "target location"
      })
    };
  },
  methods: {
    initWebSocket(eventId) {
      this.trackingWS = new WebSocket(
        `ws://localhost:8999?auth=${this.auth.token}&eventId=${eventId}`
      );
      this.trackingWS.onopen = e => {
        console.log("opened");
      };
      this.trackingWS.onclose = e => {
        alert("ws closed");
      };
      this.trackingWS.onmessage = message => {
        this.onTrackingMessage(message);
      };
    },
    onTrackingMessage: function(message) {
      console.log(message);
    },
    sendLocation: function(location) {
      const { lat, lng } = location;
      liveFeedService.sendLocation(this.trackingWS, lat, lng);
    },
    currentLocationChanged: function(position) {
      this.currentLocation = position;
    }
  }
};
</script>

