
import Rx from 'rx';
import {h} from '@cycle/dom';

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
      ]);
    }
  );
};

export default view;
