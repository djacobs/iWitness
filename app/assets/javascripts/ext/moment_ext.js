moment.fn.formatUTC = function(formatString) {
  if(formatString.match(/[zZ]+/)) throw "Time zone display not currently supported";

  var m = moment(this);
  m.add('minutes', m.zone());
  return m.format(formatString);
}

moment.fn.isAfter = function(m) {
  return this.diff(m) > 0;
}

moment.fn.isBefore = function(m) {
  return this.diff(m) < 0;
}
