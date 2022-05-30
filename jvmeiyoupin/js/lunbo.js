//1 获取节点
let ulLisObj = document.querySelectorAll('#div1 ul li');
let olLisObj = document.querySelectorAll('#div1 ol li');
let prev = document.querySelector('#goPrev');
let next = document.querySelector('#goNext');
// console.log(ulLisObj,olLisObj);

let lastIndex = 0;
let index = 0;

//2 给ol创建遍历函数
olLisObj.forEach = function (li, key) {
    //给li创建点击事件
    li.onclick = function () {
        lastIndex = index;
        index = key;
    }
    change();
}
//4 实现右边按钮
next.onclick = function () {
    lastIndex = index;
    index++;
    if (index > ulLisObj.length - 1) {
        index = 0;
    }
    change();
}
//5 实现左边按钮
prev.onclick = function () {
    lastIndex = index;
    index--;
    if (index < 0) {
        index = ulLisObj.length - 1;
    }
    change();
}
//6 自动播放
let times = '';
function autoPlay() {
    times = setInterval(function () {
        next.onclick();
    }, 2400)
}
autoPlay();
next.parentNode.onmouseover = function () {
    clearInterval(times);
}
next.parentNode.onmouseout = function () {
    autoPlay();
}
//3 操作显示对应的图片和按钮
function change() {
    ulLisObj[lastIndex].className = '';
    olLisObj[lastIndex].className = '';
    ulLisObj[index].className = 'ac';
    olLisObj[index].className = 'ac';
}