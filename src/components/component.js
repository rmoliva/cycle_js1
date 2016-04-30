import R from 'ramda';
import isolate from '@cycle/isolate';
import FormLabel from './layout/form_label';
import Slider from './form/slider';
import Table from './collections/table';

var _componentList = [
  FormLabel,
  Slider,
  Table
];

var _getWidgetByTypename = function(type) {
  return R.find(function(klass) {
    return klass.typename === type;
  })(_componentList);
};

var _widget = function(settings) {
  const component = settings.component;
  const id = settings.id;
  const sources = settings.sources;
  sources.props$ = settings.props$;

  var _main = function(passed_sources) {
    const context = component.creator(settings);
    const intent = context.intent(passed_sources);
    const value$ = context.model(passed_sources.props$, intent);

    const sinks = {
      DOM: context.view(passed_sources.props$, value$),
      value$: value$,
      props$: passed_sources.props$
    };
    return sinks;
  };
  return isolate(_main, id)(sources);
};


var Component = function(settings, sources) {
  let new_children;

  settings.component = _getWidgetByTypename(
    settings.type
  );
  settings.sources = sources;
  if(settings.children) {
    new_children = R.map(function(child) {
      return Component(child, sources);
    })(settings.children);
    settings.children = new_children;
  }

  var _findId = function(id) {
    if(settings.id === id) {
      return this;
    }
    if(settings.children) {
      return R.find(function(child) {
        if(child.settings.id === id) {
          return child;
        }
      })(settings.children);
    }
  };

  return {
    settings: settings,
    sinks: _widget(settings),
    findId: _findId
  };
};

export default Component;
