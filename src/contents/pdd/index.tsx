import './pdd.scss';
import ReactDOM from 'react-dom';
import { waitForSelector } from '../../utils';
import Pdd from './component';

async function start() {
  const element = await waitForSelector('.package-center-table');
  console.log('element', element, Pdd);
  setTimeout(() => {
    const pddReactRoot = document.createElement('div');
    document.body.append(pddReactRoot);
    ReactDOM.render(<Pdd />, pddReactRoot);
  }, 1000);
}

start();
