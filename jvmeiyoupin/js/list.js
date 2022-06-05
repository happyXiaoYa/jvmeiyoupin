class List {
    constructor() {

        this.getData();
        this.bindEve();
        //默认页码
        this.currentPage = 1;
        //使用锁
        this.lock = false;
    }

    //绑定事件的方法
    bindEve() {
        //给ul绑定点击事件
        //this.addCart是ul的事件回调方法，所以内部this默认指向当前节点ul
        this.$('.sk_bd ul').addEventListener('click', this.addCart.bind(this));


        //滚动条事件
        window.addEventListener('scroll', this.lazyLoader);
    }



    // 获取数据
    async getData(page = 1) {
        // console.log(111);
        //1 发送axios请求获取数据
        //await 等待后面的promise解包完成拿到最后结果
        let { status, data } = await axios.get('http://localhost:8888/goods/list?current=' + page);
        // console.log(goodsData); 
        // console.log(status,data);

        //2 判断请求的状态是否成功
        //status是ajax服务器请求成功
        //data.code  接口返回数据正常
        if (status != 200 && DataTransfer.code != 1) throw new Error('获取数据失败');

        //3 循环渲染数据，追加到页面中去
        let html = '';
        data.list.forEach(goods => {
            // console.log(goods);
            html += `<li class="sk_goods" data-id="${goods.goods_id}">
                <a href="#none">
                    <img src="${goods.img_big_logo}" alst="" class='spimg'>
                </a>
                <h5 class="sk_goods_title">${goods.title}</h5>
                <p class="sk_goods_price">
                    <em>¥${goods.current_price}</em> 
                    <del>¥${goods.price}</del></p>
                <div class="sk_goods_progress">
                    已售<i>${goods.sale_type}</i>
                    <div class="bar">
                        <div class="bar_in"></div>
                    </div>
                    剩余<em>29</em>件
                </div>
                <a href="#none" class="sk_goods_buy" >立即抢购</a>
            </li>`;
        });

        // console.log(html);
        //将拼接好的字符串追t1加到ul中
        // console.log(this.$('.sk_bd ul'));
        this.$('.sk_bd ul').innerHTML += html;

    }

    /***********加入购物车***********/
    addCart(eve) {
        // console.log(this);
        //获取事件源，判断点击的是否为a标签
        //  console.log(eve.target.classList);
     
        if (eve.target.nodeName == 'IMG' || eve.target.className == 'spimg') {
            //获取商品id
            let id = eve.target.parentNode.parentNode.dataset.id;
            console.log(id);
            let spid=sessionStorage.setItem('spid',id)
            location.assign('../html/introduce.html')
        }
   if (eve.target.nodeName != 'A' || eve.target.className != 'sk_goods_buy')return;
        // console.log(eve.target.nodeName== 'IMG' || eve.target.className == 'spimg');

        //判断用户是否登录，如果local中有token，表示登录，没有表示该用户未登录
        let token = localStorage.getItem('token');
        // console.log(token);


        //没有token表示没有登录则需要跳转到登录页面
        if (!token) location.assign('../html/login.html?ReturnUrl=../html/list.html');

        //如果用户已经登录，此时需要将商品加入购物车
        //获取商品Id和用户id
        let goodsId = eve.target.parentNode.dataset.id;//自定义属性：访问方式/获取     节点.dataset.属性名  
        // console.log(goodsId);
        let userId = localStorage.getItem('user_id');

        this.addCartGoods(goodsId, userId);
    }

    addCartGoods(gId, uId) {
        // console.log(gId, uId);

        //给添加购物车接口发送请求
        //调用购物车接口后台要验证是否为登录状态，需要传递token
        //常量的地方默认都要大写

        const AUTH_TOKEN = localStorage.getItem('token');
        axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        //headers['Content-Type']  也是给headers对象中添加属性，只是. 语法不支持['Content-Type'] 这种写法
        axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        let param = `id=${uId}&goodsId=${gId}`;
        //({ data, status })预解析
        axios.post('http://localhost:8888/cart/add', param).then(({ data, status }) => {
            // console.log(data, status);

            //判断 添加购物车是否成功
            if (status == 200 && data.code == 1) {
                layer.open({
                    title: '商品添加成功'
                    , content: '去购物车查看商品吗？'
                    , btn: ['取消跳转', '进入购物车']
                    , btn2: function (index, layero) {
                        // console.log('去购物车');
                        location.assign('../html/cart.html');
                    }
                });
            } else if (status == 200 && data.code == 401) {//如果等率过期则重新登录
                //清除local中存的token和userid
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                //跳转登录页面
                location.assign('../html/login.html?ReturnUrl=../html/list.html');

            } else {
                layer.open({
                    title: '商品添加失败'
                    , content: '添加失败，是否要重新添加？'
                    , time: 3000
                });
            }
        })
    }



    /*****************揽加载的实现*****************/
    //当前需要内容高度===滚动条举例顶部的高度+可视区（当前页面）的高度
    //需要获取新的数据   当前实际内容高度<滚动条举例顶部的高度+可视区（当前页面）的高度

    lazyLoader = () => {
        //需要滚动条高度、可视区高度、实际内容高度
        let top = document.documentElement.scrollTop;
        // console.log(top);
        //可视区的高度
        let cliH = document.documentElement.clientHeight;
        // console.log(cliH);
        //实际内容的高度
        let conH = this.$('.sk_container').offsetHeight;
        // console.log(conH);
        //判断当滚动条的高度+可视区的高度>实际内容高度时就加载新数据
        if ((top + cliH) > (conH + 210)) {
            //一瞬间就满足条件会不停的触发数据加载，使用节流和防抖
            //如果锁时锁着的就结束代码执行
            if (this.lock) return;
            this.lock = true;

            //指定市建开锁
            setTimeout(() => {
                this.lock = false;
            }, 1000)
            // console.log(111);
            this.getData(++this.currentPage);
        }
    }


    //封装获取节点的方法，不做其他判断
    $(ele) {
        let res = document.querySelectorAll(ele);
        //如果获取到的是单个节点的集合就返回单个节点，如果是多个节点集合，就返回整个集合
        return res.length == 1 ? res[0] : res;
    }
}
new List;