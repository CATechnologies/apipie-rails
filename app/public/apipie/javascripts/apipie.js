$(document).ready(function () {
  if (typeof prettyPrint === 'function') {
    $('pre.ruby').addClass('prettyprint lang-rb');
    $('pre.json').addClass('prettyprint lang-json');

    $(".payload.json").each(function () {
      var obj = JSON.parse($(this).html());
      $(this).html(JSON.stringify(obj, '', 2));
    });

    prettyPrint();
  }
});
