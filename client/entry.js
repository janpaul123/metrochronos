import React from 'react';
import ReactDOM from 'react-dom';

const element = document.createElement('div');
document.body.appendChild(element);

function render() {
  ReactDOM.render(
    <Main/>,
    element
  );
}
render();
