module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
        file: "xo",
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>\n' +
                '   <%= pkg.homepage %>\n' +
                '   Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
                ' - Licensed <%= _.pluck(pkg.license, "type").join(", ") %> */\n'
    },

    resources: {
        js: [
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
            'src/js/modules/xo.view.mask.js',
            'src/js/modules/xo.view.loader.js',
            'src/js/modules/xo.view.logger.js',
            'src/js/modules/xo.router.js',
            'src/js/modules/xo.animate.js',
            'src/js/modules/xo.app.js'
          ],
        js_yxmall:[
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
        css:[
          'src/css/include/xo.base.css',
          'src/css/include/xo.3dspec.css',
          'src/css/include/xo.loader.css',
          'src/css/include/xo.logger.css',
          'src/css/include/xo.animations.css'
        ],
        css_yxmall:[
          'demo/yxmall/css/gb.css',
          'demo/yxmall/css/act_demo.css',
          'demo/yxmall/css/daily.css'
        ]
    },

    concat: {
      options:{
        seperator:';'
      },
      js:{
          src: ['<%= meta.banner%>', '<%= resources.js%>'],
          dest: 'dist/js/<%= meta.file%>.debug.js'
      },
      js_yxmall:{
          src:['<%= meta.banner%>', '<%= resources.js_yxmall%>'],
          dest:'demo/yxmall/js/yxmall.debug.js'
      }
    },
    concat_css:{
      xo_core:{
        src:['<%= meta.banner%>', '<%= resources.css%>'],
        dest:'dist/css/<%= meta.file%>.debug.css'
      },
      yxmall:{
        src:['<%= meta.banner%>', '<%= resources.css_yxmall%>'],
        dest:'demo/yxmall/css/yxmall.debug.css'
      }
    },
    cssmin:{
      options: {
        // the banner is inserted at the top of the output
        banner: '<%=meta.banner%>'
      },
      xo_core:{
        src:'<%= concat_css.xo_core.dest %>',
        dest:'dist/css/<%=meta.file%>.min.css'
      },
      yxmall:{
        src:'<%= concat_css.yxmall.dest %>',
        dest:'demo/yxmall/css/yxmall.min.css'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '<%=meta.banner%>'
      },
      dist_xo: {
        files: {
          'dist/js/<%=meta.file%>.min.js': ['<%= concat.js.dest %>']
        }
      },
      dist_yxmall: {
        files: {
          'demo/yxmall/js/yxmall.min.js': ['<%= concat.js_yxmall.dest %>']
        }
      }
    },
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'src/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          Zepto: true,
          console: true,
          module: true
        }
      }
    },
    watch: {
      js_xo:{
        files:['<%=resources.js%>'],
        tasks:['concat:js','uglify:dist_xo']
      },
      css_xo:{
        files:['<%=resources.css%>'],
        tasks:['concat_css:xo_core','cssmin:xo_core']
      },
      xo:{
        files:['<%=resources.js%>','<%=resources.css%>'],
        tasks:'xo'
      },
      js_yxmall:{
        files:['<%=resources.js_yxmall%>'],
        tasks:['concat:js_yxmall','uglify:dist_yxmall']
      },
      css_yxmall:{
        files:['<%=resources.css_yxmall%>'],
        tasks:['concat_css:yxmall','cssmin:yxmall']
      }
    }
  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-css');

  // Default task.
  grunt.registerTask('default', ['concat','concat_css',"cssmin", 'uglify']);
  // xo task
  grunt.registerTask('xo',['concat:js','uglify:dist_xo','concat_css:xo_core','cssmin:xo_core']);

};
