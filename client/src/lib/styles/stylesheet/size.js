const size = (width, height) => {
  if (height === undefined) {
    return `width:${width}; height:${width};`;
  }

  return `width:${width}; height:${height};`;
};

export default size;
