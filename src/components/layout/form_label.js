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

  const _debug = function(scope) {
    return function(value) {
      console.group(scope);
      console.log(value);
      console.groupEnd(scope);
    };
  };

  var view = function (props$, value$) {
    const propChildren$ = props$.do(
      _debug('props')
    ).pluck(
      'children'
    ).do(
      _debug('props.children')
    ).map(function(value) {
      _debug('props.children.value')(value)
      return Rx.Observable.from(value)
    }).do(
      _debug('flatMap')
    )

    const dom$ = propChildren$.pluck('DOM').do(
      _debug('child.DOM')
    );

  // ).do(
  //     _debug('props.children')
  //   ).map(function(child) {
  //     _debug('child')(child);
  //     return child.DOM;
  //   }).do(
  //     _debug('child.DOM')
  //   );

 // propChildren$.do(val => console.log(val));

    return dom$.combineLatest(props$, value$,
      function (children, value, props) {
        // debugger;
        const class_error = value.error ? 'error' : '';
        return h('div.field' + class_error, [
          h('label', { innerHTML: value.text }),
          children
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
