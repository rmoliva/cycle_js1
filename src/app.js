import Cycle                from '@cycle/core';
import isolate                from '@cycle/isolate';
// import {makeDOMDriver}      from '@cycle/dom';
// import {makeHistoryDriver}  from '@cycle/history';
import Rx                   from 'rx';
// import Main                 from './main'
import {h, div, input, h2, span, makeDOMDriver} from '@cycle/dom';
import Component from './components/component';

const mainApp = function (sources) {
  const timer$ = Rx.Observable.timer(100, 100).take(150);

  const props$ = timer$.map(function(value) {
    return {
      min: 40, value: value, max: 150
    };
  });

  const settings = {
    type: 'FormLabel',
    id: "main",
    children: [{
      type: 'Slider',
      id: "slider1",
      props$: props$
    }, {
      type: 'FormLabel',
      id: "label",
      children: [{
        type: 'Slider',
        id: "slider2",
        props$: Rx.Observable.of({
          min: 40, value: 70, max: 150
        })
      }],
      props$: Rx.Observable.of({
        text: "Esto es la segunda <i>etiqueta</i>",
        error: false
      })
    }],
    props$: Rx.Observable.of({
      text: "Esto es una <b>etiqueta</b>",
      error: false
    })
  };
  const mainComponent = Component(settings, sources);
  const mainEl = mainComponent.findId('main');
  const mainDom = mainEl.sinks.DOM;

  return {
    //  DOM: bmi$.combineLatest(weightVTree$, heightVTree$, paginatorVTree$, labelVTree$, sliderVTree$,
    DOM: Rx.Observable.combineLatest(
      mainDom,
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
