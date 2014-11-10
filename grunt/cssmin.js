module.exports = {
  options: {
    // the banner is inserted at the top of the output
    banner: '<%= banner%>'
  },
  xo:{
    src:'<%= concat_css.dist.dest %>',
    dest:'dist/css/<%=file%>.min.css'
  }
};
