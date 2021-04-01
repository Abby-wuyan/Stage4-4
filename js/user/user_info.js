console.log($('input[name="username"]'));
// 这个只是测试可不可以利用属性筛选

var form = layui.form;
var layer = layui.layer;
// 利用layui自定义验证规则
form.verify({
    nickname: function(value, item) { //value：表单的值、item：表单的DOM对象
        if (value.length > 6) {
            return '昵称长度必须在1-6个字符之间哦';
        }

    }
});
initUserInfo();
// 用户初始化
function initUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status != 0) {
                return console.log(res.message);
            }
            console.log(res.data);
            // $('input[name="username"]').val(res.data.username);
            // 可以用layui的方法,这样可以把一个对象的属性值给赋给整个表单
            form.val('formUserInfo', res.data);
            // 第二个值是对象，只要有对应的属性值就好，不要求数量要一致

        }
    })
}
// status	int	请求是否成功，0：成功；1：失败
// message	string	请求结果的描述消息
// data	object	用户的基本信息
// + id	int	用户的 id
// + username	string	用户名
// + nickname	string	昵称
// + email	string	邮箱
// + user_pic	string	头像，base64格式的图片
// 重置表单的数据
$('#btnReset').on('click', function(e) {
    e.preventDefault(); //阻止表单的清空数据
    initUserInfo(); //重置就是把原来的用户信息重新展示出来
})

// 现在开始修改提交表单信息
$('.layui-form').on('submit', function(e) {
    e.preventDefault(); //记得要加这个啊，不然后面的ajax请求是没用的
    $.ajax({
        type: 'POST',
        data: $(this).serialize(),
        url: '/my/userinfo',
        success: function(res) {
            if (res.status != 0) return layer.msg(res.message);
            layer.msg(res.message);
            // 因为这个页面是index页面的iframe加载的，
            window.parent.getUserList();
        }

    })
})


// status	int	请求是否成功，0：成功；1：失败
// message