var layer = layui.layer
var form = layui.form

initCate()
    // 初始化富文本编辑器
initEditor();

// 定义加载文章分类的方法
function initCate() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('初始化文章分类失败！')
            }
            // 调用模板引擎，渲染分类的下拉菜单
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
            form.render()
        }
    })
}
// 初始裁剪
// 1. 初始化图片裁剪器
var $image = $('#image')
    // 2. 裁剪选项 
var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
$image.cropper(options);
// 为上传文件按钮绑定事件
$('#btnChooseImage').on('click', function() {
    $('#coverFile').click();
})


// 监听 coverFile 的 change 事件，获取用户选择的文件列表
$('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = this.files
            // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    // 把用户新选择的图片渲染到了裁剪区后，现在开始处理表单的事情了
    // 重点：state	是	string	状态，可选值为：已发布、草稿
    // 接口的其中一条参数是这样的
    // 这个和用户点击了已发布、草稿中哪个按钮有关系
    // 那么我们如何确定这个参数呢
var art_state = '已发布';
// 我们可以自定义一个默认的状态
// 如果用户点击另一个按钮，我们再去改变这个状态
$('#btnSave2').on('click', function() {
    art_state = '草稿';
});
// 发起请求
$('#form-pub').on('submit', function(e) {
    e.preventDefault();
    //现在开始准备请求的参数了，因为这次的接口需要的是请求体（FormData 格式），所以不能自己直接写对象了
    var fd = new FormData($(this)[0]);
    // 发布还是存草稿不在表单里面，需要单独追加
    fd.append('state', art_state);
    // console.log('formdata对象');
    // fd.forEach(function(v, k) {
    //     console.log(v, k);
    // });

    // 从这里可以看出，图片还是没有的
    // 需要找图片参数了，这时候利用cropper
    //API需要 blob二进制 类型
    $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            console.log('fd对象');
            fd.forEach(function(v, k) {
                    console.log(v, k);
                })
                // 6. 发起 ajax 数据请求
            publishArticle(fd);
            // 以下为测试打印
            console.log('调用ajax后，fd对象写里面');
            fd.forEach(function(v, k) {
                    console.log(v, k);
                })
                // 发起ajax请求必须写在toBlob里面？？？
                // 这里经过测试，可以知道，fd对象要有图片信息，必须写在blob的回调函数里面，因为这个回调函数是最后执行的，如果直接写外面，
                // 会先直接执行外面的publishArticle(fd)，此时的fd是还没有执行blob的回调函数，是没有办法获取带图片的fd的。
        })
        // publishArticle(fd)
        // 以下为测试打印
    console.log('fd对象写外面');
    fd.forEach(function(v, k) {
        console.log(v, k);
    })
})

// 定义一个发布文章的方法
function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败！')
            }
            layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
            location.href = '../article/article_list.html'
        }
    })
}