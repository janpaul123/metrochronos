import React from 'react';
import ReactDOM from 'react-dom';

import length from '@turf/length';
import lineString from 'turf-linestring';
import along from '@turf/along';
import distance from '@turf/distance';

import Main from './Main';

import {averageBusSpeedKph} from './constants';

const BUS_STOP_INTERVAL = 0.5;
const averageWalkingSpeedKph = 5;
const BUS_TRANSFER_RADIUS = 0.25;

let metrochronosData = JSON.parse(localStorage.metrochronosData || '{}');
metrochronosData.routes = metrochronosData.routes || {};

const element = document.createElement('div');
document.body.appendChild(element);

function makeBusStops(route) {
  const lastStop = route.coordinates.slice(-1);
  const routeLineString = lineString(route.coordinates);
  const routeLength = length(routeLineString);
  var stops = [];
  for (var dist = 0; dist < routeLength; dist += BUS_STOP_INTERVAL) {
    stops.push(along(routeLineString, dist).geometry.coordinates);
  }
  if (routeLength > dist) {
    stops.push(lastStop);
  }
  return Object.assign({}, route, {stops});
}

var stopIDFromCoords = (coordinates) => `${coordinates[0]}:${coordinates[1]}`;

function makeBusGraph(routes) {
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
          cost: BUS_STOP_INTERVAL / averageBusSpeedKph,
        });
      }
      if (i+1 < route.stops.length) {
        stop.connections.push({
          key: stopIDFromCoords(route.stops[i+1]),
          cost: BUS_STOP_INTERVAL / averageBusSpeedKph,
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
  console.log('makeBusGraph returns:', graph);
}

function render() {
  ReactDOM.render(
    <Main
      data={JSON.parse(localStorage.metrochronosData)}
      onChange={data => {
        metrochronosData = data;
        localStorage.metrochronosData = JSON.stringify(metrochronosData);
        makeBusGraph(Object.values(data.routes).map(makeBusStops));
        render();
      }}
    />,
    element
  );
}
render();
