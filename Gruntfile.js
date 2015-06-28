module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			js: {
				src: ['src/core.js', 'src/*.js', 'src/*/*.js'],
				dest: 'build/<%= pkg.name %>.js'
			},
			css: {
				src: ['src/*.css', 'src/*/*.css'],
				dest: 'build/<%= pkg.name %>.css'
			}
		},
		uglify: {
		  options: {
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		  },
		  build: {
			src: 'build/<%= pkg.name %>.js',
			dest: 'build/<%= pkg.name %>.min.js'
		  }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat:js', 'concat:css', 'uglify']);
};