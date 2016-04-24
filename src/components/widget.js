
import isolate from '@cycle/isolate';

var Widget = function(settings) {
  const component = settings.component;
  const name = settings.name;
  const sources = settings.sources;
  sources.props$ = Rx.Observable.of(settings.props);

  var _main = function(passed_sources) {
    const context = component(settings);
    const intent = context.intent(passed_sources);
    const value$ = context.model(passed_sources.props$, intent);
    const sinks = {
      DOM: context.view(passed_sources.props$, value$),
      value$: value$,
      props$: passed_sources.props$
    };
    return sinks;
  };

  var _isolate = function(){
    return isolate(_main, name)(sources);
  };

  return _isolate();
};

export default Widget;
