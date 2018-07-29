import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';
import makeBusStops from './makeBusStops';
import makeBusGraph from './makeBusGraph';

let metrochronosData = JSON.parse(localStorage.metrochronosData || '{}');
metrochronosData.routes = metrochronosData.routes || {};

const element = document.createElement('div');
document.body.appendChild(element);

function render() {
  ReactDOM.render(
    <Main
      data={JSON.parse(localStorage.metrochronosData)}
      onChange={data => {
        metrochronosData = data;
        localStorage.metrochronosData = JSON.stringify(metrochronosData);
        console.log(data.pinLocation);
        makeBusGraph(Object.values(data.routes).map(makeBusStops));
        render();
      }}
    />,
    element
  );
}
render();
