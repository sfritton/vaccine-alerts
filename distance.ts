/** Convert miles to km */
const KM_TO_MILE = 0.621371;
const MILE_TO_KM = 1.60934;

function getDistance(point1: Coordinates, point2: Coordinates) {
  return distance(point1[0], point1[1], point2[0], point2[1]) * KM_TO_MILE;
}

// Code below adapted from https://github.com/mourner/geokdbush/blob/master/index.js

var earthRadius = 6371;
var rad = Math.PI / 180;

function haverSin(theta: number) {
  var s = Math.sin(theta / 2);
  return s * s;
}

function haverSinDistPartial(
  haverSinDLng: number,
  cosLat1: number,
  lat1: number,
  lat2: number
) {
  return (
    cosLat1 * Math.cos(lat2 * rad) * haverSinDLng +
    haverSin((lat1 - lat2) * rad)
  );
}

function haverSinDist(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number,
  cosLat1: number
) {
  var haverSinDLng = haverSin((lng1 - lng2) * rad);
  return haverSinDistPartial(haverSinDLng, cosLat1, lat1, lat2);
}

function distance(lng1: number, lat1: number, lng2: number, lat2: number) {
  var h = haverSinDist(lng1, lat1, lng2, lat2, Math.cos(lat1 * rad));
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}
