'use strict';

module.exports = function (grunt) {

	grunt.initConfig({
		pkg: {
			name: 'grunt-pixrem'
		},

    pixrem: {
      defaults: {
        src: 'test/css/one.css',
        dest: 'test/result/defaults.css'
      },
      rootvalue: {
        options: {
          rootvalue: '1.75em'
        },
        src: 'test/css/one.css',
        dest: 'test/result/rootvalue.css'
      },
      replace: {
        options: {
          replace: true
        },
        src: 'test/css/one.css',
        dest: 'test/result/replace.css'
      },
      concat: {
        src: [
          'test/css/one.css',
          'test/css/two.css'
        ],
        dest: 'test/result/concat.css'
      }
    }
	});

	grunt.loadTasks('tasks');

	grunt.registerTask('test', [
    'pixrem'
	]);

	grunt.registerTask('default', 'test');
};
