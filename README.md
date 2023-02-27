# fetch 常用功能封装

内置提供的能力

* timeout 请求超时
* baseURL 默认 URL
* transformRequest 响应数据转换
* transformResponse 响应数据转换
* 请求取消
* 重复请求拦截
* 请求 merge
* 请求 cache

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
        console.log(error.response.data);
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

假设有一个请求还没回来，就发起同一个请求（一次 or 多次）:
    如果前一个请求成功，后续请求会直接用前一个请求的结果。
    如果前一个请求失败，后一个请求继续发起。

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

### 请求 cache

配置，若 cache 传 true，则默认使用 ram 缓存类型，缓存时间 3min。
```javascript
{
    cacheType: 'ram', // ram: 内存，session: sessionStorage，local：localStorage
    cacheTime: 1000 * 60 * 3, // 缓存时间：默认3min
}
```

```javascript

request('/url/cache', null, {
    cache: true
}).then((response) => {
    console.log('process response: ' + response);
})
```

> 原生 fetch cache 的参数改成 fetchCache

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