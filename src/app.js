import Cycle                from '@cycle/core';
import isolate                from '@cycle/isolate';
// import {makeDOMDriver}      from '@cycle/dom';
// import {makeHistoryDriver}  from '@cycle/history';
import Rx                   from 'rx';
// import Main                 from './main'
import {h, div, input, h2, span, makeDOMDriver} from '@cycle/dom';
import LabeledSlider from './components/labeled_slider';
import Paginator from './components/nav/paginator';
import FormLabel from './components/layout/form_label';
import Slider from './components/form/slider';

const mainApp = function (sources) {
  const slider1 = Slider("slider1").component({
    DOM: sources.DOM,
    props$: Rx.Observable.of({
      min: 40, value: 70, max: 150
    })
  });

  const slider2 = Slider("slider2").component({
    DOM: sources.DOM,
    props$: Rx.Observable.of({
      min: 40, value: 90, max: 150
    })
  });

  const label2 = FormLabel("label").component({
    DOM: sources.DOM,
    props$: Rx.Observable.of({
      text: "Esto es la segunda <i>etiqueta</i>",
      error: false
    }),
    children: [slider2]
  });

  const mainComponent = FormLabel("label").component({
    DOM: sources.DOM,
    props$: Rx.Observable.of({
      text: "Esto es una <b>etiqueta</b>",
      error: false
    }),
    children: [slider1, label2]
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
