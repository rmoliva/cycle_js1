import Cycle                from '@cycle/core';
import isolate                from '@cycle/isolate';
// import {makeDOMDriver}      from '@cycle/dom';
// import {makeHistoryDriver}  from '@cycle/history';
import Rx                   from 'rx';
// import Main                 from './main'
import {h, div, input, h2, span, makeDOMDriver} from '@cycle/dom';
import Component from './components/component';
import Services from './services/main';

const mainApp = function (sources) {
  const timer$ = Rx.Observable.timer(100, 100).take(150);

  const props$ = timer$.map(function(value) {
    return {
      min: 40, value: value, max: 150
    };
  });

  const tablePropsCols$ = Rx.Observable.of([{
    index: "id",
    title: "Id"
  }, {
    index: "name",
    title: "Name"
  }, {
    index: "email",
    title: "Email"
  }]);

  const userServices$ = Rx.Observable.fromPromise(
    sources.Services.users.index()
  );

  // const tablePropsRows$ = Rx.Observable.of([{
  //   id: 1,
  //   name: "Pepe Lopez",
  //   email: "plopez@gmail.com"
  // }, {
  //   id: 2,
  //   name: "Juan Sanchez",
  //   email: "jsancgez@msn.com"
  // }, {
  //   id: 3,
  //   name: "Sergio Vazquez",
  //   email: "svazquez@gmail.com"
  // }]);

  const tableProps$ = Rx.Observable.combineLatest(
    tablePropsCols$,
    userServices$,
    function(cols, user_data) {
      return {
        columns: cols,
        rows: user_data.records
      };
    }
  );

  const settings = {
    type: 'FormLabel',
    id: "main",
    children: [{
      type: 'Table',
      id: "table1",
      props$: tableProps$
    },{
      type: 'Slider',
      id: "slider1",
      props$: Rx.Observable.of({
        min: 40, value: 90, max: 150
      })
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
  Services: Services()
};

Cycle.run(mainApp, sources);
