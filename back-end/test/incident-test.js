var assert = require("chai").assert;
var request = require("request");

describe("/incident/get", function () {
  it("returns some data", function (done) {
    var url = "http://localhost:8080/incident/get?x=43&y=-71&d=1";
    request(url, function (err, response, body) {
      var bodyObj = JSON.parse(body);
      assert.isNull(err);
      assert.isArray(bodyObj);
      done();
    });
  });
});
