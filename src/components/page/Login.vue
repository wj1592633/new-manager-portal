<template>
    <div class="login-wrap" :style="bg">
        <div class="login">
            <div class="login_box">

                <div class="login_img">
                    <img src="../../assets/img/avatar1.jpg">
                </div>


                <div class="login_form">
                    <el-form v-if="usernameLogin" :model="param" :rules="rules" ref="usernameLogin" label-width="0px">
                        <!--<el-form-item label="账号">-->

                        <el-form-item prop="username">
                            <el-input v-model="param.username" placeHolder="账号" @keyup.enter.native="submitForm()">
                                <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                            </el-input>

                        </el-form-item>

                        <el-form-item prop="password">
                            <el-input v-model="param.password" show-password placeHolder="密码"
                                      @keyup.enter.native="submitForm()">
                                <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                            </el-input>
                        </el-form-item>

                        <div class="verify">
                            <el-form-item class="verCode" prop="verCode">
                                <el-input v-model="param.verCode">
                                    <el-button slot="prepend">验证码</el-button>
                                </el-input>
                            </el-form-item>
                            <div class="verImg" @click="initVerCode">
                                <img :src="verSrc" width="130px" height="48px"/>
                            </div>
                        </div>
                    </el-form>

                    <el-form v-if="!usernameLogin" class="form-up" :model="param" :rules="rulesPhone" ref="phoneLogin"
                             label-width="0px">
                        <!--<el-form-item label="账号">-->

                        <el-form-item prop="phone">
                            <el-input v-model="param.phone" placeHolder="手机号">
                                <el-button slot="prepend" icon="el-icon-mobile-phone"></el-button>
                            </el-input>

                        </el-form-item>

                        <div class="verify">
                            <el-form-item class="verCode" prop="verCode2">
                                <el-input v-model="param.verCode2">
                                    <el-button slot="prepend">验证码</el-button>
                                </el-input>
                            </el-form-item>
                            <div class="verImg">
                                <el-button type="success" class="send-sms" @click="sendSms" :disabled="disabled" plain>
                                    {{sendBtn}}
                                </el-button>
                            </div>
                        </div>
                    </el-form>
                    <div class="foot">
                        <div class="social">
                            <a href="#">
                                <img class="social-img" alt="github登陆" src="../../assets/img/github.jpg">
                            </a>
                            <a href="#">
                                <img class="social-img" src="../../assets/img/weibo.jpg">
                            </a>
                        </div>
                        <div>
                            <el-button type="info" plain @click="toUsernameLogin">账号登陆</el-button>
                            <el-button type="info" plain @click="toPhoneLogin">短信登陆</el-button>
                        </div>
                        <div class="login_btn">
                            <el-button type="primary" @click="doReset">撤销</el-button>
                            <el-button type="primary" @click="submitForm">登录</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!--<div>

            </div>-->
        </div>
    </div>
</template>

