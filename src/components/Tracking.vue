<template>
  <div>
    <div class="md-layout">
      <div v-if="!trackingEvent" class="cards-layout" v-for="event in trackingEvents" :key="event.id" :class="setCardLayout()">
        <md-card class="md-card-example">
          <md-card-area md-inset>
            <md-card-header>
              <h2 class="md-title">{{event.requester.display}}</h2>
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
    <div style="height:100%;position:relative;" v-if="trackingEvent">
      <div style="height: 100%">
        <trackingmap :event="selectedEvent" @eventFinished="untrackEvent"></trackingmap>
      </div>
    </div>
  </div>

</template>
<style lang="sass" scoped>
.cards-layout{
    .md-card {
        display: block;
        margin: 16px 16px 0 16px;
    }

    &:last-child{
        margin-bottom:16px;
    }
}


.md-card-example {
    .md-title{
        overflow: hidden;
	    text-overflow: ellipsis;
    }
    .md-subhead {
        .md-icon {
            $size: 16px;

            width: $size;
            min-width: $size;
            height: $size;
            font-size: $size !important;
        }

        span {
            vertical-align: middle;
        }
    }
    

    .card-details {
        margin-top: 8px;
        display: flex;
        align-items: center;

        .md-icon {
            margin: 8px 0;
        }
    }

    .md-button-group {
        display: flex;
        .description-item{
            margin-left: 16px;
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
      eventsPolling: undefined,
      geolocationInterval: undefined,
      currentPosition: undefined
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
    },
    formatDate(dateString) {
      return moment(dateString).fromNow();
    },
    getGravityClass(gravity) {
      if (gravity === 0) {
        return ["md-accent"];
      }
      return [];
    }
  }
};
</script>
