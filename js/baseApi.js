// 拼接请求url
$.ajaxPrefilter(function(options) {

    options.url = "http://ajax.frontend.itheima.net" + options.url;

});