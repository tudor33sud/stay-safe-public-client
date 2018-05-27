<template>
  <div>
    <div v-if="myEvents.length == 0 && !eventLive">
      <md-empty-state class="md-primary centered-container" md-icon="error" md-label="No events added yet">
        <md-button to="/report" class="stepper-next">Report now</md-button>
      </md-empty-state>
    </div>
    <div>
      <div v-if="!eventLive" class="md-layout cards-layout">
        <div v-for="event in myEvents" :key="event.id" class="md-layout-item md-size-25 md-medium-size-50 md-xsmall-size-100">
          <md-card class="md-card-example">
            <md-card-media>
              <img :src="getEventMap(event)" alt="map">
            </md-card-media>
            <md-card-area md-inset>
              <md-card-header>
                <div class="md-subhead">
                  <md-icon>location_on</md-icon>
                  <span>{{event.location.address}}</span>
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
              <md-button v-if="event.status==='busy' || event.status==='requested'" class="full-width md-primary" @click="goLive(event)" :md-ripple="false">Live</md-button>
              <md-button v-else class="full-width" disabled>Completed</md-button>
            </md-card-actions>
          </md-card>
        </div>
      </div>
    </div>
    <div style="height:100%;" v-if="eventLive">
      <userlivemap :event="selectedEvent" @finishedEvent="onFinishedEvent"></userlivemap>
    </div>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showEventFinished" md-persistent>
      <span>Event finished successfully!</span>
      <md-button class="md-primary" @click="showEventFinished = false; untrackEvent()">Ok</md-button>
    </md-snackbar>
  </div>
</template>

<style lang="sass" scoped>
$cards-spacing-big-screen: 24px;
$cards-spacing-medium-screen: 16px;
.cards-layout {
    margin-left:$cards-spacing-big-screen;
    margin-top: $cards-spacing-big-screen;
    @media screen and (max-width: 960px) {
      margin-left: $cards-spacing-medium-screen;
      margin-top: $cards-spacing-medium-screen;
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

  .md-card-media{
    img{
      border-radius: 10px 10px 0 0;
    }

  }


  &:last-child {
    margin-bottom: 16px;
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
      eventLive: false,
      showEventFinished:false
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
    },
    getEventMap(event) {
      //return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&scale=2&markers=icon:https://image.ibb.co/giFPt8/if_Emergency_off_132130.png|color:blue|label:event|${event.location.lat},${event.location.lng}&center=${event.location.lat},${event.location.lng}&zoom=18&key=AIzaSyCxFJ9kHyBMxweAlD_2mx_LiXxiDeV7kx4`;
      return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&scale=2&markers=color:red|label:event|${
        event.location.lat
      },${event.location.lng}&center=${event.location.lat},${
        event.location.lng
      }&zoom=17&key=AIzaSyCxFJ9kHyBMxweAlD_2mx_LiXxiDeV7kx4`;
    },
    onFinishedEvent(eventId) {
      this.showEventFinished=true;
      this.getEvents();
    },
    untrackEvent(){
      this.eventLive=false;
    }
  }
};
</script>
