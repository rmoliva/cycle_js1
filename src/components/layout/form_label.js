import Rx from 'rx';
import R from 'ramda';
import {h} from '@cycle/dom';
// import Slider from '../form/slider'

var _creator = function (settings) {
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
    var doms = R.map(function(a) {return a.sinks.DOM;})(settings.children);
    var obs = R.concat([props$, value$],doms);
    return Rx.Observable.combineLatest(
      obs,
      function () {
        var props = arguments[0];
        var value = arguments[1];
        const class_error = value.error ? 'error' : '';
        return h('div.field' + class_error, [
          h('label', { innerHTML: value.text }),
          R.slice(2, Infinity, arguments)
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

const FormLabel = function() {
  return {
    creator: _creator,
    typename: 'FormLabel'
  };
};

export default FormLabel();
