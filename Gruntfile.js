'use strict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-jsonlint');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	meta: {
		banner:
		'/* \n'+
		' * <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n'+
		' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n'+
		' * <%= pkg.author %> \n'+
		' * \n'+
		' * Licensed under the <%= pkg.license %> license. \n'+
		' * \n'+
		' * Source: \n'+
		' * <%= pkg.repository.url %> \n'+
		' */\n'
	},
	clean: {
		dist: {
			src: ['dist/*']
		}
	},
	jshint: {
		options: {
			globals: {
				console: true,
				module: true
			},
			"-W099": true,	//ignore tabs and space warning
			"-W044": true,	//ignore regexp
			"-W033": true
		},
		files: ['src/**/.js']
	},
	jsonlint: {
		sample: {
			src: [ 'i18n/*.json' ]
		}
	},	
	copy: {
		fenixmapconfig: {
			nonull: true,
			src: 'src/fenix-ui-map-config.js',
			dest: 'dist/fenix-ui-map-config.js'
		},
		imageslayers: {
			nonull: true,
			expand: true,
			//flatten: true,
			cwd: "src/images/",
			src: '**',
			dest: "dist/images/"
		},
		i18n: {
			nonull: true,
			expand: true,
			cwd: 'src/i18n/',
			src: '*',
			dest: 'dist/i18n/'
		}		
	},
	concat: {
		options: {
			banner: '<%= meta.banner %>',
			separator: ';\n',
			stripBanners: {
				block: true
			}
		},
		lib: {
			src: [
				'lib/jquery.min.js',
				'lib/jquery.i18n.properties-min.js',
				'lib/jquery-ui.custom.min.js',
				'lib/jquery.hoverIntent.js',
				'lib/leaflet.js',
				'lib/leaflet.markercluster.js',
				'lib/json2.js',
				'lib/csvjson.min.1.0.js'
			],
			dest: 'dist/fenix-ui-map-lib.js'
		},
		fenixmap: {
			src: [
				'src/FENIXMap.js',
				'src/core/Class.js',
				'src/core/Util.js',
				'src/core/hashmap.js',
				'src/core/RequestHandler.js',
				'src/core/UIUtils.js',
				'src/core/WMSUtils.js',
				'src/core/fullscreen.js',
				'src/map/config/DEPENDENCIES.js',
				'src/map/constants/*.js',
				'src/map/Map.js',
				'src/map/utils/LayerLegend.js',
				'src/map/controller/MapControllerDraggable.js',
				'src/map/utils/*.js ',
				'src/map/layer/*.js',
				'src/map/gui/*.js',
				'src/plugins/FMPopUp.js'
			],
			dest: 'dist/fenix-ui-map.src.js'
		}
	},
	uglify: {
		options: {
			banner: '<%= meta.banner %>'
		},
		fenixmap: {
			files: {
				'dist/fenix-ui-map.min.js': ['<%= concat.fenixmap.dest %>']
			}
		}
	},
	cssmin: {
		options: {
			banner: '<%= meta.banner %>'
		},
		combine: {
			src: [
				'src/css/fenix-ui-leaflet.css',
				'src/css/fenix-ui-map.css'				
			],
			dest: 'dist/fenix-ui-map.min.css'
		},
		minify: {
			expand: true,
			cwd: 'dist/',
			src: '<%= cssmin.combine.dest %>'
		}
	},
	watch: {
		dist: {
			options: { livereload: true },
			files: ['src/*'],
			tasks: ['clean','concat','cssmin','jshint']
		}		
	}
});

grunt.registerTask('default', [
	//'jshint',
	'clean',
	'concat:fenixmap',
	'uglify',	
	'cssmin',
	'jsonlint',	
	'copy'
]);

};