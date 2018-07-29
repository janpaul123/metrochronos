import distance from '@turf/distance';

import {averageBusSpeedKph, averageWalkingSpeedKph, busStopInterval} from './constants';

var stopIDFromCoords = (coordinates) => `${coordinates[0]}:${coordinates[1]}`;

export default function makeBusGraph(routes) {
  const graph = {};
  // first, go through all routes and connect adjacent stops on the
  // same line
  for (let route of routes) {
    for (var i = 0; i < route.stops.length; i++) {
      let stop = {
        key: stopIDFromCoords(route.stops[i]),
        coordinates: route.stops[i],
        connections: [],
      };
      if (i > 0) {
        stop.connections.push({
          key: stopIDFromCoords(route.stops[i-1]),
          cost: busStopInterval / averageBusSpeedKph,
        });
      }
      if (i+1 < route.stops.length) {
        stop.connections.push({
          key: stopIDFromCoords(route.stops[i+1]),
          cost: busStopInterval / averageBusSpeedKph,
        });
      }
      graph[stop.key] = stop;
    }
  }
  // then, connect every stop by walking distance
  for (let thisStop of Object.values(graph)) {
    for (let otherStop of Object.values(graph)) {
      if (thisStop.key !== otherStop.key) {
        thisStop.connections.push({
          key: otherStop.key,
          cost: distance(thisStop.coordinates, otherStop.coordinates) / averageBusSpeedKph,
        });
      }
    }
  }
  return graph;
}
