
import Rx from 'rx';

var _calculate = function (page, per_page, total, size) {
  // Calculate values
  return {
    page_start: 1,
    page_end: 10,
    page: page,
    from: 1,
    to: 30,
    total: total,
    per_page: per_page
  };
};

var model = function (props$, actions) {
  const propPage$ = props$.map(props => props.page).first();
  const propPerPage$ = props$.map(props => props.per_page).first();
  const propTotal$ = props$.map(props => props.total).first();
  const propSize$ = props$.map(props => props.size).first();

  return Rx.Observable.combineLatest(
    propPage$.concat(actions.page$),
    propPerPage$,
    propTotal$,
    propSize$,
    _calculate
  );
};

export default model;
