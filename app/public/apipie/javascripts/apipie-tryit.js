/*jslint: */
$(document).ready(function () {

  function generateURL(basic_url, params) {
    var url = basic_url;

    // Filled params
    _.each(params, function (param) {
      url = url.replace(":" + param.name, param.value);
    });

    // Remove optional params
    url = url.replace(/\(:\w+\)/g, '');

    return url;
  }

  var $tryit = $(".try-it")
    , format_request = _.template("<strong class='method'><%= xhr.method %></strong> <%= xhr.url %><% _.each(headers, function(value, key) { %> <br><strong class='header'><%= key %></strong>: <%= value %><% }); %>")
    , format_response = _.template("<strong class='httpcode'><%= xhr.status %></strong> <%= xhr.statusText %><% _.each(headers, function(value, key) { %> <br><strong class='header'><%= key %></strong>: <%= value %><% }); %>")
    , format_error = _.template("<strong class='httpcode'><%= xhr.status %></strong> <%= xhr.statusText %>");

  $('button.run', $tryit).click(function (e) {
    e.preventDefault();

    var request
      , request_headers
      , params;

    request_headers = {
      'Host': window.location.host
    , 'Accept':'*/*' // TODO
    , 'Accept-Charset':'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
    , 'Accept-Encoding':'gzip,deflate,sdch'
    , 'Accept-Language':'en,es;q=0.8,en-GB;q=0.6,ca;q=0.4'
    };

    params = $tryit.find('form').serializeArray();

    request = {
      method: $tryit.data('http-method')
    , url: generateURL($tryit.data('api-url'), params)
    , dataType: $tryit.find('input.format').val()
    };

    $(".request", $tryit).html(format_request({xhr:request, headers: request_headers}));
    $(".loading", $tryit).fadeIn();
    $(".response", $tryit).removeClass('error').html('Waiting...');
    $(".output", $tryit).html('\n');
    $(".curl", $tryit).hide();

    $.ajax(request).done(function (data, text, xhr) {
      var response_headers = _.reduce(xhr.getAllResponseHeaders().split('\r\n'), function (memo, header){
        var data = header.split(': ')
        if (data && data.length === 2) {
          memo[data[0]] = data[1];
        }
        return memo;
      }, {});

      $(".response", $tryit).html(format_response({xhr: xhr, headers: response_headers}));
      $(".output", $tryit).text(xhr.responseText);
      prettyPrint();
      $(".loading", $tryit).fadeOut();
    }).fail(function(xhr) {
      // For curl
      last_request = _.extend(request, {
        url: 'https://' + window.location.host + request.url
      , data: params
      });
      $(".response", $tryit).addClass('error').html(format_error({xhr: xhr}));
      $(".loading", $tryit).fadeOut();
    });
  });

  $(".show-try-it").click(function () {
    $tryit.fadeIn();
    $(".loading, .curl", $tryit).hide();
    $tryit.find(".params input:first").select().focus();
  });

  $(".hide-try-it").click(function () {
    $tryit.fadeOut();
  });

  $(".curl").click(function (e) {
    e.preventDefault();
    if (last_request) {
      prompt('Curl request:', curl(last_request));
    }
  });

});