<script>
    import tool from '@/assets/js/ToolUtil'
    import http from '@/assets/js/public'
    var sysConfig = require('@/assets/js/sysConfig')
    export default {
        data: function () {
            return {
                sendBtn: '发送',
                disabled: false,
                param: {
                    username: 'admin',
                    password: '111',
                    verCode: ''
                },
                usernameLogin: true,
                verSrc: '',
                key: '',
                type: 'type=username',
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    verCode: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                },
                rulesPhone: {
                    phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                    verCode2: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                },
                bg: {}
            }
        },
        created() {
            //登陆页面的背景片
            var random = Math.floor(Math.random() * 7);
            this.bg.backgroundImage = 'url(' + require('../../assets/img/bg0' + random + '.jpg') + ')'
            this.initVerCode()
        },

        methods: {
            doReset() {

            },
            toUsernameLogin() {
                this.usernameLogin = true
                this.param = {
                    username: 'admin',
                    password: '111',
                    verCode: ''
                }
                this.type = 'type=username'
                const phoneForm = this.$refs.phoneLogin
                if (phoneForm) {
                    phoneForm.clearValidate()
                } else {
                    this.$refs.usernameLogin.clearValidate()
                }
            },
            toPhoneLogin() {
                this.usernameLogin = false
                this.param = {
                    phone: '123456',
                    verCode2: ''
                }
                this.type = 'type=phone'
                const usernameForm = this.$refs.usernameLogin
                if (usernameForm) {
                    this.$refs.usernameLogin.clearValidate()
                } else {
                    this.$refs.phoneLogin.clearValidate()
                }
            },
            submitForm() {
                let form = {}
                let url = sysConfig.urlPre + '/login'
                let postParam = Object.assign({}, this.param)
                // let postParam = tool.deepClone(this.param)
                postParam.key = this.key
                if (this.usernameLogin) {
                    postParam.username = this.param.username + this.type
                    form = this.$refs.usernameLogin
                } else {
                    url = url + '/phone'
                    postParam.phone = this.param.phone + this.type
                    postParam.verCode = this.param.verCode2
                    form = this.$refs.phoneLogin
                }
                form.validate(valid => {
                    if (valid) {
                        const loading = this.$loading({
                            lock: true,
                            text: '登陆中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        http.requestLogin(url, postParam).then(data => {
                            if (data.status === 200) {
                                this.$message.success('登录成功');
                                const lastTime = localStorage.getItem(sysConfig.thisTime)
                                localStorage.setItem(sysConfig.lastTime, lastTime)
                                const time = tool.formatDate(new Date())
                                localStorage.setItem(sysConfig.thisTime, time);
                                localStorage.setItem('ms_username', this.param.username);
                                this.$router.push('/');
                            } else {
                                this.$message.error(data.data);
                            }
                            loading.close();
                        }, error => {
                            loading.close();
                            this.$message({
                                showClose: true,
                                message: '登陆失败',
                                iconClass: 'el-icon-warning-outline',
                                duration: 1500,
                                showClose: true
                            })
                        })

                    }
                })
            },
            initVerCode() {
                const _this = this
                http.requestGet(sysConfig.urlPre + "/code/image").then((data) => {
                    _this.verSrc = data.code
                    _this.key = data.key
                })
            },
            sendSms() {
                const _this = this
                //要求phone必须填写
                this.$refs.phoneLogin.validateField("phone", (msg) => {
                    if (!msg) {

                        http.requestGet(sysConfig.urlPre + "/code/sms", {phone: this.param.phone}).then((data) => {
                            //禁用发送按钮
                            _this.disabled = true
                            var time = 60
                            const inter = setInterval(() => {
                                time = time - 1
                                if (time < 0) {
                                    time = 0
                                    clearInterval(inter)
                                    _this.disabled = false
                                    _this.sendBtn = '发送'
                                    return;
                                }
                                _this.sendBtn = time
                            }, 1000)
                            _this.key = data.key
                            _this.$message.success(data.code)
                        })
                    }
                })
            }
        },
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        /* background-image: url(../../assets/img/login-bg.jpg);*/
        background-size: 100%;
    }

    .form-up {
        margin-bottom: 35px;
    }

    .send-sms {
        margin-bottom: 5px;
    }

    .login {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .login_img {
        width: 150px;
        height: 150px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px #eee;
        border-radius: 50%;
        position: absolute;
        top: -25%;
        margin-left: auto;
        transform: translate(145px, 0);
    }

    div.login_img img {
        width: 90%;
        border-radius: 50%;
        position: absolute;
        top: 7%;
        left: 5%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        /*position: absolute;
        left: 50%;
        top: 50%;*/
        margin-left: 50%;
        transform: translate(-50%, 50%);
    }

    .login_btn {
        float: right;
        margin-right: 20px;
        margin-bottom: 5px;
    }

    .login_form {
        position: absolute;
        bottom: 5%;
        width: 98%;
        padding-left: 1%;
        padding-right: 1%;
    }

    .verCode {
        width: 50%;
    }

    .verImg {
        /*display: inline;*/
        margin-left: 50px;
        margin-bottom: 10px;
    }

    .verify {
        display: flex;
        /*justify-content: baseline;*/
        align-items: flex-end;
    }

    .foot {
        display: flex;
        justify-content: space-between;
    }

    .social {
        height: 35px;
        display: flex;
    }

    .social-img {
        width: 35px;
        border-radius: 50%;
        margin-left: 20px;
    }

    /*.social-img:hover {
        cursor: pointer;
    }*/
</style>