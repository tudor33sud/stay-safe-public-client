<template>
  <div class="full-height-relative">
    <md-empty-state v-if="!creatingEvent && !stepperFinished" class="report-action-container">
      <span @click="creatingEvent = !creatingEvent" class="glowing-item">
        <md-icon class="md-size-2x">local_hospital</md-icon>
      </span>
      <h1 class="md-title">Any danger nearby?</h1>
    </md-empty-state>
    <md-empty-state class="md-primary" style="margin-top:20vh;" v-if="stepperFinished && !eventLive" md-label="All set. Wanna go live?" md-icon="check_circle">
      <md-button class="md-primary stepper-next" @click="goLive()">Go Live</md-button>
      <md-button @click="resetComponent()" class="stepper-next">Back</md-button>
    </md-empty-state>

    <md-content v-if="creatingEvent" class="my-content">
      <md-steppers md-vertical md-linear :md-active-step.sync="activeStepperStep">
        <md-step id="locationStepper" md-label="Location" md-description="Adjust your current location" :md-done.sync="locationSent" :md-editable="false">
          <p class="md-body-2 step-description">Accurately adjust your current location based on your surroundings. Drag the marker into your position.</p>
          <googlemap name="reportMap" @currentLocationChanged="currentLocationChanged"></googlemap>
          <div class="md-layout " :class="continueStepAlignment">
            <md-button class="md-dense md-primary stepper-next" @click="advanceStepHandler('locationSent', 'tagsStepper')">Continue</md-button>
          </div>
        </md-step>

        <md-step id="tagsStepper" md-label="Tags" :md-done.sync="tagsCompleted" :md-editable="false">
          <p class="md-body-2 step-description">Select appropriate tags to fit the gravity of your event. This will be helping ambulances to better prioritize how events will be handled.</p>
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
          <p class="md-body-2 step-description">
            <md-icon style="color:black;margin-right:8px;">cloud_done</md-icon>Congratulations! Your event is already sent to our system.</p>
          <p class="md-body-2 step-description">Feel free to add some photos to help us identify the location, or you can just skip to finish.</p>
          <md-field>
            <label>Photo</label>
            <md-file v-model="currentFileSelection" @md-change="onFileSelection" />
            <md-progress-spinner v-if="isUploading" :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
          </md-field>
          <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showUploadError" md-persistent>
            <span>There was an error uploading your file</span>
            <md-button class="md-accent" @click="showUploadError = false">Dismiss</md-button>
          </md-snackbar>
          <div class="md-layout preview-container md-gutter">
            <div class="md-layout-item md-size-25 md-small-size-100" v-for="(attachment,index) in attachmentsData" :key="index">
              <div class="upload-image-container">
                <img v-if="attachment.loaded" class="upload-image" :src="attachment.data" />
              </div>
            </div>
          </div>
          <div class="md-layout" :class="continueStepAlignment">
            <md-button class="md-dense md-accent stepper-next" @click="advanceStepHandler('photoAdded', 'endStepper')">Finish</md-button>
          </div>
        </md-step>
      </md-steppers>

    </md-content>

    <div style="height:100%;" v-if="eventLive">
      <userlivemap :event="createdEvent" @finishedEvent="onFinishedEvent"></userlivemap>
    </div>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active.sync="showEventFinished" md-persistent>
      <span>Event finished successfully!</span>
      <md-button class="md-primary" @click="showEventFinished = false; resetComponent()">Ok</md-button>
    </md-snackbar>
  </div>

</template>
<style lang="sass" scoped>




