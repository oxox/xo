module.exports = {
  js_xo:{
    files:['<%=concat.dist.src%>'],
    tasks:['concat','uglify']
  },
  css_xo:{
    files:['<%=concat_css.dist.src%>'],
    tasks:['concat_css','cssmin']
  },
  js_yxmall:{
    files:['<%=yxmall_concat.dist.src%>'],
    tasks:['yxmall_concat','yxmall_uglify']
  },
  css_yxmall:{
    files:['<%=yxmall_concat_css.dist.src%>'],
    tasks:['yxmall_concat','yxmall_cssmin']
  }
};