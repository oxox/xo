module.exports = {
  options: {
    // the banner is inserted at the top of the output
    banner: '<%= banner%>'
  },
  xo:{
    src:'<%= concat_css.dist.dest %>',
    dest:'dist/css/<%=meta.file%>.min.css'
  },
  yxmall:{
    src:'<%= concat_css.yxmall.dest %>',
    dest:'demo/yxmall/css/yxmall.min.css'
  }
};