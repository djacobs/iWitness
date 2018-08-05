# iWitness

iWitness is a web-based software tool that enables individuals and news 
organizations to explore social media content by time and place. If you know 
when and where something happened, iWitness will show you first-person photos, 
videos and messages from people who were there, integrating diverse media 
types in a unified interface.

iWitness was originally created by [Adaptive Path](http://adaptivepath.com/)
and [EdgeCase](http://edgecase.com) with funding from the [Knight News 
Challenge](http://www.knightfoundation.org/grants/20110148/).
It is free to use and community-driven. You are also free to fork this project 
and deploy it with your own modifications. See the LICENSE file for details.

The application is a pure client-side web application with no backend. It is 
written using the [Ember.js](http://emberjs.com) JavaScript framework, and is 
one of the largest open source Ember applications.

## Browser and service support

The initial release of iWitness only runs in Webkit browsers such as Chrome 
and Safari. Pull requests that expand browser support are welcomed and 
encouraged.

The initial release of iWitness supports two services:

1. Twitter
1. Flickr

In addition, iWitness will pull in media linked from Twitter. The following 
media types and sources are currently supported:

Photos:

1. Twitter
1. Instagram
1. Twitpic
1. Twitgoo
1. Lockerz

Video:

1. YouTube
1. Twitvid
1. Vimeo

## Running it locally

iWitness uses Ruby to run its development server and build process. To develop 
on iWitness, you must have the following on your system:

- Ruby 1.9.x (not tested on Ruby 1.8)
- Bundler
- Rake
- [PhantomJS](http://phantomjs.org/) (for running tests)

Once you've cloned the repository, the following will install all remaining 
dependencies.

```
bundle
git submodule init
git submodule update
```

To run the application, you'll need to specify API keys for Google Maps, 
Flickr, and Google Analytics (optional). `cp config.yml.example config.yml` and 
fill in the blanks in config.yml.

```
bundle exec rackup
```

This will start your development server.  Navigate to [http://localhost:9292]() 
to run the app.

## Deploying to your own server

```
rake compile
```

This will run the build process and place the static assets in /assets. Copy 
these files to your web server.

## Deploying to Github Pages

If you've forked this repository to your own Github account or organization, 
you can easily deploy the app to Github Pages.

```
rake publish
```

This does a few things:

1. creates a git repo in /assets pointing to your own repositories gh-pages 
   branch
1. syncs with the remote gh-pages branch
1. runs the build process and places the static assets in /assets
1. commits and pushes to the gh-pages branch

*note: make sure you've created a remote gh-pages branch first*

If you choose to use a custom CNAME for your Github Pages deployment, you must 
specify the cname option in the config.yml file. This will create the CNAME 
file in the gh-pages branch for you.

## Contributing and reporting bugs

iWitness relies on community contributions to evolve, add new features, and fix 
bugs. We love to receive pull requests for new features or bug fixes. When 
appropriate, please include tests (more info on running tests below).

If you lack the technical expertise to fix a bug yourself, please create an 
issue for it. Be as descriptive in your issue as possible.  Include screenshots 
and links to reproduce the issue. There is no guarantee that your issue will be 
addressed, but it's much more likely if you're clear and thorough in your 
description.

### Running the tests

We have a suite of JavaScript specs written using 
[Jasmine](https://jasmine.github.io/). The specs can be run in two 
ways:

1. with the development server running, navigate to 
   [http://localhost:9292/specs]()
2. run headless with `rake test` (requires [PhantomJS](http://phantomjs.org/))

### Understanding the code

Basic understanding of Ember is necessary to follow most of the JavaScript 
code. Check out the [Ember.js homepage](http://emberjs.com) for an excellent 
overview of the framework.

The build process for the app uses 
[Sprockets](https://github.com/sstephenson/sprockets). The best docs we've 
found for Sprockets is in the [Rails 
Guides](http://guides.rubyonrails.org/asset_pipeline.html) for the Rails Asset 
Pipeline (which is powered by Sprockets).

The application is a combination of HTML, JavaScript, and Less/CSS. The 
directory structure is as follows:

    app/
      controllers/   -> ember controllers
      ext/           -> extensions to plugins or native types
      fonts/         -> fonts used by the stylesheets
      images/        -> images used by stylesheets and markup
      json/          -> static data used by timezone logic
      mixins/        -> custom ember mixins
      models/        -> ember models
      services/      -> wrappers for all external services
      stylesheets/   -> stylesheets written using less
      templates/     -> handlebars templates
      views/         -> ember views
      application.js -> manifest of all JavaScript required by the app
      base.js        -> sets up the ember app
      helpers.js     -> provides custom handlebars helpers
      index.html.erb -> main HTML page
      routes.js      -> handles everything related to URL routing
    doc/             -> random notes captured during development (could use some clean up)
    spec/            -> tests
    vendor/          -> third-party JavaScript and widget libraries

### Extending for new services and media sources


#### Adding a service

Adding a new service requires creating a search object and adding it to the 
application configuration.

Let's way we want to integrate with a service called Banana. The first thing 
we'll do is add 'banana' to the services configuration in app/base.js. This 
tells iWitness to look for a BananaSearch object. This object should be placed 
in app/services/.

The BananaSearch object is expected to have at least the following three 
methods defined: fetch(target), stop(), hasMorePages(). See the FlickrSearch 
class for an example.

#### Adding a Twitter media source

Twitter media sources are determined based on the expanded URL in the tweet 
content. You can see the current media sources defined at the bottom of 
app/services/media.js. Adding a new media source requires defining the 
serviceType, regex, and replacementPattern.

The regex will determine whether the URL in the tweet is a match for this media 
source. A media source will only be used if the URL in the tweet matches the 
regex.

The replacementPattern tells the TwitterLinkedMedia class how to generate a new 
URL from the original URL. The tweet content URL typically points to an HTML 
page for the content rather than the media content itself. We need a direct 
link to the image or video. The replacementPattern uses matching components of 
the original URL to construct a URL that links directly to the media content.

## Getting help

If you'd like to contribute to iWitness and need some assistance, the best way 
is to open an issue or pull request and ask for help. If you are clear and 
direct regarding what you need help with, chances are someone will jump in and 
offer their assistance.

If you require technical support running the app, please remember that this is 
open source. There is no technical support included. Your best bet is to open 
an issue and be patient.

## License

Code is under the GPL v3 license, the full text of which can be found in LICENSE.

Visual assets are under the Creative Commons Attribution-ShareAlike 3.0 
United States License.

[![Creative Commons Attribution-ShareAlike 3.0 United States 
License](http://i.creativecommons.org/l/by-sa/3.0/us/88x31.png)](http://creativecommons.org/licenses/by-sa/3.0/us/)
