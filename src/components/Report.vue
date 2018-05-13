<template>
    <div>

        <md-content class="my-content">
            <md-steppers md-vertical md-linear :md-active-step.sync="activeStepperStep">
                <md-step id="locationStepper" md-label="Location" md-description="Adjust your current location" :md-done.sync="locationSent">
                    <googlemap name="example"></googlemap>
                    <md-button class="md-raised md-primary" @click="setStepDone('locationSent', 'tagsStepper')" v-show="!locationSent">Continue</md-button>
                </md-step>

                <md-step id="tagsStepper" md-label="Tags" :md-done.sync="tagsCompleted">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
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
module.exports = {
  data() {
    return {
      eventLive: false,
      photoAdded: false,
      locationSent: false,
      tagsCompleted: false,
      activeStepperStep: "locationStepper"
    };
  },
  methods: {
    setStepDone: function(step, nextStep) {
      this[step] = true;
      console.log(step);
      console.log(this[step]);
      if (nextStep) {
        this.activeStepperStep = nextStep;
      }
    }
  }
};
</script>
