$('#link-reg').on('click', function() {
    $(".register-box").show();
    $('.login-box').hide();
});
$('#link-login').on('click', function() {
    $(".register-box").hide();
    $('.login-box').show();
});
// 利用layui的自定义正则哦。具体看官网
// point留意,要创建layui的form对象哦
var form = layui.form;
var layer = layui.layer;

form.verify({
    pwd: [
        /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ],
    repwd: function(value, item) {
        if ($(".register-box input[name=password]").val() !== value) {
            console.log($(".register-box input[name=password]").val());
            return '两次密码不一样哦！';
        }
    }
});
// http://ajax.frontend.itheima.net
$('#register').on('submit', function(e) {
    e.preventDefault();
    console.log($(this).find('input').eq(0).val());
    $.ajax({
        type: 'POST',
        url: '/api/reguser',
        data: {
            username: $(this).find('input').eq(0).val(),
            password: $(this).find('input').eq(2).val()
        },
        success: function(res) {
            if (res.status != 0)
                return layer.msg(res.message);
            layer.msg(res.message);
            // 注册成功后，还需要自动跳转到登陆页面
            $('#link-login').click();
        }
    })
});
$('#form_login').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/api/login',
        data: {
            username: $(this).find('input').eq(0).val(),
            password: $(this).find('input').eq(1).val()
        },
        success: function(res) {
            if (res.status != 0)
                return layer.msg(res.message);
            layer.msg(res.message);
            // 登陆成功后，跳转到主页
            window.location.href = '../index.html'
        }
    })
})