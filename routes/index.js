var express = require("express");
var router = express.Router();
var session = require("express-session");
var grant = require("grant-express");
const request = require("request");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");

/* GET home page. */
router.get("/step1", function(req, res, next) {
  // Initialize
  var oauth = OAuth({
    consumer: {
      key: "da62acXTZMeFB59R",
      secret: "ENBw4XdKsSV3TtYb"
    },
    signature_method: "HMAC-SHA1",
    hash_function(base_string, key) {
      return crypto
        .createHmac("sha1", key)
        .update(base_string)
        .digest("base64");
    }
  });

  req.app.locals.oauth = oauth;

  const request_data = {
    url: "https://www.khanacademy.org/api/auth2/request_token",
    method: "POST"
  };

  // Note: The token is optional for some requests
  // const token = {
  //   key: "370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb",
  //   secret: "LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE"
  // };

  request(
    {
      url: request_data.url,
      method: request_data.method,
      form: oauth.authorize(request_data)
    },
    function(error, response, body) {
      // Process your data here

      // console.log(body);
      var responseBody = body;
      var re1 = /(?![oauth_token_secret=]).{16}/;
      var oauthTokenSecret = responseBody.match(re1)[0];
      req.app.locals.oauthTokenSecret = oauthTokenSecret;
      // console.log(oauthTokenSecret);

      var re2 = /([&oauth_token=]).{16}$/;
      var oauthToken = responseBody.match(re2)[0];
      req.app.locals.oauthToken = oauthToken;
      // console.log(oauthToken);

      res.redirect("/step2");
    }
  );
});

router.get("/step2", function(req, res, next) {
  // console.log(req.app.locals.oauth);
  var oauth = req.app.locals.oauth;
  // const oauth = OAuth({
  //   consumer: {
  //     key: "da62acXTZMeFB59R",
  //     secret: "ENBw4XdKsSV3TtYb"
  //   },
  //   signature_method: "HMAC-SHA1",
  //   hash_function(base_string, key) {
  //     return crypto
  //       .createHmac("sha1", key)
  //       .update(base_string)
  //       .digest("base64");
  //   }
  // });
  const request_data = {
    url: "https://www.khanacademy.org/api/auth2/authorize",
    method: "POST",
    data: {
      oauth_token: req.app.locals.oauthToken,
      oauth_token_secret: req.app.locals.oauthTokenSecret
    }
  };

  // Note: The token is optional for some requests
  const token = {
    oauth_token: req.app.locals.oauthToken,
    oauth_token_secret: req.app.locals.oauthTokenSecret
  };

  request(
    {
      url:
        request_data.url +
        "?" +
        "oauth_token=" +
        token.oauth_token +
        "&" +
        "identifier=" +
        "jbell0385@gmail.com" +
        "&" +
        "password=" +
        "password123!",
      method: request_data.method,
      form: oauth.authorize(request_data)
    },
    function(error, response, body) {
      // Process your data here

      // console.log("body: " + body);
      // var responseBody = body;
      // var re1 = /"(.*?)"/;
      // var redirect = responseBody.match(re1)[0];
      // req.app.locals.oauthTokenSecret = oauthTokenSecret;
      // console.log(oauthTokenSecret);

      // var re2 = /([&oauth_token=]).{16}$/;
      // var oauthToken = responseBody.match(re2)[0];
      // req.app.locals.oauthToken = oauthToken;
      // console.log(oauthToken);

      res.redirect("/step3");
    }
  );
});

router.get("/step3", function(req, res, next) {
  var oauth = req.app.locals.oauth;
  // const oauth = OAuth({
  //   consumer: {
  //     key: "da62acXTZMeFB59R",
  //     secret: "ENBw4XdKsSV3TtYb"
  //   },
  //   signature_method: "HMAC-SHA1",
  //   hash_function(base_string, key) {
  //     return crypto
  //       .createHmac("sha1", key)
  //       .update(base_string)
  //       .digest("base64");
  //   }
  // });
  const request_data = {
    url: "https://www.khanacademy.org/api/auth2/access_token",
    method: "POST",
    data: {
      oauth_token: req.app.locals.oauthToken,
      oauth_token_secret: req.app.locals.oauthTokenSecret
    }
  };

  // Note: The token is optional for some requests
  // const token = {
  //   oauth_token: req.app.locals.oauthToken,
  //   oauth_token_secret: req.app.locals.oauthTokenSecret
  // };

  console.log("oauth 1: " + oauth);
  console.log("oauth Global: " + req.app.locals.oauth);

  request(
    {
      url: request_data.url,
      method: request_data.method,
      form: oauth.authorize(request_data)
    },
    function(error, response, body) {
      // Process your data here
      console.log(body);
      res.send(oauth);
    }
  );
});

module.exports = router;
