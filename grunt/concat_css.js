module.exports = {
    dist: {
        src: [
            'src/css/ratchet.css',
            'src/css/yue.css',
            'src/css/include/xo.ratchet.css',
            'src/css/include/xo.base.css',
            'src/css/include/xo.typo.css',
            'src/css/include/xo.hint.css',
            'src/css/include/xo.3dspec.css',
            'src/css/include/xo.loader.css',
            'src/css/include/xo.logger.css',
            'src/css/include/xo.animations.css'
        ],
        dest: 'dist/css/<%= file%>.debug.css'
    }
};
