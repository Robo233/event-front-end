export const initMap = (
  setLocationName: (name: string) => void
) => {
  const mapElement = document.getElementById("map");
  const searchInputElement = document.getElementById("place-search") as HTMLInputElement | null;
  let markers: google.maps.Marker[] = [];

  if (mapElement && searchInputElement) {
    const map = new google.maps.Map(mapElement, {
      center: { lat: 45.68, lng: 25.6 },
      zoom: 10,
    });
    const searchBox = new google.maps.places.SearchBox(searchInputElement);

    const geocoder = new google.maps.Geocoder();

    map.addListener("bounds_changed", () => {
      const bounds = map.getBounds();
      if (bounds) {
        searchBox.setBounds(bounds);
      }
    });

    map.addListener("click", (event) => {
      markers.forEach(marker => marker.setMap(null));
      markers = [];

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      geocoder.geocode({ location: event.latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          setLocationName(results[0].formatted_address);
        } else {
          setLocationName(`Coordinates: ${lat.toFixed(3)}, ${lng.toFixed(3)}`);
        }
      });

      markers.push(new google.maps.Marker({
        map,
        position: event.latLng,
      }));
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      markers.forEach((marker) => marker.setMap(null));
      markers = [];

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        console.log("place.name: " + place.name);
        setLocationName(place.name);
        markers.push(new google.maps.Marker({
          map,
          title: place.name,
          position: place.geometry.location,
        }));

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }
};