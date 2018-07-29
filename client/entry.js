import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';

let metrochronosData = JSON.parse(localStorage.metrochronosData || '{}');
metrochronosData.routes = metrochronosData.routes || {};

const element = document.createElement('div');
document.body.appendChild(element);

function render() {
  ReactDOM.render(
    <Main
      data={metrochronosData}
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
