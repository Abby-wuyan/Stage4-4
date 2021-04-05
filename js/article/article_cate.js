var layer = layui.layer;
var form = layui.form;

function initialArticleList() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function(res) {
            if (res.status != 0) return layer.msg(res.message);
            console.log('文章类别列表');
            console.log(res);
            var htmlstr = template('temp-article', res);
            $('tbody').empty().html(htmlstr);
        }
    })
}
initialArticleList();
// 添加类别,点击按钮会有弹窗给用户填写
var indexAdd = null;
$('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            // 把按钮去掉，默认是0，是个信息框，有确定按钮
            area: ['500px', '250px'],
            // 这些都是在基础参数那里看的
            title: '添加文章分类',
            content: $('#tem-articalAdd').html()
                // 为了可以在html页面写内容，还是用模板引擎在html写吧
        });
    })
    // 填写完后，需要提交表单，ajax
    // 注意，后面生成的元素，只能通过事件委托，这个模板生成的弹窗，父亲就是body
$('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                initialArticleList();
                // 接下来需要关闭弹出层了，这个需要以来laiui的关闭层
                layer.close(indexAdd);
            }
        })
    })
    //删除功能，也是事件委派的形式
var indexEdit = null
$('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            })
            // 开始请求ajax，通过ID获取删除的当前行的数据信息，再利用layui填充表单信息
            // 如何获取当前数据的ID，可以通过点击该按钮之前，给她添加自定义属性，获取这个id
            // var id = $(this).attr('data-id');
        var id = $(this).data('id');
        console.log('id:' + id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            // data: { id: id },
            // 注意看文档，里面的那个参数是url参数，不是data参数，呜呜呜
            // 还有文档是这样描述的/my/article/cates/:id，自己写的时候记得把冒号去掉
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                // 利用layui把表单信息一次性填好
                form.val('form-edit', res.data)
            }
        })
    })
    // 修改文章后，提交表单
$('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            // api要求里面有ID，这个只能在表单里面加一个隐藏表单，保存ID
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                initialArticleList();
                // 关闭弹出层
                layer.close(indexEdit);
            }
        })
    })
    // 给删除按钮绑定事件
$('body').on('click', '.btn-delete', function() {

    var id = $(this).siblings().data('id');
    console.log('删除按钮的ID：' + id);
    // 弹出提示框
    layer.confirm('确认是否删除?', { icon: 3, title: '提示' }, function(index) {
        $.ajax({
            type: 'GET',
            url: '/my/article/deletecate/' + id,

            success: function(res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                initialArticleList();
            }
        })

        layer.close(index);
    });

})