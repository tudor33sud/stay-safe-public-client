<template>
  <div class="full-height-relative">
    <md-progress-bar v-show="loadingVisible" style="position:absolute;top:0;right:0;left:0;" class="md-accent" md-mode="indeterminate"></md-progress-bar>
    <div v-if="trackingEvents.length == 0 && !trackingEvent">
      <md-empty-state class="md-accent centered-container" md-icon="done" md-label="Nothing to track" md-description="City is safe now.">
      </md-empty-state>
    </div>
    <div v-if="!trackingEvent" class="md-layout cards-layout">
      <div v-for="event in trackingEvents" :key="event.id" :class="setCardLayout()">
        <md-card class="md-card-example">
          <md-card-area md-inset>
            <md-card-header>
              <h3 class="md-title">
                <md-icon>account_circle</md-icon> {{event.requester.display}}</h3>
              <div class="md-subhead">
                <md-icon>location_on</md-icon>
                <span>{{event.distance? `${event.distance}km`:`N/A`}}</span>
              </div>
            </md-card-header>
          </md-card-area>

          <md-card-content>
            <h3 class="md-subheading">Details</h3>
            <div class="card-details">
              <md-icon>access_time</md-icon>
              <div class="md-button-group">
                <span class="description-item">{{formatDate(event.createdAt)}}</span>
              </div>
            </div>
            <div class="card-details">
              <md-icon>local_offer</md-icon>
              <div class="md-button-group">
                <md-chip v-for="tag in event.tags" :key="tag.name" :class="getGravityClass(tag.gravity)">
                  {{tag.name}}
                </md-chip>
              </div>
            </div>
          </md-card-content>

          <md-card-actions>
            <md-button class="full-width" @click="performEvent(event.id)" :md-ripple="false">Accept</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showEventConflict" md-persistent>
      <span class="md-accent">Event has already been taken</span>
      <md-button class="md-accent" @click="showEventConflict = false">Ok</md-button>
    </md-snackbar>
    <div style="height:100%;position:relative;" v-if="trackingEvent">
      <div style="height: 100%">
        <trackingmap :event="selectedEvent" @eventFinished="untrackEvent"></trackingmap>
      </div>
    </div>
  </div>

</template>
<style lang="sass" scoped>
$cards-spacing-big-screen: 24px;
$cards-spacing-medium-screen: 16px;
.cards-layout{
    padding-left:$cards-spacing-big-screen;
    padding-top: $cards-spacing-big-screen;
    @media screen and (max-width: 960px) {
      padding-left: $cards-spacing-medium-screen;
      padding-top: $cards-spacing-medium-screen;
    }
    .md-card {
        border-radius: 10px;      
        display: block;
        margin-right: $cards-spacing-big-screen;
        margin-bottom: $cards-spacing-big-screen;
        @media screen and (max-width: 960px) {
          margin-right: $cards-spacing-medium-screen;
          margin-bottom: $cards-spacing-medium-screen;
        }
    }
}

</style>

<script>
import { mapGetters } from "vuex";
import * as eventService from "../service/events";
import * as tagsService from "../service/tags";
import * as trackingService from "../service/tracking";
import moment from "moment";
import getDistance from "../utils/distance";
module.exports = {
  mounted() {
    this.getEvents(true).then(response => {
      if (response.status == 204) {
        this.getEvents();
      } else {
        this.trackEvent(response.data[0]);
      }
      this.eventsPolling = setInterval(() => {
        if (!this.trackingEvent) {
          this.getEvents();
        }
      }, 4000);
    });

    navigator.geolocation.getCurrentPosition(this.onPositionSuccess);
    this.geolocationInterval = setTimeout(() => {
      navigator.geolocation.getCurrentPosition(this.onPositionSuccess);
    }, 4000);
  },
  beforeDestroy() {
    clearInterval(this.eventsPolling);
    clearInterval(this.geolocationInterval);
  },
  computed: {
    ...mapGetters({
      auth: "auth"
    })
  },
  data() {
    return {
      trackingWS: null,
      trackingEvents: [],
      trackingEvent: false,
      selectedEvent: null,
      loadingVisible: false,
      eventsPolling: undefined,
      geolocationInterval: undefined,
      currentPosition: undefined,
      showEventConflict: false
    };
  },
  methods: {
    setCardLayout(index) {
      return [
        "md-layout-item",
        "md-size-25",
        "md-medium-size-50",
        "md-xsmall-size-100"
      ];
    },
    onPositionSuccess: function(position) {
      if (!this.currentPosition && !this.trackingEvent) {
        this.getEvents();
      }
      this.currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    },
    getEvents: function(active = false) {
      return trackingService
        .getTrackingEvents(active)
        .then(response => {
          const events = response.data;
          if (active == true || response.status == 204) {
            this.trackingEvents = [];
            return response;
          }
          if (!this.currentPosition) {
            this.trackingEvents = response.data;
          } else {
            const mappedEvents = response.data.map(event => {
              const eventWithLatLong = Object.assign({}, event, {
                location: eventService.getLatLng(event)
              });
              eventWithLatLong.distance = getDistance(
                this.currentPosition,
                eventWithLatLong.location
              ).toFixed(2);
              return eventWithLatLong;
            });
            const sorted = mappedEvents.sort((a, b) => {
              if (a.distance > b.distance) {
                return 1;
              }
              if (a.distance < b.distance) {
                return -1;
              }
              return 0;
            });
            this.trackingEvents = sorted;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    performEvent: function(eventId) {
      trackingService
        .performEvent(eventId)
        .then(response => {
          this.trackEvent(response.data);
        })
        .catch(err => {
          debugger;
          if (err.response) {
            if (err.response.status === 409) {
              this.showEventConflict = true;
            }
          }
          console.log(err);
        });
    },
    trackEvent: function(event) {
      this.selectedEvent = event;
      this.trackingEvent = true;
    },
    untrackEvent: function(eventId) {
      this.selectedEvent = undefined;
      this.trackingEvent = false;
      // this.trackingEvents = [];
      this.getEvents();
    },
    formatDate(dateString) {
      return moment(dateString).fromNow();
    },
    getGravityClass(gravity) {
      if (gravity === 0) {
        return ["high-gravity"];
      }
      return [];
    }
  }
};
</script>
