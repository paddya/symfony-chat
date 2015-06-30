module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bowercopy: {
            options: {
                srcPrefix: 'bower_components',
                destPrefix: 'web/assets'
            },
            scripts: {
                files: {
                    'js/jquery.js': 'jquery/dist/jquery.js',
                    'js/bootstrap.js': 'bootstrap/dist/js/bootstrap.js'
                }
            },
            stylesheets: {
                files: {
                    'css/bootstrap.css': 'bootstrap/dist/css/bootstrap.css'
                }
            }
        },
		concat: {
            options: {
                stripBanners: true
            },
            css: {
                src: [
                    'web/assets/css/bootstrap.css',
                    'web/assets/css/font-awesome.css'
                ],
                dest: 'web/assets/css/bundled.css'
            },
            js : {
                src : [
                    'web/assets/js/jquery.js',
                    'web/assets/js/bootstrap.js',
                    'src/AppBundle/Resources/public/js/*.js'
                ],
                dest: 'web/assets/js/bundled.js'
            }
        },
        cssmin : {
            bootstrap:{
                src: 'web/assets/css/bootstrap.css',
                dest: 'web/assets/css/bootstrap.min.css'
            },
            "font-awesome":{
                src: 'web/assets/css/font-awesome.css',
                dest: 'web/assets/css/font-awesome.min.css'
            }
        },
        uglify : {
            js: {
                files: {
                    'web/assets/js/jquery.min.js': ['web/assets/js/jquery.js'],
                    'web/assets/js/bootstrap.min.js': ['web/assets/js/bootstrap.js']
                }
            }
        },
		watch: {
			assets: {
				files: ['src/AppBundle/Resources/public/**/*.*', 'app/Resources/views/**/*.*'],
				tasks: ['concat', 'cssmin', 'uglify']
			},
			entities: {
				files: 'src/AppBundle/Entity/*.php',
				tasks: ['sf2-doctrine-schema-update']
			}
		},
		'sf2-doctrine-schema-update': {
			dev: {
				args: { force: true }
			}
		},
		browserSync: {
          dev: {
              bsFiles: {
                  src : 'web/assets/**/*.*'
              },
              options: {
                  watchTask: true,
                  proxy: "localhost:8000"
              }
          }
      },
    });

    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-symfony2');
    grunt.registerTask('default', ['bowercopy', 'concat', 'cssmin', 'uglify', 'browserSync', 'watch']);
};