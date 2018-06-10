<template>
  <div class="full-height-relative" style="padding-top:24px;">
    <div class="messages-wrapper">
 
        <md-progress-bar v-show="loadingVisible" class="md-accent top-progress-bar" md-mode="indeterminate"></md-progress-bar>
        <span :class="{greenbackground:!loadingVisible}" v-show="mapText" class="md-body-1 map-text-control">{{mapText}}</span>
      </div>
      <md-progress-bar v-show="loadingVisible" class="md-accent top-progress-bar" md-mode="indeterminate"></md-progress-bar>
      <span v-show="mapText" class="md-body-1 map-text-control">{{mapText}}</span>


    <googlemap name="livemap" :geolocation="false" :markers="targetMarkerArray" :syncedMarkers="ambulanceMarkerObject">
    </googlemap>
  </div>
</template>

<style lang="sass" scoped>
#livemap-map{
    height:100%;
}
.messages-wrapper{
  position:absolute;
  top:0;
  right:0;
  left:0;
  height:24px;
  background-color:black;
  color:white !important;
  opacity:0.85;
  z-index:4;
  .greenbackground{
    background-color:green; 
  }
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
    this.mapText = "Waiting for help...";
  },
  beforeDestroy() {
    if (this.trackingWS != null) {
      console.log("closing ws user live map");
      if (this.trackingWS.readyState == this.trackingWS.OPEN) {
        this.trackingWS.close();
      }
    }
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
    }
  },
  data() {
    return {
      trackingWS: null,
      loadingVisible: true,
      ambulanceMarkerObject: [],
      targetMarkerArray: [
        Object.assign(eventService.getLatLng(this.event), {
          title: "Event location"
        })
      ],
      healthInterval: undefined,
      mapText: undefined
    };
  },
  methods: {
    initWebSocket(eventId) {
      this.trackingWS = liveFeedService.getWS(eventId, this.auth.token);
      this.trackingWS.onopen = e => {
        this.healthInterval = setInterval(() => {
          liveFeedService.sendHealth(this.trackingWS);
        }, 10000);
        //console.log("opened");
      };
      this.trackingWS.onclose = e => {
        // alert("ws closed");
      };
      this.trackingWS.onmessage = message => {
        this.onMessage(message);
      };
    },
    onMessage: function(message) {
      try {
        const parsed = JSON.parse(message.data);
        if (parsed.type === "ambLocUpdate") {
          this.mapText = "Help is on the way";
          this.loadingVisible = false;
          this.ambulanceMarkerObject = [getMarkerFromParsedMessage(parsed)];
        } else {
          if (parsed.type === "finishedEvent") {
            this.mapText = "Event completed";
            this.$emit("finishedEvent", parsed.value.eventId);
          }
        }
      } catch (err) {}
    }
  }
};
</script>

