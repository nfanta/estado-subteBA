const { Client } = require('pg');
const invert = require('lodash.invert');
const { constants } = require('./scrapper');

const { DATABASE_URL } = process.env;

const client = new Client({
  connectionString: DATABASE_URL,
});

const STATUS_MAP = {
  Test: 0,
  [constants.STATUS_OK]: 1,
  [constants.STATUS_DELAYED]: 2,
  [constants.STATUS_SUSPENDED]: 3,
};

function statusStrToCode(str) {
  if (!STATUS_MAP[str]) {
    throw new Error(`Status ${str} not defined in current STATUS_MAP`);
  }
  return STATUS_MAP[str];
}

function statusCodeToStr(code) {
  return invert(STATUS_MAP)[code];
}

function lineStrToCode(str) {
  return str.charCodeAt(0);
}

function lineCodeToStr(code) {
  return String.fromCharCode(code);
}

function formatOutput(queryResult) {
  // eslint-disable-next-line arrow-body-style
  return queryResult.rows.reduce((obj, { line, status }) => {
    return Object.assign({}, obj, {
      [lineCodeToStr(line)]: statusCodeToStr(status),
    });
  }, {});
}

module.exports = {
  connect() {
    return client.connect();
  },
  close() {
    return client.end();
  },
  getAll() {
    return client.query('SELECT * FROM subways').then(formatOutput);
  },
  set(line, status) {
    const lineCode = lineStrToCode(line);
    const statusCode = statusStrToCode(status);
    return client.query('UPDATE subways SET status = $1 WHERE line = $2', [statusCode, lineCode]);
  },
};
