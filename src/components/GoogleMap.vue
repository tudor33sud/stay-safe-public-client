<template>
  <div class="google-map" :id="mapName"></div>
</template>
<style scoped>
.google-map {
  /* min-width: 400px; */
  height: 70vh;
  margin: 0 auto;
  background: gray;
}
</style>

<script>
export default {
  props: ["name"],
  data: function() {
    return {
      mapName: `${this.name}-map`,
      map: undefined,
      currentPositionMarker: undefined,
      currentPosition: undefined
    };
  },
  mounted: function() {
    const element = document.getElementById(this.mapName);
    const options = {
      center: new google.maps.LatLng(45.6428907, 25.5916801),
      zoom: 15
    };

    this.map = new google.maps.Map(element, options);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.locationSuccessHandler,
        this.locationErrorHandler
      );
    }
  },
  methods: {
    locationErrorHandler: function(error) {
      console.log(error);
    },
    locationSuccessHandler: function(position) {
      this.currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.emitLocationChangedEvent(this.currentPosition);
      const newCenter = new google.maps.LatLng(
        this.currentPosition.lat,
        this.currentPosition.lng
      );
      this.currentPositionMarker = new google.maps.Marker({
        position: newCenter,
        map: this.map,
        title: "Your current position",
        draggable: true
      });

      this.map.panTo(newCenter);
      this.map.setZoom(17);

      //listen for current location marker drag
      google.maps.event.addListener(
        this.currentPositionMarker,
        "dragend",
        () => {
          this.currentPosition = {
            lat: this.currentPositionMarker.getPosition().lat(),
            lng: this.currentPositionMarker.getPosition().lng()
          };
          this.emitLocationChangedEvent(this.currentPosition);
        }
      );
    },
    emitLocationChangedEvent(position) {
      this.$emit("currentLocationChanged", position);
    }
  }
};
</script>