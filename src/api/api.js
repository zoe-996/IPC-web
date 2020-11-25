import axios from 'axios'
import x2js from 'x2js'
import { message } from 'ant-design-vue'
var $x2js = new x2js();
message.config({
        top: `70px`,
        duration: 3,
        maxCount: 1,
});

export async function get(url) {
        let res = await axios.get(url);
        return res
}

export async function getAPI(url) {
        let res = await axios.get(url);
        let result = $x2js.xml2js(res.data);
        return result
}

export async function post(url, params) {
        let res = await axios.post(url, params);
        return res
}

export function postAPI(url, params, isShowMassage) {
        let str = '<?xml version="1.0" encoding="utf-8"?>';
        str = str + $x2js.js2xml(params);
        axios.post(url, str).then(res => {
                console.log(res);
                if(isShowMassage){
                        message.success('设置成功!');
                }
        }).catch(err => {
                if ( err && err.response ) {
                        switch (err.response.status) {
                                case 400:
                                        err.message = '错误的请求!'
                                        break;
                                case 403:
                                        err.message = '当前用户权限不足!'
                                        break;
                                case 500:
                                        err.message = '服务器端出错!'
                                        break;
                                default:
                                        err.message = '设置失败!'
                        }
                } else {
                        if (JSON.stringify(err).includes('timeout')) {
                                err.message('服务器响应超时')
                        }
                }
                if(isShowMassage){
                        message.error(err.message);
                }
        })
}

export async function postRe(url, params) {
        let str = '<?xml version="1.0" encoding="utf-8"?>';
        str = str + $x2js.js2xml(params);
        let res = await axios.post(url, str);
        let result = $x2js.xml2js(res.data);
        return result
}

export async function uploadFile(url,param,func) {
        const config = {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 300000,
          onUploadProgress: func
        };
        let res = await axios.post(url, param, config);
        return res
}


