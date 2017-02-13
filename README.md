# mapapps-map-slides

Support for reveal js silde apps inside map.apps.

## Slides as app.

Create an new app via map.apps Manager.
Use the manual configuration to add `slides.html` and other sources.

## Configuration

Sample app.json:

```json
{
	"load": {
		"allowedBundles": [
			"system",
			"map-slides"
		]
	},
	"bundles": {
		"map-slides": {
			"Config": {
                            "theme": "moon",
                            "dependencies" : ["markdown", "highlight", "zoom"]
			}
		}
	}
}
```


# Limitations

* Currently only the plugins "markdown", "highlight", "zoom" are supported.
* Slides can only be defined inside map.apps applications.