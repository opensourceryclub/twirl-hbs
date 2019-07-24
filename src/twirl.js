/* Twirl is a wrapper for handlebars that makes building and compiling easier */

var pathLoader = require('./loadPaths')
var siteGenerator = require('./siteGenerator')

var fs = require('fs')
var handlebars = require('handlebars');


/* Exported Class */

module.exports = function( paths ) {

    /* Will throw error if paths are not valid */
    this.paths = pathLoader( paths )


    /* Compilation Steps */

    this.clean = () => 
        siteGenerator.clean( this.paths.html );
    
    this.compileSass = () => 
        siteGenerator.compileSass( this.paths.partials, this.paths.html )

    this.compileJs = () => 
        siteGenerator.compileJs( this.paths.partials, this.paths.html )

    this.registerHelpers = () => 
        siteGenerator.registerHelpers( handlebars, this.paths.helpers );

    this.registerPartials = () => 
        siteGenerator.registerPartials( handlebars, this.paths.partials );

    this.generatePages = () => 
        siteGenerator.generatePages( handlebars, this.paths.pages, 
            this.paths.properties, this.paths.html )

    this.moveRes = ( callback ) => 
        siteGenerator.moveResFolder ( this.paths.res, this.paths.html, callback )


    /* Output functions */

    this.compile = () => {

        /* delete and remake html file */
        console.log('cleaning old files. . . ')
        this.clean()

        /* put css and js in output dir */
        console.log('compiling sass & js. . . ')
        this.compileJs()
        this.compileSass()

        /* setup handlebars */
        console.log('rendering with handlebars. . . ')
        this.registerHelpers()
        this.registerPartials()
        this.generatePages()

        /* Copy over res file, this is async, so we need callback */
        console.log('moving res file. . .')
        this.moveRes( () => console.log('Done. ') )

    }

    return this;

}