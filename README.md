### Easy bootstrapper for Handlebars

```
	npm install twirl-hbs
	
	// To create project structure
	npx twirl init
	
	// To run project with nodemon
	npx twirl serve
```

## Files

``` npx twirl init ``` will create a few files and directories that twirl uses to generate the final static files. 

### html folder

This is your output directory. The final compiled site is put here. All css, js, html, and res are copied into here to make one unified output directory

### pages folder

Any ```.hbs``` file placed in this directory will be compiled to a ```.html``` file placed directly in the output html folder.  These are the main pages for your site. 

### partials folder

This folder stores the partials for your site. Any ```.hbs``` file found recursively in this directory is saves as a partial with handlebars and made available to be used in the pages folder. Aditionaly, any ```.scss``` or ```.js``` file found with the same name in the same directory as a ```.hbs``` file, with be compiled to the css and js folders in the output directory.

### res folder

This folder is fully coppied into the html output directory. 

### helpers.js

This file is loaded and used to construct handlebars helpers that are made available to pages and partials for use.

### properties.json

This data is passed into each page when compiled with handlebars. Think of it as your global site data.


