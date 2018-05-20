<template>
  <div>
    <md-empty-state v-if="!creatingEvent && !stepperFinished" style="margin-top:32vh;" md-label="Any danger nearby?">
      <span @click="creatingEvent = !creatingEvent" class="glowing-item">
        <md-icon style="color:white;font-size:46px">local_hospital</md-icon>
      </span>
    </md-empty-state>
    <md-empty-state class="md-primary" v-if="stepperFinished && !eventLive" style="margin-top:18vh;" md-label="All set. Wanna go live?" md-icon="check_circle">
      <md-button class="md-primary stepper-next" @click="goLive()">Go Live</md-button>
      <md-button @click="resetComponent()" class="stepper-next">Back</md-button>
    </md-empty-state>

    <md-content v-if="creatingEvent" class="my-content">
      <md-steppers md-vertical md-linear :md-active-step.sync="activeStepperStep">
        <md-step id="locationStepper" md-label="Location" md-description="Adjust your current location" :md-done.sync="locationSent" :md-editable="false">
          <googlemap name="reportMap" @currentLocationChanged="currentLocationChanged"></googlemap>
          <div class="md-layout " :class="continueStepAlignment">
            <md-button class="md-dense md-primary stepper-next" @click="advanceStepHandler('locationSent', 'tagsStepper')">Continue</md-button>
          </div>
        </md-step>

        <md-step id="tagsStepper" md-label="Tags" :md-done.sync="tagsCompleted" :md-editable="false">
          <md-field>
            <label for="tags">Tags</label>
            <md-select v-model="selectedTags" name="tags" id="tags" multiple>
              <md-option v-for="tag in tags" :key="tag.id" :value="tag.id">{{tag.name}}</md-option>
            </md-select>
          </md-field>
          <div class="md-layout" :class="continueStepAlignment">
            <md-button class="md-dense md-primary stepper-next" @click="advanceStepHandler('tagsCompleted', 'addPhotoStepper')">Continue</md-button>
          </div>
          <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showNoTagsSelectedError" md-persistent>
            <span>You must select at least one tag!</span>
            <md-button class="md-accent" @click="showNoTagsSelectedError = false">Dismiss</md-button>
          </md-snackbar>
          <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showEventError" md-persistent>
            <span>Oops! There was an error while sending your event!</span>
            <md-button class="md-accent" @click="showEventError = false">Dismiss</md-button>
          </md-snackbar>
        </md-step>

        <md-step id="addPhotoStepper" md-label="Add a photo" md-description="Optional" :md-done.sync="photoAdded" :md-editable="false">
          <md-field>
            <label>Photo</label>
            <md-file v-model="currentFileSelection" @md-change="onFileSelection" />
          </md-field>
          <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showUploadError" md-persistent>
            <span>There was an error uploading your file</span>
            <md-button class="md-accent" @click="showUploadError = false">Dismiss</md-button>
          </md-snackbar>
          <div class="md-layout" :class="continueStepAlignment">
            <md-button class="md-dense md-accent stepper-next" @click="advanceStepHandler('photoAdded', 'endStepper')">Finish</md-button>
          </div>
        </md-step>
      </md-steppers>
    </md-content>
    <div style="height:100%;" v-if="eventLive">
      <userlivemap :event="createdEvent" @finishedEvent="onFinishedEvent"></userlivemap>
    </div>
  </div>

</template>
<style lang="sass" scoped>

.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all 2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


.success{
    .md-icon {
        color: green !important;
    }
}

$color-primary: #547cf5;
$color-primary-light: #e0422c;
$color-text-light: snow;
.my-content{
    height: calc(100vh - 56px);

    .stepper-next{
        margin-left:0;
    }
}
.glowing-item {
    background: $color-primary;
    border: none;
    border-radius: 25px;
    color: $color-text-light;
    cursor: pointer;
    font-size: 1.25em;
    letter-spacing: .1em;
    outline: none;
    padding: .75em 2em;
    position: relative;
    text-transform: uppercase;
    
    // &:hover {
    //     animation: glow 1s ease-in infinite;
    // }

    animation: glow 1s ease-in infinite;
    
    &::before {
        animation: glow 1s ease-in infinite;
        background: $color-primary;
        border-radius: inherit;
        content: '';
        filter: blur(10px);
        opacity: .75;
        position: absolute;
        transition: all .3s ease-in-out;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        z-index: -1;
    }
    
    &:hover::before {
        filter: blur(20px);
        opacity: 1;
    }
}

@keyframes glow {
  0% {
    background: $color-primary;
  }
  25% {
    background: $color-primary-light;
  }
  100% {
    background: $color-primary;
  }
}
</style>

<script>
import { mapGetters } from "vuex";
import * as eventService from "../service/events";
import * as tagsService from "../service/tags";
module.exports = {
  data() {
    return this.initialData();
  },
  methods: {
    initialData() {
      return {
        eventLive: false,
        creatingEvent: false,
        photoAdded: false,
        locationSent: false,
        tagsCompleted: false,
        currentFileSelection: null,
        activeStepperStep: "locationStepper",
        reportStepperCurrentLocation: undefined,
        selectedTags: [],
        tags: [],
        showUploadError: false,
        showNoTagsSelectedError: false,
        showEventError: false,
        continueStepAlignment: "md-alignment-center-left",
        createdEvent: undefined,
        stepperFinished: false
      };
    },
    resetComponent: function() {
      Object.assign(this.$data, this.initialData());
    },
    onFileSelection(fileList) {
      if (!this.createdEvent) {
        throw new Error("no event in current context");
      }
      const file = fileList[0];
      const data = new FormData();
      data.append("image", file);
      eventService
        .uploadAttachment(this.createdEvent.id, data, this.onUploadProgress)
        .then(response => {
          this.createdEvent = response.data;
        })
        .catch(err => {
          this.showUploadError = true;
        });
    },
    onUploadProgress: function(progressEvent) {
      const percentCompleted = Math.round(
        progressEvent.loaded * 100 / progressEvent.total
      );
      console.log(percentCompleted);
    },
    advanceStepHandler: function(step, nextStep) {
      if (nextStep == "endStepper") {
        this.setStepDone(step, nextStep);
        this.creatingEvent = false;
        this.stepperFinished = true;
        return;
      }
      if (nextStep === "tagsStepper") {
        if (!this.reportStepperCurrentLocation) alert("No location");
        this.getTags();
      }
      if (step == "tagsCompleted") {
        if (this.selectedTags.length == 0) {
          this.showNoTagsSelectedError = true;
          return;
        }

        eventService
          .createEvent(
            this.reportStepperCurrentLocation,
            this.selectedTags,
            "My event"
          )
          .then(response => {
            this.createdEvent = response.data;
            this.setStepDone(step, nextStep);
          })
          .catch(err => {
            this.showEventError = true;
          });
      } else {
        this.setStepDone(step, nextStep);
      }
    },
    setStepDone: function(step, nextStep) {
      this[step] = true;
      if (nextStep) {
        this.activeStepperStep = nextStep;
      }
    },
    currentLocationChanged: function(position) {
      this.reportStepperCurrentLocation = position;
    },
    getTags: function() {
      tagsService.getTags().then(response => {
        this.tags = response.data;
      });
    },
    goLive: function() {
      this.eventLive = true;
    },
    onFinishedEvent(eventId){
      console.log('add some notification');
      this.resetComponent();
    }
  }
};
</script>
