// 拼接请求url
$.ajaxPrefilter(function(options) {

    options.url = "http://ajax.frontend.itheima.net" + options.url;

    if (options.url.indexOf('/my/') != -1) {
        // url以这个/my/开头的就需要在headers加权限
        options.headers = {
            Authorization: "" + localStorage.getItem('token')
        }
    }
    // 无论响应是否成功，都要检查是否用户登陆了，如果没有登陆，是要强制把页面跳回到登陆页面的
    // 全局统一挂载complete的回调函数
    options.complete = function(res) {
        console.log('complete的res');
        console.log(res);
        // 注意哦，success和complete返回的res是不一样的哦
        // 一定要把所有的条件写上去，更加严谨
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 一定要清理token，虽然我个人觉得没有必要
            localStorage.removeItem('token');
            // 强制跳转到登陆页面
            location.href = '../login.html';
        }
    }
});