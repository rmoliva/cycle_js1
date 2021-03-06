import Rx from 'rx';
import {h, div, input, h2, span, makeDOMDriver} from '@cycle/dom';

var _creator = function(settings) {
  var intent = function(sources) {
    return sources.DOM
      .select('.slider')
      .events('input')
      .map(ev => ev.target.value)
  };

  var model = function(props$, actions$) {
    const propValue$ = props$.map(props => props.value);
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

var Slider = function() {
  return {
    creator: _creator,
    typename: 'Slider'
  };
};

export default Slider();
