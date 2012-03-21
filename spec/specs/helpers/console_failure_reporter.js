ConsoleFailureReporter = function() {
};

ConsoleFailureReporter.prototype.pp = function(value, appendTo) {
  var p = new jasmine.StringPrettyPrinter()
  p.format(value);
  if (appendTo){
    return appendTo + p.string;
  } else {
    console.log(p.string);
  }
};

ConsoleFailureReporter.prototype.reportRunnerStarting = function(runner) {
  console.log("starting suite\n");
  this.count = 0;
  this.passed = 0;
  this.failed = 0;
  this.startDate = new Date();
};

ConsoleFailureReporter.prototype.reportRunnerResults = function(runner) {
  var now = new Date();
  var runtime = now - this.startDate;
  var total = this.passed + this.failed;

  var stats = [
    "Time: " + runtime + "ms",
    "Specs: " + this.count,
    "Expectations: " +  total,
    "Passed: " + this.passed,
    "Failed: " + this.failed
  ];
  console.log(stats.join(", "));
};

ConsoleFailureReporter.prototype.reportSuiteResults = function(suite) {
};

ConsoleFailureReporter.prototype.reportSpecStarting = function(spec) {
  this.count++;
};

ConsoleFailureReporter.prototype.reportSpecResults = function(spec) {
  var resultItems = spec.results().getItems();

  for (var i = 0; i < resultItems.length; i++) {
    var result = resultItems[i];

    if (result.type == 'log') {
      console.log('log: '+ result.toString());
    } else if (result.type == 'expect' && result.passed && result.passed()) {
      this.passed++;
    } else if (result.type == 'expect' && result.passed && !result.passed()) {
      this.failed++;

      var msg = spec.getFullName();
      msg = msg + '\n   ' + result.toString();
      msg = this.pp(result.expected, msg + '\n   Expected: ');
      msg = this.pp(result.actual,   msg + '\n     Actual: ');
      console.log(msg+'\n');

      if (result.trace.stack) {
        console.log(result.trace.stack);
      }
    }
  }
};

ConsoleFailureReporter.prototype.log = function(str) {
};

