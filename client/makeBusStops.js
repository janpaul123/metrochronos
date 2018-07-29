import length from '@turf/length';
import lineString from 'turf-linestring';
import along from '@turf/along';

import {busStopInterval} from './constants';

export default function makeBusStops(route) {
  const lastStop = route.coordinates.slice(-1);
  const routeLineString = lineString(route.coordinates);
  const routeLength = length(routeLineString);
  var stops = [];
  for (var dist = 0; dist < routeLength; dist += busStopInterval) {
    stops.push(along(routeLineString, dist).geometry.coordinates);
  }
  if (routeLength > dist) {
    stops.push(lastStop);
  }
  return Object.assign({}, route, {stops});
}
