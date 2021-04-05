//1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
    // 1.2 配置选项
const options = {
    // 这些配置选项可以看收藏的api文档，也可以看cropper的站点实例
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)

// 现在开始自己写动作，上传文件
$('#upload').on('click', function() {
    $('input').click();
});
var layer = layui.layer
    // 点击上传按钮，上传文件后（change事件），获取文件的URL地址
$('input').on('change', function(e) {
        console.log(e);
        var filelist = this.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }
        // 获取用户新上传的文件
        var file = e.target.files[0];
        console.log(file); //输出一个对象
        // File {name: "p1.jpg", lastModified: 1610801170117, lastModifiedDate: Sat Jan 16 2021 20:46:10 GMT+0800 (中国标准时间), webkitRelativePath: "", size: 8530, …}
        var newImgURL = URL.createObjectURL(file);
        console.log(newImgURL); //blob:http://127.0.0.1:5500/8375c7f2-ece0-4790-a78a-d0ea8c0b64a4
        // 开始用cropper的方法
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 开始自己写方法请求ajax
$('#btn-upload').on('click', function() {
    // 要先用到裁剪之后的头像
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    $.ajax({
        url: '/my/update/avatar',
        type: 'POST',
        data: { avatar: dataURL },
        success: function(res) {
            console.log('1');
            if (res.status != 0) { return layer.msg(res.message) }
            console.log('2');
            layer.msg(res.message);
            window.parent.getUserList();

        }
    })
})