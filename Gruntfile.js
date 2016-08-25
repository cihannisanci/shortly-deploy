module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      client: {
        src: [ 'public/client/app.js', 
          'public/client/createLinkView.js', 'public/client/link.js', 
          'public/client/links.js', 'public/client/linksView.js', 
          'public/client/linkView.js', 'public/client/router.js' ],
        dest: 'public/dist/client.js',
      },
      lib: {
        src: [ 'public/lib/backbone.js', 'public/lib/handlebars.js', 
          'public/lib/jquery.js', 'public/lib/underscore.js' ],
        dest: 'public/dist/lib.js',
      }
    },

    mochaTest: {
      test: {
        options: { 
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      target: {
        files: {
          'public/dist/client.min.js': [ 'public/dist/client.js' ],
          'public/dist/lib.min.js': ['public/dist/client.js']
        }
      }
    },

    eslint: {
      // Add list of files to lint here
      target: [
        'public/client/**/*.js',
        'app/**/*.js'
      ]
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
          'app/**/*.js',
        ],
        tasks: [
          'eslint',
          'mochaTest',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },

    exec: {
      cmd: [
        ' cd /Users/student/Desktop/shortly-deploy',
        'git push live master'
      ].join(' && '),
    },


  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'watch' ]);
  });

  // grunt.registerTask('server-git-deploy', function (target) {
  //   grunt.task.run([ 'git_deploy:target' ]);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['eslint',
        'mochaTest',
        'concat',
        'uglify',
        'exec']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function() {
    grunt.option('prod', true);
    grunt.task.run('upload');
  }
    // add your deploy tasks here
  );

};
