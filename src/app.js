import Cycle                from '@cycle/core';
import isolate                from '@cycle/isolate';
// import {makeDOMDriver}      from '@cycle/dom';
// import {makeHistoryDriver}  from '@cycle/history';
import Rx                   from 'rx';
// import Main                 from './main'
import {h, div, input, h2, span, makeDOMDriver} from '@cycle/dom';
import LabeledSlider from './components/labeled_slider';
import Paginator from './components/nav/paginator';


// // we are pulling in our css files here for webpack to compile
// require("!style!css!styles/pure-min.css");
// require("!style!css!styles/layout.css");
// require("!style!css!styles/grids-responsive-min.css");
//
// // creating our mainApp from /.main
// function mainApp(sources) {
//   let sinks = Main(sources);
//   return sinks
// }
//
// //const Props = Main(sources).Props
// // this is the Cycle run. first argument is our mainApp then an object:
// // DOM is the ID or class we want the cycle to render onto our page
// // History is using our makeHistoryDriver to deal with routing
// const sources = {
//   DOM: makeDOMDriver('#application'),
//   History: makeHistoryDriver({hash: false, queries: true}),
//   Props: () => Rx.Observable.just(0)
//
// };

debugger;

const debug = (scope) => (value) => console.log('-> ' + scope + ': ' + value);

function calculateBMI(weight, height) {
  const heightMeters = height * 0.01;
  const bmi = Math.round(weight / (heightMeters * heightMeters));
  return bmi;
};

function intent(DOM) {
  return {
    changeWeight$: DOM.select('#weight').events('input')
      .map(ev => ev.target.value),
    changeHeight$: DOM.select('#height').events('input')
      .map(ev => ev.target.value)
  };
};

function view(state$) {
  return state$.map(({weight, height, bmi}) =>
    div([
      renderWeightSlider(weight),
      renderHeightSlider(height),
      h2('BMI is ' + bmi)
    ])
  );
};

function model(actions) {
  return Rx.Observable.combineLatest(
    actions.changeWeight$.startWith(70),
    actions.changeHeight$.startWith(170),
    (weight, height) =>
      ({weight, height, bmi: calculateBMI(weight, height)})
  );
};

const mainApp = function (sources) {
  const weightProps$ = Rx.Observable.of({
     label: 'Weight', unit: 'kg', min: 40, initial: 70, max: 150
   });
   const heightProps$ = Rx.Observable.of({
     label: 'Height', unit: 'cm', min: 140, initial: 170, max: 210
   });
   const paginatorProps$ = Rx.Observable.of({
     page: 1, per_page: 30, total: 130, size: 5
   });

   const weightSources = {DOM: sources.DOM, props$: weightProps$};
   const heightSources = {DOM: sources.DOM, props$: heightProps$};
   const paginatorSources = {DOM: sources.DOM, props$: paginatorProps$};

   const weightSlider = LabeledSlider("weight").component(weightSources);
   const heightSlider = LabeledSlider("height").component(heightSources);
   const paginatorSlider = Paginator("paginator").component(paginatorSources);

   const weightVTree$ = weightSlider.DOM;
   const weightValue$ = weightSlider.value$;

   const heightVTree$ = heightSlider.DOM;
   const heightValue$ = heightSlider.value$;

   const paginatorVTree$ = paginatorSlider.DOM;
   const paginatorValue$ = paginatorSlider.value$;

   const bmi$ = Rx.Observable.combineLatest(weightValue$, heightValue$,
      (weight, height) => {
        const heightMeters = height * 0.01;
        const bmi = Math.round(weight / (heightMeters * heightMeters));
        return bmi;
      }
    );

  return {
    DOM: bmi$.combineLatest(weightVTree$, heightVTree$, paginatorVTree$,
      (bmi, weightVTree, heightVTree, paginatorVTree) =>
        div([
          weightVTree,
          heightVTree,
          h2('BMI is ' + bmi),
          paginatorVTree
        ])
      )
    };
};

const sources = {
  DOM: makeDOMDriver('#application'),
};

Cycle.run(mainApp, sources);
