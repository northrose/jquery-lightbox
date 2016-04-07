# lightboxLink

## Lightbox link utilities

jQuery plugins that allow elements on the page to set handlers that will open modal lightbox dialogs with dynamic content.

## Usage

1. Include jQuery and jQuery UI:

	```html
	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
	```

2. Include plugin's code:

	```html
	<link rel="stylesheet" href="dist/css/northrose-lightbox.css">
	<script src="dist/js/northrose-lightboxlink.min.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").lightboxLink({
		optionName: "a custom value"
	});
	```

### Options 

TK

## Installation

1. `git clone` this repo
2. `npm install` in the project's root directory

## Demo

### Installation

1. `cd` to `demo` directory
2. `npm install`
 
### Running the demo
 
1. Command line: `npm start` in the `demo` directory
2. `http://localhost:3000` in a browser

## Testing

Run tests (from project root directory) with

```
gulp tests
```

## Contributing

Check [CONTRIBUTING.md](https://github.com/northrose/jquery-lightbox/blob/master/CONTRIBUTING.md) for more information.

## History

Check [Releases](https://github.com/northrose/jquery-lightbox/releases) for detailed changelog.

## License

[MIT License](https://opensource.org/licenses/MIT)
