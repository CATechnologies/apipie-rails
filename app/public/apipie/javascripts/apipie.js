$(document).ready(function () {
  if (typeof prettyPrint === 'function') {
    $('pre.ruby').addClass('prettyprint lang-rb');
    $('pre.json').addClass('prettyprint lang-json');
    prettyPrint();
  }
});
