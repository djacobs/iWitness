# Stuff we learn about Ember.js

## cacheable

We encountered an issue when iterating over a computed property that
returned an array. The symptom was chrome hanging and needed to be
force quit. The solution was to make the computed property cacheable.

### references

[https://github.com/emberjs/ember.js/issues/38]()

[https://github.com/emberjs/ember.js/issues/463]()

> It's generally a bad idea to return an object from an uncached computed property.

From the source code documentation:

> Call on a computed property to set it into cacheable mode.  When in this
> mode the computed property will automatically cache the return value of 
> your function until one of the dependent keys changes.

We assumed this was the default behavior of computed properties.
We are still not sure why cacheable is not the default or what the
default behavior actually is.

