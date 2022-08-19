import axios from "axios";
// import qs from 'qs'
import router from "@/router/index";
import { Toast } from "vant";

const toLogin = () => {
  router.push({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath,
    },
  });
};

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  responseType: "json",
});

api.interceptors.request.use((request) => {
  // const tokenOutsideStore = useTokenOutsideStore()
  request.headers["PROJECT_TOKEN"] = "2FF6FA72777644D0B69B6CC99FE92B38";
  // 是否将 POST 请求参数进行字符串化处理
  if (request.method === "post") {
    // request.data = qs.stringify(request.data, {
    //     arrayFormat: 'brackets'
    // })
  }
  return request;
});

api.interceptors.response.use(
  (response) => {
    const code = response.data.code;
    switch (code) {
      case 200:
        return Promise.resolve(response.data);
      case 202:
        return Toast.fail("登录失效，请重新登录");
      default:
        return Promise.reject(response.data);
    }
  },
  (error) => {
    let message = error.message;
    // const { data, msg } = error.response.data;
    if (message === "Network Error") {
      message = "后端网络故障";
    } else if (message.includes("timeout")) {
      message = "接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "接口" + message.substr(message.length - 3) + "异常";
    }
    return Promise.reject(error);
  }
);
const request = function ({ url, method, data, params, uploadFile }) {
  const options = {
    url,
    method,
  };

  if (data) {
    options.data = data;
  }

  if (params) {
    options.params = params;
  }

  options.uploadFile = !!uploadFile;

  return api(options);
};

request.get = function (url, params) {
  return request({
    url,
    params,
    method: "get",
  });
};

request.post = function (url, data) {
  return request({
    url,
    data,
    method: "post",
  });
};

request.put = function (url, data) {
  return request({
    url,
    data,
    method: "put",
  });
};

request.patch = function (url, data) {
  return request({
    url,
    data,
    method: "patch",
  });
};

request.delete = function (url, data) {
  return request({
    url,
    data,
    method: "delete",
  });
};

export default request;
