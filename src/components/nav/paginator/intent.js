
var intent = function (sources) {
  return {
    page$: sources.DOM
      .select('.page-link')
      .events('click')
      .map(ev => ev.target['data-page'])
  };
};

export default intent;
