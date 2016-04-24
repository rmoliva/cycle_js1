import Rx from 'rx';
import {h, div, input, h2, span, makeDOMDriver} from '@cycle/dom';

import Widget from '../widget';

var Slider = function (settings) {

  var intent = function(sources) {
    return sources.DOM
      .select('.slider')
      .events('input')
      .map(ev => ev.target.value)
      .do(data => console.log(data));
  };

  var model = function(props$, actions$) {
    const propValue$ = props$.map(props => props.value).first();

    return Rx.Observable.combineLatest(
      propValue$.concat(actions$),
      function(value) {
        return {
          value: value
        };
      }
    );
  };

  var view = function(props$, state$) {
    return Rx.Observable.combineLatest(props$, state$,
      function(props, state) {
        return div('.labeled-slider', [
          span('.label',
            state.value.toString()
          ),
          input('.slider', {
            type: 'range', min: props.min, max: props.max, value: state.value
          })
        ])
      }
    );
  };

  return {
    intent: intent,
    model: model,
    view: view
  };
};

export default Slider;
