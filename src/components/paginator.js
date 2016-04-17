import Rx from 'rx';
import Widget from './widget';
import {h} from '@cycle/dom';

var Paginator = function (isolate_name, sources) {
  var intent = function (sources) {
    return {
      page$: sources.DOM
        .select('.page-link')
        .events('click')
        .map(ev => ev.target['data-page'])
    };
  };

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

  var _pageLink = function (li_class, page, text) {
    return h('li'+li_class, [
      h('a.page-link', {
        'href': '#',
        'data-page': page
      }, [text])
    ]);
  };

  var view = function (props$, value$) {
    return Rx.Observable.combineLatest(props$, value$,
      function (props, value) {
        let page_class = '';
        let page_links = [];

        page_class = (value.page === value.page_start) ? '.disabled' : '';
        page_links.push(_pageLink(page_class, 1, 'Prev'));

        for (let i = value.page_start; i <= value.page_end; i++) {
          page_class = (i.toString() === value.page.toString()) ? '.active' : '';
          page_links.push(_pageLink(page_class, i, i));
        }

        page_class = (value.page === value.page_end) ? '.disabled' : '';
        page_links.push(_pageLink(page_class, value.page_end, "Next"));

        return h('nav', [
          h('ul.pagination', page_links)
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

export default Widget(Paginator);
