var express = require('express');
var router = express.Router();
var http = require('request-promise-json');
var Promise = require('promise');
var UrlPattern = require('url-pattern');
var config = require('config');
var utils = require('./utils');

var session;
var page_filter;
var api_url = new UrlPattern('(:protocol)\\://(:host)(:api)/(:operation)');
// MicroProfile
// var api_url = new UrlPattern('(:protocols)\\://(:host)(:api)/(:operation)');
var _apis = config.get('APIs');
// MicroProfile
// var _authServer = config.get('Auth-Server');

/* GET Catalog listing from API and return JSON */
router.get('/', function(req, res) {
    session = req.session;

    //page_filter = (typeof req.query.filter !== 'undefined') ? JSON.stringify(req.query.filter.order) : false;
    page_filter = "";

    setGetCustomerOptions(req, res)
        .then(sendApiReq)
        .then(sendResponse)
        .catch(renderErrorPage)
        .done();
});

// MicroProfile
/* Handle the Get request*/
// router.get('/userinfo', function (req, res) {
//   session = req.session;
//   setCustomerOptions(req, res)
//     .then(sendApiReq)
//     .then(sendResponse)
//     .catch(renderErrorPage)
//     .done();
//
// });
//
// router.get('/rest', function (req, res) {
//   session = req.session;
//   setCustomerOptionsFromCustomerMicroService(req, res)
//     .then(sendApiReq)
//     .then(sendResponse)
//     .catch(renderErrorPage)
//     .done();
//
// });

function setGetCustomerOptions(req, res) {
    var query = req.query;

    var customer_url = api_url.stringify({
        protocol: utils.getProtocol(_apis.customer.protocol),
        host: _apis.customer.service_name,
        api: _apis.customer.base_path,
        operation: "customer"
    });


    var options = {
        method: 'GET',
        url: customer_url,
        strictSSL: false,
        headers: {}
    };

    // Add Headers like Host
    if (_apis.customer.headers) {
        options.headers = _apis.customer.headers;
    }

    //if (_apis.customer.require.indexOf("client_secret") != -1) options.headers["X-IBM-Client-Secret"] = _apis.client_secret;

    return new Promise(function(fulfill) {

        // Get OAuth Access Token, if needed
        if (_apis.customer.require.indexOf("oauth") != -1) {
            options.headers.Authorization = req.headers.authorization;
            fulfill({
                options: options,
                res: res
            });
        } else fulfill({
            options: options,
            res: res
        });
    });
}

function setCustomerOptionsFromCustomerMicroService(req, res) {
  var form_body = req.body;
  //console.log("Browser request data:\n" + JSON.stringify(form_body));
  console.log("Form data:\n" + JSON.stringify(form_body));

  var customer_url = api_url.stringify({
    protocols: _apis.customerService.protocol,
    host: _apis.customerService.service_name,
    api: _apis.customerService.base_path,
    operation: "customer"
  });

  var basicAuthToken = _authServer.client_id + ":" + _authServer.client_secret;
  var buffer = new Buffer(basicAuthToken);
  var basicToken = 'Basic ' + buffer.toString('base64');

  var getCustomer_options = {
    method: 'GET',
    url: customer_url,
    strictSSL: false,
    headers: {},
  };
  return new Promise(function (fulfill) {
    // Get OAuth Access Token, if needed
    if (_apis.customerService.require.indexOf("oauth") != -1) {
      // If already logged in, add token to request
      getCustomer_options.headers.Authorization = req.headers.authorization;
      fulfill({
        options: getCustomer_options,
        res: res
      });
    }
    else {
        fulfill({
            options: getCustomer_options,
            res: res
        });
    }
  });

}

// MicroProfile
// function setCustomerOptions(req, res) {
//   var form_body = req.body;
//   //console.log("Browser request data:\n" + JSON.stringify(form_body));
//   console.log("Form data:\n" + JSON.stringify(form_body));
//
//   var customer_url = api_url.stringify({
//     protocols: _apis.customer.protocol,
//     host: _apis.customer.service_name,
//     api: _apis.customer.base_path,
//     operation: "userinfo"
//   });
//
//   var basicAuthToken = _authServer.client_id + ":" + _authServer.client_secret;
//   var buffer = new Buffer(basicAuthToken);
//   var basicToken = 'Basic ' + buffer.toString('base64');
//
//   var getCustomer_options = {
//     method: 'GET',
//     url: customer_url,
//     strictSSL: false,
//     headers: {},
//   };

function sendApiReq(function_input) {
  var options = function_input.options;
  var res = function_input.res;

  console.log("MY OPTIONS:\n" + JSON.stringify(options));

  // Make API call for Catalog data
  return new Promise(function (fulfill, reject) {
    http.request(options)
      .then(function (result) {
        console.log("Customer call succeeded with result: " + JSON.stringify(result));
        fulfill({
          data: result,
          res: res
        });
      })
      .fail(function (reason) {
        console.log("Customer call failed with reason: " + JSON.stringify(reason));
        reject({
          err: reason,
          res: res
        });
      });
  });
}

function sendResponse(function_input) {
  var data = function_input.data;
  var res = function_input.res;

  // Render the page with the results of the API call
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
}

function renderErrorPage(function_input) {
  var err = function_input.err;
  var res = function_input.res;
  // Render the error message in JSON
  res.setHeader('Content-Type', 'application/json');
  res.send(err);

}


module.exports = router;
