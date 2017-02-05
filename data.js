var revHash = require('rev-hash');
var glob = require('glob');
var ext = require('gulp-util').replaceExtension;

var path = require('path');
var fs = require('fs');

var config = require('./config.json');

function load() {
  return init(JSON.parse(fs.readFileSync('src/data/data.json')));
}

function init(data) {
  addIdToWorks(data);
  addYearToWorks(data);

  addIdToEditions(data);
  addNameToEditions(data);
  addYearToEditions(data);
  addWorksToEditions(data);
  addImagesToEditions(data);

  data.worksByYearAndTitle = sortWorksByYearAndTitle(data);
  data.editionsByYearAndTitle = sortEditionsByYearAndTitle(data);
  data.editionsByName = sortEditionsByName(data);

  return data;
}

function getYearFromEditionId(editionId) {
  return editionId.replace(/.*\/(\d{4})\/?.*/, '$1');
}

function addIdToWorks(data) {
  Object.keys(data.works).forEach((workId) => {
    data.works[workId].id = workId;
  });
}

function addYearToWorks(data) {
  Object.keys(data.works).forEach((workId) => {
    var work = data.works[workId];
    var years = work.editions
      .map((editionId) => getYearFromEditionId(editionId))
      .map((year) => parseInt(year));
    var year = Math.min.apply(Math, years);
    work.year = year;
  });
}

function addIdToEditions(data) {
  Object.keys(data.editions).forEach((editionId) => {
    data.editions[editionId].id = editionId;
  });
}

function addNameToEditions(data) {
  Object.keys(data.editions).forEach((editionId) => {
    data.editions[editionId].name = editionId.replace(/\/.*/, '');
  });
}

function addYearToEditions(data) {
  Object.keys(data.editions).forEach((editionId) => {
    data.editions[editionId].year = getYearFromEditionId(editionId)
  });
}

function addWorksToEditions(data) {
  Object.keys(data.editions).forEach((editionId) => {
    var works = Object.keys(data.works).filter((workId) =>
      data.works[workId].editions.indexOf(editionId) >= 0
    );
    data.editions[editionId].works = works;
  });
}

function addImagesToEditions(data) {
  Object.keys(data.editions).forEach((editionId) => {
    data.editions[editionId].images = {};

    config.imageSizes.forEach(size => {
      var imageGlobs = config.imageTypes.map(type => 
        'www/ausgaben/' + editionId + '/' + type +  
        ((size > 0) ? '_' + size + 'px' : '') + '.{jpg,png}'
      );
      var imagePaths = imageGlobs.map(i => glob.sync(i));
      var images = [].concat.apply([], imagePaths);
      data.editions[editionId].images[size] = images
        .map(i => ext(i, '_v-' + revHash(fs.readFileSync(i)) + path.extname(i)))
        .map(i => path.basename(i))
    });
  });
}

function sortWorksByYearAndTitle(data) {
  return Object.keys(data.works)
    .map((workId) => data.works[workId])
    .sort((w1, w2) => w1.year - w2.year || w1.title.localeCompare(w2.title))
    .map(work => work.id);
}

function sortEditionsByYearAndTitle(data) {
  return Object.keys(data.editions)
    .map((editionId) => data.editions[editionId])
    .sort((e1, e2) => e1.year - e2.year || e1.title.localeCompare(e2.title))
    .map(edition => edition.id);
}

function sortEditionsByName(data) {
  var editionsByName = {};
  Object.keys(data.editions).forEach(editionId => {
    var editionName = data.editions[editionId].name;
    editionsByName[editionName] = editionsByName[editionName] || [];
    editionsByName[editionName].push(editionId);
  });
  return editionsByName;
}

module.exports.load = load;
module.exports.init = init;
