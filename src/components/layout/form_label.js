import Rx from 'rx';
import {h} from '@cycle/dom';
import isolate from '@cycle/isolate';


import Slider from '../form/slider'

var FormLabel = function (isolate_name, sources) {
/*  const slider = Slider("slider").component({
    DOM: sources.DOM,
    props$: Rx.Observable.of({
      min: 40, value: 70, max: 150
    })
  });
*/
  var intent = function (sources) {
    return {
    };
  };

  var model = function (props$, actions) {
    const propText$ = props$.map(props => props.text).first();
    const propError$ = props$.map(props => props.error).first();

    return Rx.Observable.combineLatest(
      propText$,
      propError$,
      function(text, error) {
        return {
          text: text,
          error: error
        };
      }
    );
  };

  var view = function (props$, value$) {
    const children$ = props$.map(props => props.children).map(child => child.DOM);

    return Rx.Observable.combineLatest(props$, value$, children$,
      function (props, value, children) {
        debugger;
        const class_error = value.error ? 'error' : '';
        return h('div.field' + class_error, [
          h('label', { innerHTML: value.text }),
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

var Widget = function(component) {
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


export default Widget(FormLabel);
