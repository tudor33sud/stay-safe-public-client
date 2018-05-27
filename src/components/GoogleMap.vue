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
  watch: {
    syncedMarkers: function(newVal, oldVal) {
      this.registerMarkers(newVal, false);
    }
  },
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
    syncedMarkers: {
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
    },
    geolocation: {
      type: Boolean,
      default: true
    },
    geolocationIcon: {
      type: String,
      default: undefined
    }
  },
  destroyed() {
    clearInterval(this.geolocationInterval);
    clearInterval(this.locationWatcher);
  },
  data: function() {
    return {
      mapName: `${this.name}-map`,
      map: undefined,
      currentPositionMarker: undefined,
      currentPosition: undefined,
      locationWatcher: null,
      gmapSyncedMarkers: [],
      gmapStaticMarkers: [],
      geolocationInterval: null
    };
  },
  mounted: function() {
    const element = document.getElementById(this.mapName);
    const options = {
      center: new google.maps.LatLng(45.6428907, 25.5916801),
      zoom: 5,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    };

    this.map = new google.maps.Map(element, options);

    if (this.geolocation === true) {
      //if geolocation enabled get user's current position
      if (!navigator.geolocation) {
        alert("Sorry you do not support geolocation");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        this.locationSuccessHandler,
        this.locationErrorHandler,
        { timeout: 5000 }
      );
    }
    this.registerMarkers(this.markers);
  },
  methods: {
    locationErrorHandler: function(error) {
      console.log(error);
    },
    locationSuccessHandler: function(position) {
      this.changeCurrentPosition({
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
        animation: google.maps.Animation.DROP,
        icon: this.geolocationIcon ? this.geolocationIcon : undefined
      });

      this.map.panTo(newCenter);
      this.map.setZoom(15);

      //listen for current location marker drag
      google.maps.event.addListener(
        this.currentPositionMarker,
        "dragend",
        () => {
          this.changeCurrentPosition({
            lat: this.currentPositionMarker.getPosition().lat(),
            lng: this.currentPositionMarker.getPosition().lng()
          });
        }
      );

      this.addPanOnClickListener(this.currentPositionMarker);

      if (this.syncGeolocation) {
        this.locationWatcher = setInterval(() => {
          //production method 
          // navigator.geolocation.getCurrentPosition(
          //   this.onLocationWatchSuccess,
          //   this.onLocationWatchError,
          //   { timeout: 3500 }
          // );
        }, 4000);
        //test method
        const geolocationInterval = setInterval(() => {
          this.onLocationWatchSuccess({
            coords: {
              latitude: this.currentPosition.lat + 0.0001,
              longitude: this.currentPosition.lng + 0.0001
            }
          });
        }, 3000);
      }
    },
    onLocationWatchSuccess: function(position) {
      const latLngPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.changeCurrentPosition(latLngPosition);
      this.map.setCenter(latLngPosition);
      const changedMarkerPosition = new google.maps.LatLng(
        latLngPosition.lat,
        latLngPosition.lng
      );
      this.currentPositionMarker.setPosition(changedMarkerPosition);
    },
    onLocationWatchError: function(err) {
      console.log(err);
    },
    changeCurrentPosition: function(position) {
      this.currentPosition = position;
      this.$emit("currentLocationChanged", position);
    },
    registerMarkers: function(markers, staticMarkers = true) {
      if (staticMarkers !== true) {
        this.gmapSyncedMarkers.forEach(marker => {
          marker.setMap(null);
          google.maps.event.clearInstanceListeners(marker);
        });
      }
      const gmapsMarkers = markers.map(marker => {
        const markerPosition = new google.maps.LatLng(marker.lat, marker.lng);
        const gmapMarker = new google.maps.Marker({
          position: markerPosition,
          map: this.map,
          title: marker.title ? marker.title : undefined,
          icon: marker.icon ? marker.icon : undefined
        });
        this.addPanOnClickListener(gmapMarker);
        return gmapMarker;
      });
      if (staticMarkers === true) {
        this.gmapStaticMarkers = gmapsMarkers;
      } else {
        this.gmapSyncedMarkers = gmapsMarkers;
      }
      const bounds = new google.maps.LatLngBounds();
      const allMarkers = [...this.gmapSyncedMarkers, ...this.gmapStaticMarkers];
      for (var i = 0; i < allMarkers.length; i++) {
        bounds.extend(allMarkers[i].getPosition());
      }
      if (allMarkers.length > 1) {
        this.map.fitBounds(bounds);
      } else if (allMarkers.length == 1) {
        this.map.setCenter(bounds.getCenter());
        this.map.setZoom(17);
      }
    },
    addPanOnClickListener: function(marker) {
      google.maps.event.addListener(marker, "click", () => {
        const latLng = new google.maps.LatLng(
          marker.getPosition().lat(),
          marker.getPosition().lng()
        );
        this.map.panTo(latLng);
        this.map.setZoom(17);
      });
    }
  }
};
</script>