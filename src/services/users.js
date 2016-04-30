
import faker from 'faker';

var UserServices = function(settings)  {

  var fake_users = [], i;

  for(i = 0; i < 100; i ++) {
    fake_users.push({
      id: i + 1,
      name: faker.name.findName(),
      email: faker.internet.email()
    });
  };

  var voidFn = function() {
    console.log("Do nothing");
  };

  var index = function(params) {
    var page = 1, per_page = 30, init, to;

    if(params && params.page) {
      page = params.page;
    }

    init = (page - 1) * per_page;
    to = init + per_page;

    return Promise.resolve({
      success: true,
      from: init,
      to: to,
      records: fake_users.slice(init, to),
      total: fake_users.length,
      per_page: per_page
    });
  };

  return {
    index: index,
    show: voidFn,
    create: voidFn,
    update: voidFn,
    destroy: voidFn
  };
};

export default UserServices;
