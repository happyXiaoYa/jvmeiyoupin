class Register {
    constructor() {
        //给注册按钮绑定事件
        this.$('.zhuce').addEventListener('click', this.isregister);

        //判断当前页面是否有回调页面
        let search = location.search;
        if (search) {
            this.url = search.split('=')[1];
        }

    }


    /*************实现注册*************/
    isregister = () => {
        // console.log(this);

        let form = document.forms[0].elements;
        // console.log(form);

        let username = form.uname.value.trim();
        // console.log(username);

        let password = form.password.value.trim();
        // console.log(password);

        let rpassword = form.rpassword.value.trim();
        // console.log(rpassword);

        let nickname = form.nickname.value.trim();
        // console.log(nickname);

        //非空验证
        if (!username || !password || !rpassword || !nickname) throw new Error('用户名或密码或重新输入密码或账号不能为空');
        if (password != rpassword) confirm('两次输入密码不一致，请重新输入密码');


        let param = `username=${username}&password=${password}&rpassword=${rpassword}&nickname=${nickname}`;
        axios.post('http://localhost:8888/users/register', param, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            console.log(res);

            //判断注册状态，将用户信息进行保存
            if (res.status == 200 && res.data.code == 1) {
                //将token和user保存到local
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user_id', res.data.user.id);

                //如果有回调的地址则跳转
                if (this.url) {
                    location.href = this.url;
                }
            }
        });



    }




    //封装获取节点的方法，不做其他判断
    $(ele) {
        let res = document.querySelectorAll(ele);
        //如果获取到的是单个节点的集合就返回单个节点，如果是多个节点集合，就返回整个集合
        return res.length == 1 ? res[0] : res;
    }
}
new Register;