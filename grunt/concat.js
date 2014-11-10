module.exports = {
    options:{
        seperator:';',
        banner:'<%= banner%>'
    },
    dist: {
        src: [
            'src/js/libs/fastclick.js',
            'src/js/xo.js',
            'src/js/base/util.js',
            'src/js/base/event.js',
            'src/js/base/history.js',
            'src/js/base/router.js',
            'src/js/base/view.js',
            'src/js/modules/xo.raf.js',
            'src/js/modules/xo.constants.js',
            'src/js/modules/xo.media.js',
            'src/js/modules/xo.support.js',
            'src/js/modules/xo.event.js',
            'src/js/modules/xo.plugin.js',
            'src/js/modules/xo.controller.js',
            'src/js/modules/xo.view.js',
            'src/js/modules/xo.viewManager.js',
            'src/js/modules/xo.view.mask.js',
            'src/js/modules/xo.view.loader.js',
            'src/js/modules/xo.view.logger.js',
            'src/js/modules/xo.router.js',
            'src/js/modules/xo.animate.js',
            'src/js/modules/xo.app.js'
        ],
        dest: 'dist/js/<%= file%>.debug.js'
    }
};
