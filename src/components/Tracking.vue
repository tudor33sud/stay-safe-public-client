<template>
    <div>
        <div class="md-layout">
            <div class="cards-layout" v-for="event in trackingEvents" :key="event.id" :class="setCardLayout()">
                <md-card class="md-card-example">
                    <md-card-area md-inset>
                        <!-- <md-card-media md-ratio="16:9">
                            <img src="https://images.unsplash.com/photo-1516841273335-e39b37888115?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1c3cfbc7fc9f2c648d415fc8a97ef74d&auto=format&fit=crop&w=1331&q=80" alt="Coffee House">
                        </md-card-media> -->

                        <md-card-header>
                            <h2 class="md-title">{{event.requester.display}}</h2>
                            <div class="md-subhead">
                                <md-icon>location_on</md-icon>
                                <span>2 miles</span>
                            </div>
                        </md-card-header>

                        <!-- <md-card-content>
                            Event description (if available)
                        </md-card-content> -->
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
                        <md-button class="full-width" :md-ripple="false">Accept</md-button>
                    </md-card-actions>
                </md-card>

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
    //this.initWebSocket();
    this.getEvents();
  },
  computed: {
    ...mapGetters({
      auth: "auth"
    })
  },
  data() {
    return {
      trackingWS: null,
      trackingEvents: []
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
    initWebSocket(eventId) {
      this.trackingWS = new WebSocket(
        `ws://localhost:8999?auth=${this.auth.token}&eventId=${eventId}`
      );
      this.trackingWS.onopen = e => {
        console.log('opened')
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
    handleGetEvents: function(newEvents) {
      this.trackingEvents = newEvents;
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
        .then(response => {})
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
