# fetch 常用功能封装

内置提供的能力

* timeout 请求超时
* baseURL 默认 URL
* requestInterceptors 请求拦截器
* responseInterceptors 响应拦截器
* transformData 响应数据转换(注意需要兼容各种数据类型)
* 请求取消
* 重复请求拦截
* 请求 merge
* 请求 cacheData

> 目前触发了超时依旧会忘后端发送请求不会自动进行 abort

## 配置

```js
{
    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: '',
    timeout: 10000, // 默认 10s
    method: 'POST', // 默认 post
    mergeRequest: false, // 是否合并请求
    responseType: null, // 可选 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'，默认根据 content-type 处理
    credentials:  'include', // 默认 include, 'include' | 'same-origin' | 'omit'
    headers: {}, // 传给服务器的 header
    cacheData: false, // 是否缓存
    requestInterceptors: [],
    responseInterceptors: [],
    transformData: (data) => {
        if (isPlainObject(data)) {
            return data
        }
        return data
    },
    errorHandler: (err) => {
        console.log(err);
    }
}
```


## 用法

```javascript

const request = createRequest({
    timeout: 10000,
    baseURL: 'http://localhost'
});
```

## 错误处理


```javascript
function  errorHandler(error) {
    // request 内部逻辑异常 | transform 抛出的异常 | 超时异常
    if (error.msg) {
        console.log(msg);
    } else if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.status);
        console.log(error.response.headers);
    } else {
        // 未知异常
        console.error(error)
    }
    console.log(error.config);
}
```

## 一些常用场景 demo

### 请求 merge

假设有一个请求还没回来，就发起同一个请求（一次 or 多次）, 后续请求会直接延用前一个请求的结果，不管成功还是失败。

```javascript
let response1;
request('/url/merge', null, {
    mergeRequest: true
}).then((response) => {
    response1 = response;
    console.log('process response: ' + response);
})
request('/url/merge', null, {
    mergeRequest: true
}).then((response) => {
    // 'is pre response: true
    console.log('is pre response: ', response1 === response);
})
```

### 请求 cacheData

配置，若 cacheData 传 true，则默认使用 ram 缓存类型，缓存时间 3min
```javascript
{
    cacheType: 'ram', // ram: 内存，session: sessionStorage，local：localStorage
    cacheTime: 1000 * 60 * 3, // 缓存时间：默认3min
}
```

```javascript

request('/url/cache', null, {
    cacheData: true
}).then((response) => {
    console.log('process response: ' + response);
})
```

### 请求 abort

```javascript
const controller = new AbortController();
request('/url/abort', null, {
    signal: controller.signal
}).then((response) => {
    console.log('process response: ' + response);
})
// cancel the request
controller.abort()
```

## 后续计划

1. 支持配置中间件
