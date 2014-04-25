module.exports = {
    options: {
        // the banner is inserted at the top of the output
        banner: '<%=banner%>'
    },
    dist: {
        files: {
            'dist/js/<%=file%>.min.js': ['<%= concat.dist.dest %>']
        }
    }
};