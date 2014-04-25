module.exports = {
    dist: {
        src: [
            'src/css/include/xo.base.css',
            'src/css/include/xo.3dspec.css',
            'src/css/include/xo.loader.css',
            'src/css/include/xo.logger.css',
            'src/css/include/xo.animations.css'
        ],
        dest: 'dist/css/<%= file%>.debug.css'
    }
};