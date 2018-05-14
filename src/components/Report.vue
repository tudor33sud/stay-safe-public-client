<template>
    <div>

        <h2 style="padding:24px" class="md-headline" v-if="!eventLive">You don't have any events live. Please start one </h2>
        <md-content v-if="eventLive" class="my-content">
            <md-steppers md-vertical md-linear :md-active-step.sync="activeStepperStep">
                <md-step id="locationStepper" md-label="Location" md-description="Adjust your current location" :md-done.sync="locationSent" :md-editable="false">
                    <googlemap name="reportMap" @currentLocationChanged="currentLocationChanged"></googlemap>
                    <md-button class="md-raised md-primary" @click="setStepDone('locationSent', 'tagsStepper')">Continue</md-button>
                </md-step>

                <md-step id="tagsStepper" md-label="Tags" :md-done.sync="tagsCompleted">
                    <md-field>
                        <label for="tags">Tags</label>
                        <md-select v-model="selectedTags" name="tags" id="tags" multiple>
                            <md-option v-for="tag in tags" :key="tag.id" :value="tag.name">{{tag.name}}</md-option>
                        </md-select>
                    </md-field>
                    <md-button class="md-raised md-primary" @click="setStepDone('tagsCompleted', 'addPhotoStepper')">Continue</md-button>
                </md-step>

                <md-step id="addPhotoStepper" md-label="Add a photo" :md-done.sync="photoAdded">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                </md-step>
            </md-steppers>
        </md-content>
        <md-speed-dial class="md-bottom-right" md-direction="top">
            <md-speed-dial-target class="md-accent">
                <md-icon class="md-morph-initial">add</md-icon>
                <md-icon class="md-morph-final">close</md-icon>
            </md-speed-dial-target>

            <md-speed-dial-content>
                <md-button class="md-icon-button" @click="eventLive = !eventLive">
                    <md-icon>add_location</md-icon>
                    <md-tooltip md-direction="left">Add Report</md-tooltip>
                </md-button>

                <md-button class="md-icon-button">
                    <md-icon>local_offer</md-icon>
                    <md-tooltip md-direction="left">Add Custom Tag</md-tooltip>
                </md-button>
            </md-speed-dial-content>
        </md-speed-dial>
    </div>

</template>
<style lang="sass" scoped>
    .my-content{
        padding:16px;
    }
</style>

<script>
import { mapGetters } from "vuex";
import * as eventService from "../service/events";
import * as tagsService from "../service/tags";
module.exports = {
  data() {
    return {
      eventLive: false,
      photoAdded: false,
      locationSent: false,
      tagsCompleted: false,
      activeStepperStep: "locationStepper",
      reportStepperCurrentLocation: undefined,
      selectedTags: [],
      tags: []
    };
  },
  methods: {
    setStepDone: function(step, nextStep) {
      this[step] = true;
      if (nextStep === "tagsStepper") {
        this.getTags();
      }
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
    }
  }
};
</script>
