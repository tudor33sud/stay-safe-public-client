<template>
    <googlemap name="livemap" :geolocation="false" :markers="targetMarkerArray" :syncedMarkers="ambulanceMarkerObject">
    </googlemap>
</template>

<style lang="sass" scoped>
#livemap-map{
    height:100%;
}
</style>

<script>
import { mapGetters } from "vuex";
import * as liveFeedService from "../service/live-feed";
import * as eventService from "../service/events";
const ambulanceIcon = "/static/assets/ambulance.png";
function getMarkerFromParsedMessage(parsed) {
  const { lat, lng } = parsed.value;
  return {
    lat,
    lng,
    title: "ambulance",
    icon: ambulanceIcon
  };
}
module.exports = {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      auth: "auth"
    })
  },
  mounted() {
    this.initWebSocket(this.event.id);
  },
  beforeDestroy() {
    if (this.trackingWS != null) {
      if (this.trackingWS.readyState == this.trackingWS.OPEN) {
        this.trackingWS.close();
      }
    }
  },
  data() {
    return {
      trackingWS: null,
      ambulanceMarkerObject: [],
      targetMarkerArray: [
        Object.assign(eventService.getLatLng(this.event), {
          title: "Event location"
        })
      ]
    };
  },
  methods: {
    initWebSocket(eventId) {
      this.trackingWS = new WebSocket(
        `ws://localhost:8999?auth=${this.auth.token}&eventId=${eventId}`
      );
      this.trackingWS.onopen = e => {
        //console.log("opened");
      };
      this.trackingWS.onclose = e => {
        alert("ws closed");
      };
      this.trackingWS.onmessage = message => {
        this.onMessage(message);
      };
    },
    onMessage: function(message) {
      try {
        const parsed = JSON.parse(message.data);
        if (parsed.type === "ambLocUpdate") {
          this.ambulanceMarkerObject = [getMarkerFromParsedMessage(parsed)];
        }
      } catch (err) {}
    }
  }
};
</script>

