<template>
  <div class="google-map" :id="mapName"></div>
</template>
<style scoped>
.google-map {
  /* min-width: 400px; */
  width: 100%;
  height: 70vh;
  margin: 0 auto;
  background: gray;
}
</style>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    markers: {
      type: Array,
      default: function() {
        return [];
      }
    },
    currentLocationDraggable: {
      type: Boolean,
      default: true
    },
    syncGeolocation: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      mapName: `${this.name}-map`,
      map: undefined,
      currentPositionMarker: undefined,
      currentPosition: undefined,
      locationWatcher: null
    };
  },
  mounted: function() {
    if (!navigator.geolocation) {
      alert("Sorry you do not support geolocation");
      return;
    }
    const element = document.getElementById(this.mapName);
    const options = {
      center: new google.maps.LatLng(45.6428907, 25.5916801),
      zoom: 10
    };

    this.map = new google.maps.Map(element, options);

    navigator.geolocation.getCurrentPosition(
      this.locationSuccessHandler,
      this.locationErrorHandler
    );

    this.markers.forEach(marker => {
      const markerPosition = new google.maps.LatLng(marker.lat, marker.lng);
      const gmapMarker = new google.maps.Marker({
        position: markerPosition,
        map: this.map,
        title: marker.title ? marker.title : undefined
      });
    });
  },
  methods: {
    locationErrorHandler: function(error) {
      console.log(error);
    },
    locationSuccessHandler: function(position) {
      this.changeCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      const newCenter = new google.maps.LatLng(
        this.currentPosition.lat,
        this.currentPosition.lng
      );
      this.currentPositionMarker = new google.maps.Marker({
        position: newCenter,
        map: this.map,
        title: "Your current position",
        draggable: this.currentLocationDraggable,
        animation: google.maps.Animation.DROP
      });

      this.map.panTo(newCenter);
      this.map.setZoom(17);

      //listen for current location marker drag
      google.maps.event.addListener(
        this.currentPositionMarker,
        "dragend",
        () => {
          this.changeCurrentLocation({
            lat: this.currentPositionMarker.getPosition().lat(),
            lng: this.currentPositionMarker.getPosition().lng()
          });
        }
      );

      if (this.syncGeolocation) {
        const options = {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        };
        this.locationWatcher = navigator.geolocation.watchPosition(
          this.onLocationWatchSuccess,
          this.onLocationWatchError,
          options
        );
        //test method
        // setInterval(() => {
        //   this.onLocationWatchSuccess({
        //     coords: {
        //       latitude: this.currentPosition.lat + 0.0001,
        //       longitude: this.currentPosition.lng + 0.0001
        //     }
        //   });
        // }, 1000);
      }
    },
    onLocationWatchSuccess: function(position) {
      const latLngPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.changeCurrentLocation(latLngPosition);
      const changedMarkerPosition = new google.maps.LatLng(
        latLngPosition.lat,
        latLngPosition.lng
      );
      this.currentPositionMarker.setPosition(changedMarkerPosition);
    },
    onLocationWatchError: function(err) {
      console.log(err);
    },
    changeCurrentLocation: function(position) {
      this.currentPosition = position;
      this.$emit("currentLocationChanged", position);
    }
  }
};
</script>