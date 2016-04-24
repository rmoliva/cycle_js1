import intent from './paginator/intent'
import model from './paginator/model'
import view from './paginator/view'


var Paginator = function (isolate_name, sources) {
  return {
    intent: intent,
    model: model,
    view: view
  };
};

export default Paginator();
