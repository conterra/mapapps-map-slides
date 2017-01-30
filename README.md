# ct-reveal-js

Support for reveal js silde apps inside map.apps.


## Slides as bundle

In your manifest.json add the flag `reveal-js-slides`.

```json
{
   "reveal-js-slides": true
}
```

This marks the bundle as reveal js slide source. Now the reveal-js-init bundle tries to load `slides.html` from the bundle.

See `src/main/js/slides` as a sample.


## Slides as app.

Create an app e.g. `http://vsdev1476.esri-de.com:8081/mapapps-4.0.1-SNAPSHOT/resources/apps/reveal-js-test` use the manual configuration to add `slides.html` and other sources.

## Configuration

Sample app.json:

```json
{
	"load": {
		"allowedBundles": [
			"system",
			"reveal-js-init"			
		]
	},
	"bundles": {
		"reveal-js-init": {
                        
                        // config object of reveal js
			"Config": {                            
                            "theme": "moon",
                            
                            // supported plugins:
                            "dependencies" : ["markdown", "highlight", "zoom"]
			}
		}
	}
}
```
