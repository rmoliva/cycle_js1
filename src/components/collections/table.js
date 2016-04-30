import R from 'ramda';
import Rx from 'rx';
import {h} from '@cycle/dom';

var _creator = function(settings) {
  var intent = function(sources) {
    return {};
  };

  var model = function(props$, actions$) {
    const propCols$ = props$.map(props => props.columns);
    const propRows$ = props$.map(props => props.rows);
    return Rx.Observable.combineLatest(
      propCols$,
      propRows$,
      function(columns, rows) {
        return {
          columns: columns,
          rows: rows
        };
      }
    );
  };

  var _thead = function(columns, rows) {
    var tr = R.map(function(column) {
      return h('th',[
        column.title
      ])
    })(columns);
    return h('thead',[
      h('tr', tr)
    ]);
  };

  var _tbody = function(columns, rows) {
    var cols;
    var trows = R.map(function(row) {
      cols = R.map(function(col) {
        return h('td',[
          row[col.index]
        ]);
      })(columns);
      return h('tr', cols);
    })(rows);
    return h('tbody', trows);
  };

  var _tfooter = function(columns, rows) {
    return h('tfoot');
  };

  var view = function(props$, state$) {
    return Rx.Observable.combineLatest(props$, state$,
      function(props, state) {
        return h('table', [
          _thead(state.columns, state.rows),
          _tbody(state.columns, state.rows),
          _tfooter(state.columns, state.rows)
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

var Table = function() {
  return {
    creator: _creator,
    typename: 'Table'
  };
};

export default Table();
