
var fs = require('fs-extra')
var sass = require('node-sass')
var ncp = require('ncp').ncp;

var path = require('path');
var appDir = path.dirname(require.main.filename);

/* Helpers */

var pathInfo = (file, dir) => {

    var segments = file.split('.');

    return {
        'name' : segments[0],
        'ext' : segments[1],
        'namePath' : dir + '/' + segments[0],
        'path' : dir + '/' + file,
        'dir' : fs.lstatSync(dir + '/' + file).isDirectory() 
    }
}


/* Removes all the generated files from the output directory */

module.exports.clean = html => {

    fs.removeSync( html );
    fs.mkdir( html )

}


module.exports.compileSass = ( partials, html ) => {

    var files = fs.readdirSync( partials )

    if (! fs.existsSync( html + '/css' ) )
        fs.mkdirSync( html + "/css" )

    files.forEach( file => {
        
        var fileInfo  = pathInfo( file, partials )
        
        if ( fileInfo.ext == 'scss' ){

            var content = fs.readFileSync( fileInfo.path, 'utf8' )

            if ( content == '' ) {
                console.log('WARN'.yellow, fileInfo.path, 'was empty, skipping')
                return;
            }
            

            var compiled = sass.renderSync( { data : content } ).css

            var output = html + '/css/' + fileInfo.name + '.css'
            
            fs.writeFileSync( output, compiled)
            
        }

        if ( fileInfo.dir)
            this.compileSass( fileInfo.path, html )

    })

}

module.exports.compileJs = ( partials, html ) => {

    /* Where a TS converter would be put */
    
    var files = fs.readdirSync( partials )

    if (! fs.existsSync( html + '/js' ) )
        fs.mkdirSync( html + "/js" )
    
    files.forEach( file => {
        
        var fileInfo  = pathInfo( file, partials )
        
        if ( fileInfo.ext == 'js' ){

            var content = fs.readFileSync( fileInfo.path, 'utf8' )
            var output = html + '/js/' + fileInfo.name + '.js'
            
            fs.writeFileSync( output, content)
            
        }

        if ( fileInfo.dir)
            this.compileJs( fileInfo.path, html )

    })


}

module.exports.registerHelpers = (handlebars, helpers ) => {

    helpers = require( appDir + '/' + helpers )
    
    for ( var identifier in helpers )
        handlebars.registerHelper( identifier, helpers[identifier] )

}

module.exports.registerPartials = (handlebars, partials ) => {

    var files = fs.readdirSync( partials )
    
    files.forEach( file => {
    
        var fileInfo  = pathInfo( file, partials )

        /* Handlebars tempalte */

        if ( fileInfo.ext == 'hbs' ){

            var template = fs.readFileSync( fileInfo.path, 'utf8');

            /* Add comment to mark template */
            template  = "<!-- " + fileInfo.name + " template --> \n" + template;

            /* Add style import if style is found */
            if ( fs.existsSync( fileInfo.namePath + '.scss' ) )
                template += " \n<link rel='stylesheet' type='text/css' href='css/" + fileInfo.name + ".css'> "
        
            /* Add js import if it is found */
            if ( fs.existsSync( fileInfo.namePath + '.js' ) )
                template += " \n<script src = 'js/" + fileInfo.name + ".js'> </script> "; 

            template += '\n\n';

            handlebars.registerPartial(fileInfo.name, template);
        }

        /* Rescursiveley look for more partials */
        if ( fileInfo.dir ) 
            this.registerPartials( handlebars, fileInfo.path )
        
    });

}

module.exports.generatePages = ( handlebars, pages, data, html ) => {

    var files = fs.readdirSync( pages )
    
    files.forEach( file => {
    
        var fileInfo  = pathInfo( file, pages )

        if ( fileInfo.ext == 'hbs' ){
            
            var content = fs.readFileSync( fileInfo.path , 'utf-8');
            var template = handlebars.compile(content);
        
            /* Add comment to designate page */
            var renderedData = '<!-- ' + fileInfo.name + ' page, made with twirl --> \n' + template(data);

            fs.writeFileSync( html + '/' + fileInfo.name + ".html", renderedData );
            
        }

        if ( fileInfo.dir )
            this.generatePages( handlebars, fileInfo.path, data, html )
            
    })

}


module.exports.moveResFolder = ( source, destination, done ) => {

    if (! fs.existsSync( destination + '/res' ) )
        fs.mkdirSync( destination + "/res" )

    ncp(source, destination + '/res', err => {
        if ( err )
            console.log( err )
        done()
    });

}