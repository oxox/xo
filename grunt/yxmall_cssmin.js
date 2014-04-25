module.exports = {
  options: {
    // the banner is inserted at the top of the output
    banner: '<%= banner%>'
  },
  main:{
    src:'<%= yxmall_concat_css.dist.dest %>',
    dest:'demo/yxmall/css/yxmall.min.css'
  }
};