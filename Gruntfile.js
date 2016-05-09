module.exports = function(grunt) {
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,
        shell: {

        },

        sass: {
            options: {
                outputStyle: 'nested',
                imagePath: 'assets/images',
                precision: 5,
                includePaths: [
                    'components'
                ]
            },
            dev: {
                files: {
                    'public/css/base.css': 'assets/sass/base.scss',
                }
            }
        },

        pixrem: {
            dist: {
                options: {
                    replace: false
                },
                src: 'public/css/base.css',
                dest: 'public/css/base.css'
            }
        },

        uglify: {
            dev: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: false
                },
                files: {
                    'public/js/script.min.js': [
                        // Include:
                        'components/jquery/dist/jquery.js',
                        'assets/js/modules/*.js',
                        'assets/js/script.js'
                    ],
                    'public/js/modernizr.min.js': 'assets/js/modernizr.min.js'
                }
            }
        },

        imagemin: { // Task
            dynamic: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'assets/images/', // cwd is 'current working directory' - Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'public/images/' // Destination path prefix
                }]
            }
        },

        copyFiles: '**/*.{eot,svg,ttf,woff,pdf}',
        copy: {
            target: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'assets/',
                        src: ['<%= copyFiles %>'],
                        dest: 'public/',
                        filter: 'isFile'
                    }
                ]
            }

        },

        // Will Automatically insert the correct prefixes for CSS properties. Just write plain CSS.
        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 9']
            },
            prod: {
                src: 'public/**/*.css'
            },
            dev: {
                src: 'public/**/*.css'
            },
        },

        // Watch options: what tasks to run when changes to files are saved
        watch: {
            options: {},
            css: {
                files: ['assets/sass/**/*.scss'],
                tasks: ['css'] // Compile with Compass when Sass changes are saved
            },
            js: {
                files: ['assets/js/**/*.js'], // Watch for changes in JS files
                tasks: ['javascript']
            },
            // html: {
            //   options: {
            //       spawn: false
            //   }
            // },
            images: {
                files: ['assets/**/*.{png,jpg,gif}'],
                tasks: ['images']
            },
            copy: {
                files: ['assets/<%= copyFiles %>'],
                tasks: ['copy']
            }
        }
    });

    /**
     * CSS tasks
     */
    grunt.registerTask('css', [
        'sass',
        'autoprefixer:dev',
        'pixrem'
    ]);

    /**
     * JavaScript tasks
     */
    grunt.registerTask('javascript', [
        'uglify:dev'
    ]);

    /**
     * Images tasks
     */
    grunt.registerTask('images', [
        'imagemin'
    ]);

    /**
     * Dev task
     */
    grunt.registerTask('dev', [
        'css',
        'javascript',
        'images',
        'copy'
    ]);

    /**
     * Default Tasks
     */
    grunt.registerTask('default', ['dev', 'watch']);


};
