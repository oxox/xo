module.exports = {
    options:{
        seperator:';',
        banner:'<%= banner%>'
    },
    dist: {
        src: [
            'demo/yxmall/js/controllers/home.js',
            'demo/yxmall/js/views/home/index.js',
            'demo/yxmall/js/views/home/baby.js',
            'demo/yxmall/js/views/home/daily.js',
            'demo/yxmall/js/views/home/faxian.js',
            'demo/yxmall/js/views/home/guang.js',
            'demo/yxmall/js/views/home/pinpai.js',
            'demo/yxmall/js/controllers/search.js',
            'demo/yxmall/js/views/search/index.js',
            'demo/yxmall/js/views/common/search.js',
            'demo/yxmall/js/plugins/navslide.js',
            'demo/yxmall/js/plugins/swipepager.js'
        ],
        dest: 'demo/yxmall/js/yxmall.debug.js'
    }
};