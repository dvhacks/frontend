export function geocodeAddress (address, onSuccess, onError) {
  let geocoder = new window.google.maps.Geocoder()
  geocoder.geocode({address}, (results, status) => {
    if (status === 'OK' && onSuccess && onSuccess instanceof Function) {
      onSuccess({
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      }, results, status)
    } else {
      if (onError && onError instanceof Function) {
        onError(status)
      }
    }
  })
}

export const getGeolocation = (callbackSuccess, callbackError) => {
  navigator.geolocation.getCurrentPosition(
        callbackSuccess,
        callbackError,
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 3000}
      )
};

export const haversineDistance = function(start, end) {
  const earth_radius = 6371;
  
  if (Number.prototype.toRadians === undefined) {
    // eslint-disable-next-line no-extend-native
    Number.prototype.toRadians = function() {
      return this * Math.PI / 180;
    }
  }
  
  const source_lat_radians = start.lat.toRadians();
  const dest_lat_radians = end.lat.toRadians();
  const lat_diff_radians = (end.lat - start.lat).toRadians();
  const lng_diff_radians = (end.lng - start.lng).toRadians();

  const formula = (
    Math.sin(lat_diff_radians / 2) * Math.sin(lat_diff_radians / 2) +
    Math.cos(source_lat_radians) * Math.cos(dest_lat_radians) *
    Math.sin(lng_diff_radians / 2) * Math.sin(lng_diff_radians / 2)
  );
  const ataned = 2 * Math.atan2(Math.sqrt(formula), Math.sqrt(1 - formula));

  return (earth_radius * ataned) * 0.625;
};
