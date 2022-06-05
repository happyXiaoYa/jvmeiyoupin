
/* ************放大镜************** */
class Magnify {
    constructor() {
        // this.getTag();
        // this.on();

        this.getData();
        // this.bindEve();



    }

    //绑定事件的方法
    // bindEve() {
    //     //给ul绑定点击事件
    //     // this.$('.sk_bd ul').addEventListener('click', this.getData.bind(this));

    // }

    //获取数据
    getData() {
        // console.log(this);
        let spid = sessionStorage.getItem('spid')
        // console.log(spid);

        // const AUTH_TOKEN = localStorage.getItem('token');
        // axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
        // axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        axios.get('http://localhost:8888/goods/item/' + `${spid}`).then(({ data }) => {
            console.log(data);
            //循环渲染数据，追加到页面中去
            let html = '';
            html += `<div class="imgpart box" id="box">
            <div class="pic goodsimg small" id="small">
                <img src="${data.info.img_big_logo}" alt="">

                <div class="magnify mask" id="mask"></div>
            </div>

            <div class="bigpic goodsimg big" id="big">
                <img src="${data.info.img_big_logo}" alt="" id="img">
            </div>
        </div>`;
            // console.log(html);
            let html1 = '';
            // html1 += `<h2>商品</h2>${data.info.title}`;

            //添加到页面中
            this.$('.fdj').innerHTML = html;
            // this.$('#cpm').innerHTML = html1;



            //* 放大镜

            //获取元素
            let box = document.querySelector('#box');
            let small = document.querySelector('#small');
            let mask = document.querySelector('#mask');
            let big = document.querySelector('#big');
            let img = document.querySelector('#img');

            // console.log(box, small, mask, big, img);

            //    1. 鼠标移入到小盒子里面,黄色盒子和大盒子出现,移出,则黄色盒子和大盒子消失
            //    1.1 鼠标移入到small中mask和big展示
            small.onmouseenter = function () {
                mask.style.display = 'block';
                big.style.display = 'block';
            }
            // 1.2 鼠标移出small,mask和big隐藏
            small.onmouseleave = function () {
                mask.style.display = 'none';
                big.style.display = 'none';
            }
            // 2. 黄色盒子在小盒子范围内活动,鼠标在黄色盒子中间
            // 2.1 small注册鼠标移动事件
            small.onmousemove = function (e) {
                //2.2 在事件处理函数中,获取到鼠标在可视区的坐标
                var x = e.clientX;
                var y = e.clientY;
                //2.3 在事件处理函数中,获取相对于body的左,上偏移量
                var offLeft = box.offsetLeft;
                var offTop = box.offsetTop;
                // 2.4 计算鼠标在small里面的坐标  可视区坐标 - box的偏移量
                var targetX = x - offLeft;
                var targetY = y - offTop;

                // 2.6 让鼠标到mask中间(其实是mask在鼠标坐标的基础上,往左,往上,自己宽高的一半)
                targetX -= mask.offsetWidth +50 ;
                targetY -= mask.offsetHeight +100;

                //2.7 限制mask的位置
                // 2.7.1 获取最大,最小距离
                var maxX = small.offsetWidth - mask.offsetWidth //small的宽 - mask的宽
                var maxY = small.offsetHeight - mask.offsetHeight //small的宽 - mask的宽
                // 2.7.2 判断有没有超出最大/最小距离
                targetX = targetX < 0 ? 0 : targetX;
                targetX = targetX > maxX ? maxX : targetX;
                targetY = targetY < 0 ? 0 : targetY;
                targetY = targetY > maxY ? maxY : targetY;
                //        2.5 给mask赋值,渲染
                mask.style.left = targetX + 'px';
                mask.style.top = targetY + 'px';

                //  3. 黄色盒子覆盖到哪里,对应的大盒子里图片展示哪里
                //  mask移动的距离 / mask移动的最大距离 == img移动的距离 / img移动的最大距离
                //
                //  img移动的距离 = mask移动的距离 / mask移动的最大距离 * img移动的最大距离
                // 3.1 计算img移动的最大距离  img的宽 - big的宽
                var imgMaxX = img.offsetWidth - big.offsetWidth;
                var imgMaxY = img.offsetHeight - big.offsetHeight;
                //              3.2 根据公式计算img应该移动多少
                var imgX = targetX / maxX * imgMaxX;
                var imgY = targetY / maxY * imgMaxY;
                //              3.3 给img赋值,负值
                img.style.left = -imgX + 'px';
                img.style.top = -imgY + 'px';

            }

        })
    }

    //封装获取节点的方法，不做其他判断
    $(ele) {
        let res = document.querySelectorAll(ele);
        //如果获取到的是单个节点的集合就返回单个节点，如果是多个节点集合，就返回整个集合
        return res.length == 1 ? res[0] : res;
    }
}

new Magnify;
