const request = require('request-promise');
const cheerio = require('cheerio');

const URL = 'http://www.metrovias.com.ar/';
const BASE_INFO_ELEMENT_SELECTOR = '[id^="status-line-"][id$="-container"]';
const DESCRIPTION_SELECTOR = '[id^="status-line-"]';
const LINE_NAME_REGEX = /status-line-(\w)-container/;
const SUBWAY_LINE_NAMES = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'H',
];

const STATUS_SUSPENDED_CSS_CLASS = 'suspendido';
const STATUS_DELAYED_CSS_CLASS = 'demorado';

const STATUS_DELAYED = 'Demorado';
const STATUS_SUSPENDED = 'Suspendido';
const STATUS_OK = 'Normal';

function getLineFromElem(elem) {
  return elem.attr('id').match(LINE_NAME_REGEX)[1];
}

function getStatusFromElem(elem) {
  if (elem.hasClass(STATUS_SUSPENDED_CSS_CLASS)) return STATUS_SUSPENDED;
  if (elem.hasClass(STATUS_DELAYED_CSS_CLASS)) return STATUS_DELAYED;
  return STATUS_OK;
}

function getDescriptionFromElem(elem) {
  return elem.find(DESCRIPTION_SELECTOR).text();
}

function getInfoObject(elem) {
  return {
    line: getLineFromElem(elem),
    status: getStatusFromElem(elem),
    description: getDescriptionFromElem(elem),
  };
}

function isSubway(lineName) {
  return SUBWAY_LINE_NAMES.includes(lineName);
}

function assign(obj, key, value) {
  return Object.defineProperty(obj, key, {
    enumerable: true,
    editable: false,
    value,
  });
}

function extractStatusObject($) {
  return $(BASE_INFO_ELEMENT_SELECTOR)
    .map((idx, elem) => getInfoObject($(elem)))
    .get()
    .reduce((acc, { line, status }) => {
      if (!isSubway(line)) return acc;
      return assign(acc, line, status);
    }, {});
}

async function get() {
  const $ = await request(URL).then(cheerio.load);
  return extractStatusObject($);
}

module.exports = {
  get,
};
