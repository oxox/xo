module.exports = {
    first: ['newer:concat','newer:concat_css','copy'],
    second: ['newer:uglify','newer:cssmin', 'newer:imagemin'],
    three:['watch']
};
