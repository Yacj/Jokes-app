export const getImgSize = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
  });
};
