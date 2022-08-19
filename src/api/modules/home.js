import request from "@/api";

export const homeService = {
  recommend: (params) => {
    return request.post("home/attention/recommend", params);
  },
  latest: (params) => {
    return request.post("home/latest", params);
  },
  text: (params) => {
    return request.post("home/text", params);
  },
  pic: (params) => {
    return request.post("home/pic", params);
  },
};
