import React from 'react';
import ReactDOM from 'react-dom';

import length from '@turf/length';
import lineString from 'turf-linestring';
import along from '@turf/along';

import Main from './Main';

const BUS_STOP_INTERVAL = 0.5;

let metrochronosData = JSON.parse(localStorage.metrochronosData || '{}');
metrochronosData.routes = metrochronosData.routes || {};

const element = document.createElement('div');
document.body.appendChild(element);

function makeBusStops(route) {
  route = lineString(route.coordinates);
  const routeLength = length(route);
  var stops = [];
  for (var dist = 0; dist < routeLength; dist += BUS_STOP_INTERVAL) {
    stops.push(along(route, dist));
  }
  return stops;
}

function render() {
  ReactDOM.render(
    <Main
      data={JSON.parse(localStorage.metrochronosData)}
      onChange={data => {
        metrochronosData = data;
        localStorage.metrochronosData = JSON.stringify(metrochronosData);
        render();
      }}
    />,
    element
  );
}
render();
