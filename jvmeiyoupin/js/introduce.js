
/* ************放大镜************** */
class Magnify {
    constructor() {
        this.getTag();
        this.on();
    }

    // 获取节点
    getTag() {
        this.box = document.querySelector('#box');
        this.small = document.querySelector('#small');
        this.mask = document.querySelector('#mask');
        this.big = document.querySelector('#big');
        this.bigImg = document.querySelector('#img');
    }

    // 绑定事件
    on() {
        this.small.onmouseenter = this.overFn.bind(this);
        this.small.onmouseleave = this.outFn.bind(this);
        this.small.onmousemove = this.moveFn.bind(this)
    }

    //鼠标移入div#box
    overFn() {
        this.mask.style.display = 'block';
        this.big.style.display = 'block';
    }
    // 鼠标移出div#box
    outFn() {
        this.mask.style.display = 'none';
        this.big.style.display = 'none';
    }
    // 移动
    moveFn(event) {
        //  相对文档的坐标
        let px = event.pageX;
        let py = event.pageY;
        // box坐标
        let boxLeft = this.box.offsetLeft;
        let boxTop = this.box.offsetTop;
        // 小黄块相对div的位置
        let tmpx = px - boxLeft - this.mask.offsetWidth  -60;
        let tmpy = py - boxTop - this.mask.offsetHeight -170;

        // 小黄块边界最大值
        let maxLeft = this.small.offsetWidth - this.mask.offsetWidth;
        let maxTop = this.small.offsetHeight - this.mask.offsetHeight;

        // 判断
        if (tmpx < 0) tmpx = 0;
        if (tmpy < 0) tmpy = 0;
        if (tmpx > maxLeft) tmpx = maxLeft;
        if (tmpy > maxTop) tmpy = maxTop;

        this.mask.style.left = tmpx + 'px';
        this.mask.style.top = tmpy + 'px';

        // 大图最大值
        let bigImgMaxLeft = this.big.offsetWidth - this.bigImg.offsetWidth;
        let bigImgMaxTop = this.big.offsetHeight - this.bigImg.offsetHeight;

        //大图实时位置
        let tmpBigLeft = tmpx / maxLeft * bigImgMaxLeft;
        let tmpBigTop = tmpy / maxTop * bigImgMaxTop;

        // 将大图实时位置给到页面中
        this.bigImg.style.left = tmpBigLeft + 'px';
        this.bigImg.style.top = tmpBigTop + 'px';
    }
}

new Magnify;
