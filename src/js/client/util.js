function isSearchMatch(term, props) {
  var lowerCaseTerm = term.toLowerCase();
  return (object) => {
    return Object.keys(object)
      .filter((prop) => props.indexOf(prop) >= 0)
      .map((prop) => object[prop].toString().toLowerCase())
      .filter((val) => val.indexOf(lowerCaseTerm) >= 0)
      .length > 0;
  }
}

function editionDesc(edition, after) {
  if (edition.edition_desc) {
     return edition.edition_desc + (after || '');
  }
  if (edition.edition) {
     return edition.edition + '. Auflage' + (after || '');
  }
  return null;
}

module.exports = {
  isSearchMatch: isSearchMatch,
  editionDesc: editionDesc,
};
