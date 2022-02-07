---
layout: post
title: Speeding up your UI5 app with a Component preload file
tags:
- grunt
- openui5
- performance
- preload
---

**[30 Days of UI5](/2015/07/04/30-days-of-ui5/) &mdash; Day 14 by [John Murray](http://jmurray.me/)**

In this post we’ll be looking at how you can speed up the load times of your UI5 applications by using a Component preload file. Those of you who are familiar with SAP Fiori applications will probably already know what a Component preload file is, however those of you who aren’t will almost definitely have all seen a reference to this file before. This file is referenced in an error message that appears in the console whenever you load a UI5 app, which is lacking a Component preload file.

![Chrome preload error]( {{ "/img/2018/02/Screen-Shot-2015-07-14-at-20.54.47-624x31.png" | url }})

**So just what is this preload file and why should I care?**

The preload file is essentially all of the files which make up your application, so that’s the Component itself, Controllers, Views, Fragments and so on, all compressed and inserted into one file, the preload file. If this file exists then UI5 will only load that file, and it won’t load of all of the other various files which it ordinarily would have done. The error we saw earlier is caused because UI5 looks for a preload file early in the execution flow, but of course did not find one, and so carried on loading all of the files individually.

Now that we’ve cleared up what the file actually is, and why that error appears, just why should exactly should we worry about it? After all we’ve ignored that error up until now and all our apps have worked just fine. Well, the reason we should care is that it dramatically decreases page load time. This is due to the app only having to make one call to get the preload file, rather than all of the individual calls for each file, but also because in the preload file the code is “minified”, which means the file size is also very small relative to the full size individual files. This is especially important when developing UI5 applications which are to be used over a mobile data connection, where size has a very large impact on initial load performance. As an anecdotal example, on the simple UI5 app which I have just created a preload file for my initial load time went from 8-9 seconds down to 3-4 seconds, which is tremendous improvement!

**Sounds great! So how can I make a preload file for my UI5 app?**

For this next section you will need to have installed on your machine [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/) and [Grunt](http://gruntjs.com/). If you don’t know how to install and use these things then do [reach out to me on Twitter](http://twitter.com/johnbmurray).

After you have all of the above installed, you’ll need to create a `package.json` file in your UI5 app’s root directory. Open the file up and paste in the contents below and don’t forget to edit them accordingly:

```javascript
{
  "name": "barcode-test",
  "version": "0.0.1",
  "description": "",
  "main": "index.html",
  "author": "John Murray",
  "license": "Apache License, Version 2.0",
  "devDependencies": {
    "grunt": "^0.4.5"
  }
}
```

After creating and saving this file, install the [Grunt OpenUI5 tools](https://github.com/SAP/grunt-openui5) which are made by the UI5 team at SAP. To install these tools open a terminal session in your UI5 root directory and run this command ‘npm install grunt-openui5 –save-dev’. This will download and install the tools, and also add them to the “devDependencies” section of your ‘package.json’ file.

Next, again in the UI5 app root directory, create a file called ‘Gruntfile.js’. Into this file copy and paste the contents below, and we’ll go through what it all means in a moment.

```javascript
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    openui5_preload: {
      component: {
        options: {
          resources: {
            cwd: '',
            prefix: '',
            src: [
              'webapp/**/*.js',
              'webapp/**/*.fragment.html',
              'webapp/**/*.fragment.json',
              'webapp/**/*.fragment.xml',
              'webapp/**/*.view.html',
              'webapp/**/*.view.json',
              'webapp/**/*.view.xml',
              'webapp/**/*.properties'
            ]
          },
          dest: '',
          compress: true
        },
        components: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-openui5');

}
```

This is quite a simple example but it will suffice in most use cases. What we are doing here first of all is reading in the ‘package.json’ file created earlier which provides the dependency list. Then we are setting the configuration options for ‘openui5_preload’ which is the specific tool we are going to be using from the OpenUI5 toolset.

- The ‘cwd’ parameter allows you to provide a base directory for finding the files and the ‘prefix’ parameter lets you prefix all files with a path of your choosing; in this instance we are not using either of these parameters so we are leaving them blank.
- The ‘src’ parameter lets you provide an array of paths, which it will use to try and match files in your directory and then for those matches it will minify and add them to the preload. I have all of my UI5 application files within a subdirectory called ‘webapp’ which is why my paths all begin with ‘webapp’. I have all my UI5 files located in this directory because I can then keep all of my other files and folders such as ‘node_modules’, PhoneGap config files, IDE folders, etc back in the root directory. I do this because it allows me to use this simple “get everything” approach you see above in the ‘src’ without worrying about accidentally including non-UI5 app files.
- The ‘dest’ parameter specifies the path to the destination you wish to save the preload file. In this case we just want to save it in the same place as the `Component.js` file and therefore can leave it blank.
- The ‘compress’ parameter sets whether or not you wish to minify the files as well as add them to the preload file. I would personally recommend always setting this to ‘true’ unless you have a good reason not to.
- The ‘components’ parameter here with a value of ‘true’ sets the tool to automatically find all components and create a preload for each.

Finally, we load the ‘grunt-openui5′ toolkit from the plugin as previously installed and specified in ‘package.json’.

*For the full documentation and parameter list I’d recommend looking at the [Grunt OpenUI5 tools](https://github.com/SAP/grunt-openui5) GitHub page.*

That’s all the configuration set up, now it’s time to generate our preload file! Fire up a terminal session in the same directory as your ‘Gruntfile.js’ and run the following command ‘grunt openui5_preload’ and you should see the following output along with a ‘Component-preload.js’ file alongside your ‘Component.js’ file.

![preload generation output]( {{ "/img/2018/02/Screen-Shot-2015-07-15-at-00.48.10-624x88.png" | url }})

**Final thoughts**

Congratulations, you’ve just made your first preload file and are now well on the way to creating even better apps with UI5!


