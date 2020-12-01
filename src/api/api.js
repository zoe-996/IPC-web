import axios from 'axios'
import x2js from 'x2js'
import { message } from 'ant-design-vue'
var $x2js = new x2js();
message.config({
        top: `45px`,
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
        let lang = localStorage.getItem("lang");
        let str = '<?xml version="1.0" encoding="utf-8"?>';
        str = str + $x2js.js2xml(params);
        axios.post(url, str).then(() => {
                if(isShowMassage){
                        if (lang === '4') {
                                message.success('设置成功!');
                        } else if (lang === '9') {
                                message.success('Set successfully!');  
                        } else if (lang === '25') {
                                message.success('Настройки приняты!');  
                        }
                }
        }).catch(err => {
                if(isShowMassage){
                        if (lang === '4') {
                                message.error('设置失败！');
                        } else if (lang === '9') {
                                message.error('Failed to set!');  
                        } else if (lang === '25') {
                                message.error('Не удалось установить!');  
                        }
                }
                console.log(err.response.status);
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


