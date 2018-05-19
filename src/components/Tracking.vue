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
                                <span>2 miles</span>
                            </div>
                        </md-card-header>
                    </md-card-area>

                    <md-card-content>
                        <h3 class="md-subheading">Details</h3>
                        <div class="card-reservation">
                            <md-icon>access_time</md-icon>
                            <div class="md-button-group">
                                <span class="description-item">{{formatDate(event.createdAt)}}</span>
                            </div>
                        </div>
                        <div class="card-reservation">
                            <md-icon>local_offer</md-icon>
                            <div class="md-button-group">
                                <md-chip>Car crash</md-chip>
                                <md-chip class="md-accent">SOS</md-chip>
                            </div>
                        </div>
                    </md-card-content>

                    <md-card-actions>
                        <md-button class="full-width" @click="performEvent(event.id)" :md-ripple="false">Accept</md-button>
                    </md-card-actions>
                </md-card>

            </div>
        </div>
        <div style="height:100%" v-if="trackingEvent">
            <trackingmap  :event="selectedEvent"></trackingmap>
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
    

    .card-reservation {
        margin-top: 8px;
        display: flex;
        align-items: center;
        //justify-content: space-between;

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
module.exports = {
  mounted() {
    this.getEvents();
    this.eventsPolling = setInterval(() => {
      if (!this.trackingEvent) {
        this.getEvents();
      }
    }, 4000);
  },
  beforeDestroy() {
    clearInterval(this.eventsPolling);
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
      eventsPolling: undefined
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
    getEvents: function() {
      trackingService
        .getTrackingEvents()
        .then(response => {
          this.trackingEvents = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    performEvent: function(eventId) {
      trackingService
        .performEvent(eventId)
        .then(response => {
          this.selectedEvent = response.data;
          this.trackingEvent = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatDate(dateString) {
      return moment(dateString).fromNow();
    }
  }
};
</script>
