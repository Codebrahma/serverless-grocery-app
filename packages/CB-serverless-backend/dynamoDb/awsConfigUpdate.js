var AWS = require('aws-sdk');
var { config } = require('../utils/config');

module.exports = {
  awsConfigUpdate: function () {
    AWS.config.update({
      region: config.dbRegion,
      endpoint: config.dbLocalUrl,
    })
  }
}
