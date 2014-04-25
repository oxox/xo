module.exports = {
    options: {
        // the banner is inserted at the top of the output
        banner: '<%=banner%>'
    },
    dist: {
        files: {
            'demo/yxmall/js/yxmall.min.js': ['<%= yxmall_concat.dist.dest %>']
        }
    }
};