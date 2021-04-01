var form = layui.form;
var layer = layui.layer;
// 表单验证
form.verify({

    samePwd: function(value, item) { //value：表单的值、item：表单的DOM对象
        if (value == $('[name="oldPwd"]').val()) {
            return '新旧密码不能相同';
        }
    },
    rePwd: function(value) {
        if (value != $('[name="newPwd"]').val()) {
            return '两次密码不一致';
        }
    }

    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    ,
    pwd: [
        /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
    ]
});
//开始请求ajax

$('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 修改密码后，需要重置表单哦
                $('.layui-form')[0].reset();
            }
        })
    })
    // status	int	请求是否成功，0：成功；1：失败
    // message