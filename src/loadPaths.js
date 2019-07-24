/* Loads paths in regardless of input type */

var fs = require('fs')
var path = require('path');
var appDir = path.dirname(require.main.filename);

module.exports = path => {

    var pathsObject = pathToJson( path )
    
    verifyJson ( pathsObject )
    generateDirectories( pathsObject )
    loadProperties ( pathsObject )
    
    return pathsObject;    

}

/* Converts the path to a json object if possible */
var pathToJson = path => {

    var t = typeof path;

    /* You allready good */
    if ( t === 'object' ) return path

    /* Load from path */
    if ( t === 'string' ){ 
        var file_path = appDir + '/' + path;

        if ( fs.existsSync( file_path ) )
            return require( file_path )
        
        throw new Error('FileNotFoundError: File ' + path + ' could not be found')
    }

    /* Not a valid type */

    throw new Error('InvalidType: Twirl expected object or string, recieved ' + t)

}

/* Makes sure the object is valid */

var verifyJson = function( path ) {

    var params = [ 'html', 'pages', 'partials', 'properties', 'helpers', 'res' ];

    if ( params.every( item => item in path ) )
        return;
        
    throw new Error('PropertyError: Twirl paths object missing required paramters')

}

var generateDirectories = function( path ){

    if ( ! fs.existsSync( path.html ) )
        fs.mkdirSync ( path.html )

    if ( ! fs.existsSync( path.res ) )
        fs.mkdirSync ( path.res )

    if ( ! fs.existsSync( path.pages ) )
        fs.mkdirSync ( path.pages )
        
    if ( ! fs.existsSync( path.partials ) )
        fs.mkdirSync ( path.partials )

    if ( ! fs.existsSync( path.properties ) )
        fs.writeFileSync( path.properties , '{}')
    
    if ( ! fs.existsSync( path.helpers ) )
        fs.writeFileSync( path.helpers , 'module.exports = { }')

}

/* Load property data in */
var loadProperties = function ( path ){

    path.properties = require( appDir + '/' + path.properties )
}