import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';

const metrochronosData = JSON.parse(localStorage.metrochronosData || '{}');
metrochronosData.routes = metrochronosData.routes || {};
metrochronosData.routes['my-route'] = {
  color: 'blue',
  coordinates: [[-122.4156983, 37.7709864], [-122.4156983, 37.7809864]],
};
localStorage.metrochronosData = JSON.stringify(metrochronosData);

const element = document.createElement('div');
document.body.appendChild(element);

function render() {
  ReactDOM.render(
    <Main
      data={JSON.parse(localStorage.metrochronosData)}
      onChange={data => {
        console.log('saving', data);
        localStorage.metrochronosData = JSON.stringify(data);
        render();
      }}
    />,
    element
  );
}
render();
