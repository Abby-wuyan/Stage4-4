 // 定义一个查询的参数对象，将来请求数据的时候，
 // 需要将请求参数对象提交到服务器
 //  因为cate_id和state都是可选的上传参数，选择不同，实现的功能不同
 //  所以还是另外在请求之前另外定义这个参数
 var q = {
     pagenum: 1, // 页码值，默认请求第一页的数据
     pagesize: 2, // 每页显示几条数据，默认每页显示2条
     cate_id: '', // 文章分类的 Id
     state: '' // 文章的发布状态
 }
 var layer = layui.layer;
 var form = layui.form;

 // 美化时间的过滤器 
 template.defaults.imports.dataFormat = function(date) {
     // 这里面写上美化时间的函数
     var d = new Date(date);
     var y = d.getFullYear();
     var m = d.getMonth() + 1;
     m = m < 10 ? '0' + m : m;
     var day = d.getDate();
     day = day < 10 ? '0' + day : day;
     var h = d.getHours();
     h = h < 10 ? '0' + h : h;
     var mins = d.getMinutes();
     mins = mins < 10 ? '0' + mins : mins;
     var s = d.getSeconds();
     s = s < 10 ? '0' + s : s;
     return y + '/' + m + '/' + day + ' ' + h + ':' + mins + ':' + s;
 }

 function initialArticleList() {
     $.ajax({
         method: 'GET',
         url: '/my/article/list',
         data: q,
         success: function(res) {
             if (res.status !== 0) {
                 return layer.msg('获取文章列表失败！')
             }
             // 使用模板引擎渲染页面的数据
             var htmlStr = template('tem-list', res)
             $('tbody').empty().html(htmlStr)
             console.log('文章列表');
             console.log(res);
             //  渲染数据列表后，还需要渲染分页
             // 直接写一个函数再调用吧,获取请求后只知道一个数据总数res.total
             renderPage(res.total);
         }
     })
 }
 initialArticleList();
 // pagenum	是	int	页码值
 // pagesize	是	int	每页显示多少条数据
 // cate_id	否	string	文章分类的 Id
 // state	否	string	文章的状态，可选值有：已发布、草稿
 // + Id	int	文章 Id
 //  下面开始写筛选表单的东西
 // 先获取文章分类的option
 function initialArticleCate() {
     $.ajax({
         type: 'GET',
         url: '/my/article/cates',
         success: function(res) {
             if (res.status != 0) return layer.msg(res.message);
             console.log('文章类别列表');
             console.log(res);
             var htmlstr = template('temp-articleCate', res);
             $('#cate').empty().html(htmlstr);
             //  表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的。
             // 通过 layui 重新渲染表单区域的UI结构
             form.render()
         }
     })
 }
 initialArticleCate();
 //  筛选表单提交表单时候，就进行筛选
 $('#form-search').on('submit', function(e) {
         e.preventDefault();
         //  因为表单没提供全部的请求数据的参数，所以只能手动一个个获取自己有需要的
         q.cate_id = $('#cate').val();
         q.state = $('#state').val();
         initialArticleList();
     })
     //  渲染分页（通过layui），而且这个分页点击对应按钮可以获取相应的一些关于页码的参数
     //  已知数据，通过接口返回的数据总数，和请求q对象里面的页码和每页数量
 function renderPage(total) {

     var laypage = layui.laypage;

     //执行一个laypage实例
     laypage.render({
         elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
             ,
         count: total, //数据总数，从服务端得到
         limit: q.pagesize, // 每页显示几条数据
         curr: q.pagenum, // 设置默认被选中的分页
         limits: [2, 4, 6, 8, 10] //每页条数,上面对象q是默认先2条
             ,
         //  layui默认是展示'prev', 'page', 'next'这三个项目，哪怕上面设置了参数都没用，一定要在这里设置自定义排版。
         layout: ['count', 'skip', 'prev', 'page', 'next', 'limit'],
         //  当分页被切换时触发这个回调函数，laiui提供一个对象可以获取当前分页信息
         jump: function(obj, first) {
             //obj包含了当前分页的所有参数，比如：
             console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
             console.log(obj.limit); //得到每页显示的条数
             // 把最新的页码值，赋值到 q 这个查询参数对象中
             q.pagenum = obj.curr
                 // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
             q.pagesize = obj.limit
                 // 根据最新的 q 获取对应的数据列表，并渲染表格
                 // initTable()
                 //首次不执行
             console.log(first); //首次加载，first是true，点击分页后first就是undefined了
             //  这个first也是layui提供的
             if (!first) {
                 // 首次加载，本身就通过initialArticleList方法调用了renderPage方法，然后renderPage方法又调用了initialArticleList方法，就这样会进入死循环
                 //so要放在这里，要排除首页加载时候就调用了jump里面的initialArticleList方法
                 initialArticleList();
             }
         }
     });

 }
 // 通过代理的形式，为删除按钮绑定点击事件处理函数
 $('tbody').on('click', '.btn-delete', function() {
     // 获取删除按钮的个数，文章列表返回的数据是根据所在页码和每页条数返回的
     var len = $('.btn-delete').length
     console.log(len)
         // 获取到文章的 id
     var id = $(this).attr('data-id')
         // 询问用户是否要删除数据
     layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
         $.ajax({
             method: 'GET',
             url: '/my/article/delete/' + id,
             success: function(res) {
                 if (res.status !== 0) {
                     return layer.msg(res.message)
                 }
                 layer.msg('删除文章成功！')
                     //  删除数据，完全不影响分页的变化，所以需要自己手动处理一下当前的页码数
                     // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                     // 如果没有剩余的数据了,则让页码值 -1 之后,
                     // 再重新调用 渲染文章列表的 initialArticleList(); 方法
                     // 4
                 if (len === 1) {
                     //  通过一开始触发点击删除按钮时候，获取删除按钮的个数
                     // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                     // 页码值最小必须是 1
                     q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                 }
                 initialArticleList();
             }
         })

         layer.close(index)
     })
 })