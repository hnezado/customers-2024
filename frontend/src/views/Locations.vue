<template>
  <div class="main-container">
    <h1>Our Locations</h1>
    <p>
      Explore our network of establishments to find the store closest to you.
    </p>
    <p>Begin your journey with us today!</p>
    <div id="map"></div>
  </div>
</template>

<script>
import "@/styles/components/Locations.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-plugins/layer/tile/Yandex.js";
export default {
  name: "LocationsPage",
  data() {
    return {
      mapData: {
        markerCoords: [
          [42.337803, -3.706235],
          [42.355248, -3.675572],
          [42.357944, -3.648675],
          [42.369074, -3.736898],
        ],
      },
    };
  },
  mounted() {
    this.$eventBus.emit("viewActive", { view: this.$route.path });
    this.$nextTick(() => {
      this.initMap();
      this.getUserLocation();
    });
  },
  methods: {
    initMap() {
      this.mapData.map = L.map("map").setView([42.343926, -3.696977], 13);
      const yandexLayer = L.yandex();
      yandexLayer.addTo(this.mapData.map);
      this.mapData.markerIcon = L.icon({
        iconUrl:
          "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
        iconSize: [50, 50],
      });
      for (let coord of this.mapData.markerCoords) {
        L.marker(coord, { icon: this.mapData.markerIcon }).addTo(
          this.mapData.map
        );
      }
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.showUserLocation([latitude, longitude]);
          },
          (error) => {
            console.error(`Error getting user location: ${error.message}`);
          }
        );
      }
    },
  },
};
</script>
