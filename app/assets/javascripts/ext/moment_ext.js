moment.fn.formatUTC = function(formatString) {
  if(formatString.match(/[zZ]+/)) throw "Time zone display not currently supported";

  var m = moment(this);
  m.add('minutes', m.zone());
  return m.format(formatString);
}
