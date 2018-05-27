<template>
  <div style="height:100%">
    <googlemap name="tracking" :currentLocationDraggable="false" :geolocationIcon="getAmbulanceIcon()" :markers="[targetMarker]" :syncGeolocation="true" @currentLocationChanged="currentLocationChanged">
    </googlemap>
    <div class="details-container" :class="{fullscreen:detailsFullScreen}">
      <div v-if="detailsFullScreen" class="event-details">
        <div class="event-detail-item">
          <md-icon>add_alarm</md-icon> {{formatDate(event.createdAt)}}
        </div>
        <div class="event-detail-item">
          <md-icon>account_circle</md-icon> {{event.requester.display}}
        </div>
        <div class="event-detail-item">
          <md-icon>attachment</md-icon>
          <span> Attached images</span>
          <div class="md-layout">
            <div v-for="attachmentData in attachmentsData" class="md-layout-item md-size-25 md-medium-size-50 md-small-size-100 image-wrapper">
              <img style="width:100%;height:100%;" :src="attachmentData" alt="event pictue">
            </div>
          </div>
        </div>
      </div>

      <md-button class="md-raised md-icon-button btn-details" @click="detailsFullScreen = !detailsFullScreen">
        <md-icon>unfold_more</md-icon>
      </md-button>
      <md-button class="md-raised md-icon-button btn-success md-primary" @click="finishEvent(event)">
        <md-icon>check</md-icon>
      </md-button>
    </div>
  </div>

</template>

<style lang="sass" scoped>
#tracking-map{
  height:100%;
}

$text-color-white: #fff;
$text-color-black: #000;
.details-container{
  .event-details{
    width:100%;
    color:$text-color-white;
    font-size:16px;
    padding: 24px;
    padding-right:0;

    .event-detail-item {
      margin-bottom: 8px;

      .md-layout {
        margin-top: 18px;
        margin-right: 60px;
      }

      span {
        margin-bottom: 18px;
      }

      .image-wrapper{
        padding-right: 18px;
        padding-bottom: 18px;
        img {
         border-radius: 36px;
        }
      }
    }
    .md-icon{
      color:$text-color-white;
    }
    height: 100%; 
    overflow:auto;
  }
  background-color: rgba(0,0,0, 0.85);

  &.fullscreen{
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    .md-icon-button{
      right:30px;
    }
  }

  .md-icon-button{
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    /* left: 0; */
    right: 8px;
    bottom: 90px;
    &.btn-success {
      bottom: 40px;
    }


  }
}
</style>

<script>
import { mapGetters } from "vuex";
import * as liveFeedService from "../service/live-feed";
import * as eventService from "../service/events";
import * as trackingService from "../service/tracking";
import moment from "moment";
const ambulanceIcon = "/static/assets/ambulance.png";
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
    this.getAttachment(this.event);
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
      currentLocation: null,
      targetMarker: Object.assign(eventService.getLatLng(this.event), {
        title: "target location"
      }),
      detailsFullScreen: false,
      attachmentsData: []
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
        this.onTrackingMessage(message);
      };
    },
    onTrackingMessage: function(message) {},
    sendLocation: function(location) {
      const { lat, lng } = location;
      liveFeedService.sendLocation(this.trackingWS, lat, lng);
    },
    sendEventFinished: function(eventId) {
      liveFeedService.sendEventFinished(this.trackingWS, eventId);
    },
    currentLocationChanged: function(position) {
      this.currentLocation = position;
      if (this.trackingWS.readyState !== this.trackingWS.OPEN) {
        return;
      }
      this.sendLocation(position);
    },
    getAttachment: function(event) {
      const getAttachmentsRequests = event.attachments.map(attachment => {
        return eventService.getAttachment(event.id, attachment.id);
      });
      Promise.all(getAttachmentsRequests)
        .then(responses => {
          this.attachmentsData = responses.map(response => {
            const imageData =
              "data:image/png;base64, " +
              new Buffer(response.data, "binary").toString("base64");
            return imageData;
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    finishEvent: function(event) {
      trackingService
        .finishEvent(event.id)
        .then(response => {
          return this.sendEventFinished(event.id);
        })
        .then(() => {
          this.$emit("eventFinished", event.id);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAmbulanceIcon: function() {
      return ambulanceIcon;
    },
    formatDate(dateString) {
      return moment(dateString).fromNow();
    }
  }
};
</script>

