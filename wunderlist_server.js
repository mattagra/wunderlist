Wunderlist = {};

OAuth.registerService('wunderlist', 2, null, function(query) {
  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);

  return {
    serviceData: {
      id: identity.id,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email,
      username: identity.name
    },
    options: {profile: {name: identity.name}}
  };
});

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'wunderlist'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://www.wunderlist.com/oauth/access_token", {
        // headers: {
        //   Accept: 'application/json',
        // },
        params: {
          code: query.code,
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret),
          //redirect_uri: OAuth._redirectUri('wunderlist', config),
          //state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Wunderlist. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Wunderlist. " + response.data.error);
  } else {
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  var config = ServiceConfiguration.configurations.findOne({service: 'wunderlist'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  try {
    return HTTP.get(
      "https://a.wunderlist.com/api/v1/user", {
        headers: {
          "X-Access-Token": accessToken,
          "X-Client-ID": config.clientId
        }
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Wunderlist. " + err.message),
                   {response: err.response});
  }
};


Wunderlist.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

Wunderlist.getAllLists = function(access_token){
  var config = ServiceConfiguration.configurations.findOne({service: 'wunderlist'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var getAllLists = HTTP.get("http://a.wunderlist.com/api/v1/lists",
    {
      timeout: 5000,
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": config.clientId
      }
    }
  );
  if(getAllLists.statusCode === 200){
    console.log(getAllLists.data);
    return getAllLists.data;
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getAllLists.error);
  }
}

Wunderlist.getList = function(list_id, access_token) {
  var config = ServiceConfiguration.configurations.findOne({service: 'wunderlist'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var getList = HTTP.get("http://a.wunderlist.com/api/v1/lists/" + list_id,
    {
      timeout: 5000,
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": config.clientId
      }
    }
  );
  if(getList.statusCode === 200){
    return getList.data
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getList.error);
  }
}

Wunderlist.getTasks = function(list_id, access_token) {
  check(list_id, Number);
  check(access_token, String);
  var config = ServiceConfiguration.configurations.findOne({service: 'wunderlist'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var getTasks = HTTP.get("http://a.wunderlist.com/api/v1/tasks",
    {
      timeout: 5000,
      params: {
        list_id: list_id
      },
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": config.clientId
      }
    }
  );
  if(getTasks.statusCode === 200){
    return getTasks.data
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getTasks.error);
  }
}

Wunderlist.getTasksCount = function(list_id, access_token) {
  var config = ServiceConfiguration.configurations.findOne({service: 'wunderlist'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();
  
  var getTasksCount = HTTP.get("http://a.wunderlist.com/api/v1/lists/tasks_count",
    {
      timeout: 5000,
      params: {
        list_id: list_id
      },
      headers: {
        "X-Access-Token": access_token,
        "X-Client-ID": config.clientId
      }
    }
  );
  if(getTasksCount.statusCode === 200){
    return getTasksCount.data
  }else{
    throw new Meteor.Error(500, "Wunderlist call failed with error: "+getTasksCount.error);
  }
}