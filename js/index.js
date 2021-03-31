$(function() {
        // 一加载网页就获取用户信息，并且渲染头像
        getUserList();
        // 点击退出按钮
        var layer = layui.layer;
        $('#btn-logout').on('click', function() {
            // 可以用layui的弹出层，具体看内置模块-弹出层-内置方法-询问
            layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function(index) {
                //点击退出后，做什么事情
                console.log('ok'); //这里可以通过log输出测试的
                // 退出后，一定要把用户的token清除了
                localStorage.removeItem('token');
                location.href = '../login.html';
                layer.close(index);
            });
        })
    })
    // 写一个获取用户基础信息的函数
function getUserList() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        // headers统一在baseapi里面加
        // headers: {
        //     Authorization: "" + localStorage.getItem('token')
        // },
        success: function(res) {
            console.log('success的 res');
            console.log(res);

            if (res.status != 0) { return res.message }
            // 成功获取用户信息就渲染用户头像
            renderAvatar(res.data);
        },
        // 无论服务器响应是否成功，都会执行complete
        // complete: function(res) {
        //     console.log('complete的res');
        //     console.log(res);
        //     // 注意哦，success和complete返回的res是不一样的哦
        //     // 一定要把所有的条件写上去，更加严谨
        //     if (res.responseJSON.status == 1 && res.res.responseJSON.message == '身份认证失败！') {
        //         // 一定要清理token，虽然我个人觉得没有必要
        //         localStorage.removeItem('token');
        //         // 强制跳转到登陆页面
        //         location.href = '../login.html';
        //     }

        // }
        // 这个因为全局要用，所以放在baseapi里面
    })
}

function renderAvatar(user) {
    // 优先获取用户的昵称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 获取首字母
    if (user.user_pic == null) {
        // 如果用户本身没有头像，只能设置文本头像
        $('.text-avatar').html(name[0].toUpperCase()).siblings('img').hide();
        // $('.layui-nav-item .text-avatar').html(name[0].toUpperCase()).siblings('img').hide();

    } else {
        $('.userinfo img').attr('src', user.user_pic).siblings('.text-avatar').hide();
    }
}


// id int 用户的 id
//     +
//     username string 用户名 +
//     nickname string 昵称 +
//     email string 邮箱 +
//     user_pic string 头像， base64格式的图片