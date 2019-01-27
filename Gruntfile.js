module.exports = function(grunt) {
  grunt.initConfig({
    usemin : {
      html: 'views/**/*.ejs'
    },
    useminPrepare: { 
      options: {
        root: 'public',
        dest: 'public'
      },
      html: 'views/**/*.ejs'
    }, 
    ngAnnotate: {
      scripts: {
        expand: true, 
        src: ['public/js/**/*.js']
      },
    }
  })
  grunt.registerTask('minifica', ['useminPrepare', 'ngAnnotate', 'concat', 
  'uglify', 'cssmin', 'usemin'])
  
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-usemin')
  grunt.loadNpmTasks('grunt-ng-annotate')
}