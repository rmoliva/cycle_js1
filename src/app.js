import Cycle                from '@cycle/core';
import isolate                from '@cycle/isolate';
// import {makeDOMDriver}      from '@cycle/dom';
// import {makeHistoryDriver}  from '@cycle/history';
import Rx                   from 'rx';
// import Main                 from './main'
import {h, div, input, h2, span, makeDOMDriver} from '@cycle/dom';
import Widget from './components/widget';
import FormLabel from './components/layout/form_label';
import Slider from './components/form/slider';

const mainApp = function (sources) {
  debugger;

  const slider1 = Widget({
    component: Slider,
    name: "slider1",
    sources: sources,
    props: {
      min: 40, value: 90, max: 150
    }
  });

  const slider2 = Widget({
    component: Slider,
    name: "slider2",
    sources: sources,
    props: {
      min: 40, value: 70, max: 150
    }
  });

  const label2 = Widget({
    component: FormLabel,
    name: "label",
    children: [slider2],
    sources: sources,
    props: {
      text: "Esto es la segunda <i>etiqueta</i>",
      error: false
    }
  });

  const mainComponent = Widget({
    component: FormLabel,
    name: "main",
    children: [slider1, label2],
    sources: sources,
    props: {
      text: "Esto es una <b>etiqueta</b>",
      error: false
    }
  });

  return {
    //  DOM: bmi$.combineLatest(weightVTree$, heightVTree$, paginatorVTree$, labelVTree$, sliderVTree$,
    DOM: Rx.Observable.combineLatest(
      mainComponent.DOM,
      function(labelVTree) {
        return  div([
          labelVTree
        ])
      })
    };
};

const sources = {
  DOM: makeDOMDriver('#application'),
};

Cycle.run(mainApp, sources);
