const request = require('request-promise');

const { API_URL } = process.env;

const SHORT_NAME = 'ubicacion_nombre_corto';
const STATUS = 'estado';

let rawResponse;

function processOutput(response) {
  rawResponse = response;

  return response.items.reduce((obj, entry) => {
    const line = entry[SHORT_NAME];
    const status = entry[STATUS];

    return Object.assign({}, obj, {
      [line]: status,
    });
  }, {});
}

module.exports = {
  get() {
    return request({
      uri: API_URL,
      json: true,
    }).then(processOutput);
  },
  getRawResponse() {
    return rawResponse;
  },
};
