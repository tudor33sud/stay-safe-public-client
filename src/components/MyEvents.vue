<template>
    <div>
        <div class="md-layout">
            <div v-if="!eventLive" v-for="event in myEvents" :key="event.id" class="cards-layout md-layout-item md-size-25 md-medium-size-50 md-xsmall-size-100">
                <md-card class="md-card-example">
                    <md-card-area md-inset>
                        <md-card-header>
                            <h2 class="md-title">{{event.requester.display}}</h2>
                            <div class="md-subhead">
                                <md-icon>location_on</md-icon>
                                <span>{{event.location}}</span>
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
                                <!-- <md-chip>Car crash</md-chip>
                                <md-chip class="md-accent">SOS</md-chip> -->
                            </div>
                        </div>
                    </md-card-content>

                    <md-card-actions>
                        <md-button v-if="event.status==='busy' || event.status==='new'" class="full-width md-primary" @click="goLive(event)" :md-ripple="false">Live</md-button>
                        <md-button class="full-width">View Details</md-button>
                    </md-card-actions>
                </md-card>
            </div>
        </div>
        <div style="height:100%;" v-if="eventLive">
            <userlivemap :event="selectedEvent"></userlivemap>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.cards-layout {
  .md-card {
    display: block;
    margin: 16px 16px 0 16px;
  }

  &:last-child {
    margin-bottom: 16px;
  }
}

.md-card-example {
  .md-title {
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
    .description-item {
      margin-left: 16px;
    }
  }
}
</style>

<script>
import * as eventService from "../service/events.js";
import moment from "moment";
module.exports = {
  mounted() {
    this.getEvents();
  },
  data() {
    return {
      myEvents: [],
      selectedEvent: undefined,
      eventLive: false
    };
  },
  methods: {
    getEvents: function() {
      eventService
        .getEvents()
        .then(response => {
          if (response.status == 204) {
            return (this.myEvents = []);
          }
          this.myEvents = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatDate(dateString) {
      return moment(dateString).fromNow();
    },
    getGravityClass(gravity) {
      if (gravity === 0) {
        return ["md-accent"];
      }
      return [];
    },
    goLive(event) {
      this.selectedEvent = event;
      this.eventLive = true;
    }
  }
};
</script>