.success{
    .md-icon {
        color: green !important;
    }
}

 $color-primary: var(--md-theme-default-primary, #448aff);
//$color-primary: #448aff;
// $color-primary-light: #e0422c;
$color-primary-light: var(--md-theme-default-accent, #ff5252);
$color-text-light: snow;
$step-description-color: gray;

@-webkit-keyframes rotation {
		from {
				-webkit-transform: rotate(0);
		}
		to {
				-webkit-transform: rotate(359deg);
		}
}
.my-content{
    min-height: 100%;
    height: 100%;
    @media screen and (max-width: 960px) {
      //fix for toolbar hamburger button alignment on smaller screens
      margin-left: -8px;
    }
    .stepper-next{
        margin-left:0;
    }

    .step-description{
      // color: $step-description-color;
      opacity:0.70;
    }
}
.glowing-item {
    background: $color-primary;
    border: none;
    border-radius: 50% 50% 2px 2px;
    width:100px;
    height:110px;
    color: $color-text-light;
    cursor: pointer;
    font-size: 1.25em;
    letter-spacing: .1em;
    outline: none;
    padding: .75em 2em;
    position: relative;
    text-transform: uppercase;
    z-index:6;
    .md-icon{
      color:white;
      font-size:46px;
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      // -webkit-animation: rotation 0.3s 1 ease-out;
    }

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
.md-layout.preview-container{
  align-items: center;
  justify-content: center;
  // margin-left: 24px;
  .upload-image-container{
    margin-bottom:24px;
    vertical-align:middle;
    text-align: center;
  }
  .upload-image{
    border-radius: 10px;
    max-height:400px;
  } 
}



.report-action-container{
  margin-top: calc( 50vh - 56px - 100px );

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
  computed: {},
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
        showEventFinished: false,
        continueStepAlignment: "md-alignment-center-left",
        createdEvent: undefined,
        stepperFinished: false,
        geocoder: new google.maps.Geocoder(),
        attachmentsData: [],
        isUploading: false
      };
    },
    resetComponent: function() {
      Object.assign(this.$data, this.initialData());
    },
    onFileSelection(fileList) {
      if (!this.createdEvent) {
        throw new Error("no event in current context");
      }
      this.isUploading = true;
      const file = fileList[0];
      const data = new FormData();
      data.append("image", file);
      // setTimeout(() => {
      eventService
        .uploadAttachment(this.createdEvent.id, data, this.onUploadProgress)
        .then(response => {
          this.createdEvent = response.data;
          this.getAttachment(
            this.createdEvent.attachments[
              this.createdEvent.attachments.length - 1
            ].id
          );
          this.isUploading = false;
        })
        .catch(err => {
          this.isUploading = false;
          this.showUploadError = true;
        });
      // }, 1000);
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
        this.geocodeAddress(this.reportStepperCurrentLocation).then(address => {
          eventService
            .createEvent(
              this.reportStepperCurrentLocation,
              this.selectedTags,
              "My event",
              address
            )
            .then(response => {
              this.createdEvent = response.data;
              this.setStepDone(step, nextStep);
            })
            .catch(err => {
              this.showEventError = true;
            });
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
    onFinishedEvent(eventId) {
      console.log("add some notification");
      this.showEventFinished = true;
      // this.resetComponent();
    },
    geocodeAddress: function(location) {
      return new Promise((resolve, reject) => {
        this.geocoder.geocode({ location }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              return resolve(results[0].formatted_address);
            }
          }
          return resolve(`${location.lat},${location.lng}`);
        });
      });
    },
    getAttachment: function(attachmentId) {
      this.attachmentsData.push({ loaded: false, progress: 0 });

      eventService
        .getAttachment(this.createdEvent.id, attachmentId, progressEvent => {
          // console.log(progressEvent);
          // const progress = Math.round(
          //   progressEvent.loaded * 100 / progressEvent.total
          // );
          // console.log("download progress " + progress);
          // console.log(this.attachmentsData[attachmentId - 1].progress);
          // debugger;
          // this.attachmentsData[attachmentId - 1].progress = progress;
          // console.log(this.attachmentsData[attachmentId].progress);
        })
        .then(response => {
          const imageData =
            "data:image/png;base64, " +
            new Buffer(response.data, "binary").toString("base64");
          const attachmentData = {
            loaded: true,
            data: imageData,
            progress: 100
          };
          this.$set(this.attachmentsData, attachmentId - 1, attachmentData);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
