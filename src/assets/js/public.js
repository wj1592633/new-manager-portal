import router from '../../router';
import axios from 'axios'
import Qs from 'qs'

var sysConfig = require('@/assets/js/sysConfig')

// axios配置
// 跨域
axios.defaults.withCredentials = true
axios.defaults.timeout = 5000
//axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

// **************************************【注意】开始*********************************
/**
 * 使用java的springmvc接收数据时。可以使用Qs,使用后，
 * Qs作用：会把Content-Type转成'application/x-www-form-urlencode'，springmvc接收参数如果
 * 使用@RequestBody接收post方式的参数是会报错说无法支持application/x-www-form-urlencode的。
 * 如果不写@RequestBody就没事，但是这样，如果接收的参数为复杂类型，如Student类里维护了一个
 * Teacher类，那么springmvc能帮绑定Student的数据，但是Student中的Teacher就会为null。
 *
 * 这里采用的是axios.interceptors.request拦截器全设Content-Type为'application/json;charset=utf-8'，
 * 这样，每当axios发起post请求时，会自动把Content-Type设为application/json，springmvc接收参数
 * 时@RequestBody写不写都不会报错。如果POST请求时，参数为上面说的Student类型，那么Teacher也能
 * 帮绑定
 */
///////////////////////////////
//axios发送get请求时把参数放params中。发POST请求时放data中，因为post请求参数是放body的
// **************************************【注意】结束*********************************
/*
  axios.defaults.transformRequest = function (data) {
  data = Qs.stringify(data);
  return data;
}; */
// 请求之前拦截
axios.interceptors.request.use(config => {
    // 判断token,有值则在header里面带上
    if (localStorage.Authorization) {
        config.headers.Authorization = localStorage.getItem(sysConfig.accessTokenKey);
    }
    /*if (config.method === 'get') {
        //  给data赋值以绕过if判断
        config.data = true
    }*/
    // config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config
}, error => {
    return Promise.reject(error)
})
// http response 拦截器
axios.interceptors.response.use(
    response => {
        var tempData = response.data;
        if (tempData.token) {
            if (tempData.token.code === 1) {
                // 1、保存后端返回的token
                localStorage.setItem(sysConfig.accessTokenKey, tempData.token.tokenData)
                response.data.token = null
            }
        }
        return response
    },
    err => {
        const code = err.response.status
        /*if (code === 401){
          router.replace('/login')
        }*/
        // oauth/login
        return Promise.reject(err)
    }
);
export default {
    //专用来登陆
    requestLogin(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                transformRequest: [function (data) {
                    // 对 data 进行任意转换处理
                    return Qs.stringify(data)
                }],
                url: url,
                data: params
            }).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
// get请求
    requestGet(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                transformRequest: [function (data) {
                    // 对 data 进行任意转换处理
                    return Qs.stringify(data)
                }],
                url: url,
                params: params
            }).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get请求不带参数
    requestQuickGet(url) {
        return new Promise((resolve, reject) => {
            axios.get(url).then(res => {
                // 成功用resolve回调函数接参
                resolve(res.data)
            }).catch(error => {
                // 失败用reject回调函数接参
                reject(error)
            })
        })
    },
    // post请求
    requestPost(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                /*transformRequest: [function (data) {
                    // 对 data 进行任意转换处理
                    return Qs.stringify(data)
                }],*/
                url: url,
                data: params
            }).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // post请求
    requestPostForm(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(res => {
                resolve(res.data)// 注意res是axios封装的对象，res.data才是服务端返回的信息
            }).catch(error => {
                reject(error)
            })
        })
    },
    // put请求
    requestPut(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.put(url, params).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // patch请求
    requestPatch(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.patch(url, params).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // delete请求
    requestDelete(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.delete(url, params).then(res => {
                resolve(res.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

