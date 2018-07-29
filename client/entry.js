import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';

const metrochronosData = JSON.parse(localStorage.metrochronosData || '{}');
metrochronosData.routes = metrochronosData.routes || {};
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
