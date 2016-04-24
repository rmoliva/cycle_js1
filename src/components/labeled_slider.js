import Rx                   from 'rx';
import isolate                from '@cycle/isolate';
import {div, input, span} from '@cycle/dom';


var LabeledSlider = function() {
  var creator = function(settings) {
    var intent = function(sources) {
      return sources.DOM
        .select('.slider')
        .events('input')
        .map(ev => ev.target.value);
    };

    var model = function(props$, actions$) {
      return props$
        .map(props => props.initial)
        .first().concat(actions$);
    };

    var view = function(props$, value$) {
      return Rx.Observable.combineLatest(props$, value$,
        (props, value) =>
          div('.labeled-slider', [
            span('.label',
              props.label + ' ' + value + props.unit
            ),
            input('.slider', {
              type: 'range', min: props.min, max: props.max, value
            })
          ])
      );
    };

    return {
      intent: intent,
      model: model,
      view: view
    };
  };


  return {
    creator: creator 
  };
};

var Component = function(component) {
  return function(isolate_name) {
    var main = function(sources) {
      const context = component(isolate_name, sources);
      const value$ = context.model(sources.props$, context.intent(sources));
      const sinks = {
        DOM: context.view(sources.props$, value$),
        value$,
      };
      return sinks;
    };

    return {
      component: isolate(main, isolate_name)
    };
  };
};

export default Component(LabeledSlider);
