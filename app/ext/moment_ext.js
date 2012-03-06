moment.fn.formatWithTimezoneOffset = function(offset, formatString) {
  if(formatString.match(/[zZ]+/)) throw "Time zone display not currently supported";

  var m = moment(this);
  m.add('minutes', m.zone()).add('hours', offset);
  return m.format(formatString);
}

moment.fn.formatUTC = function(formatString) {
  return this.formatWithTimezoneOffset(0, formatString);
}

moment.fn.eodUTC = function() {
  var utcHours  = moment(this).add('minutes', this.zone()).hours();
  var hoursDiff = 23 - utcHours;

  this.add('hours', hoursDiff).minutes(59).seconds(59).milliseconds(999);
  return this;
}

moment.fn.isAfter = function(m) {
  return this.diff(m) > 0;
}

moment.fn.isBefore = function(m) {
  return this.diff(m) < 0;
}
