<template>
    <div class="google-map" :id="mapName"></div>
</template>
<style scoped>
.google-map {
  min-width: 400px;
  height: 600px;
  margin: 0 auto;
  background: gray;
}
</style>

<script>
export default {
  props: ["name"],
  data: function() {
    return {
      mapName: `${this.name}-map`
    };
  },
  mounted: function() {
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 14,
      center: new google.maps.LatLng(45.6428907,25.5916801)
    };
    const map = new google.maps.Map(element, options);
  }
};
</script>