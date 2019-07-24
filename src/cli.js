var colors = require('colors');
var fs = require('fs')
var exec = require('child_process').exec;
var ncp = require('ncp').ncp;

var showHelp = (command, desc) => {
    console.log( command.yellow.padEnd(30,'. ') + desc.padEnd(35,' ') )
}


module.exports.cli = (args) => {

    if ( args.length == 2){

        console.log('\n --- Twirl --- \n')
        showHelp('init', 'generates a basic project')
        showHelp('serve', 'runs project with nodemon')

    }

    else {

        if ( args[2] === 'init' ){
            
            var err = err => { if (err) console.log( err ) }

            ncp('./node_modules/twirl-hbs/examples/res', './res', err );
            ncp('./node_modules/twirl-hbs/examples/pages', './pages', err );
            ncp('./node_modules/twirl-hbs/examples/partials', './partials', err );
            ncp('./node_modules/twirl-hbs/examples/helpers.js', './helpers.js', err );
            ncp('./node_modules/twirl-hbs/examples/properties.json', './properties.json', err );

            fs.writeFileSync('main.js', 'var twirl = require(\'twirl-hbs\')( \'twirl.json\'); twirl.compile() ')
            
            fs.writeFileSync('twirl.json', JSON.stringify({
                'html' : 'html',
                'pages': 'pages',
                'res' : 'res',
                'partials' : 'partials',
                'helpers' : 'helpers.js',
                'properties' : 'properties.json'
            }, null, 3))

            console.log("\nTwirl".yellow + " created basic project structure")

        }

        if ( args[2] === 'serve'){

            var nodemon = exec('npx nodemon --watch pages/**/*.* --watch partials/**/*.* --watch helpers.js --watch properties.json main.js');

            nodemon.stdout.on('data', data => { console.log( data.toString() ) });
            nodemon.stderr.on('data', data => { console.log( 'ERR '.red + data.toString() ) });
                    

        }

    }

}