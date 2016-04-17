
import isolate from '@cycle/isolate';

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

export default Widget;
