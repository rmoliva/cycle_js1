import Users from './users';

var Services = function(settings)  {
  return function() {
    return {
      users: Users(settings)
    };
  };
};

export default Services;
