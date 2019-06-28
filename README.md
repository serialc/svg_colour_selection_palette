# svg_colour_selection_palette
A simple colour selection tool that uses SVG.

See the [example demo](https://serialc.github.io/svg_colour_selection_palette/example.html)

## How to embed
See example.html.

### Header
Add the JS and CSS.

### Open/display the palette
Add the icon, or button, to use to open the SVG palette. You must also indicate what function to call with the retrieved value.

### Active return
The second parameter of PL.openPl(function, active_mode) determines whether the colour is sent back when mousing over the palette (true) or just when clicked upon (false).

### Add the palette
The palette will be hidden initially (CSS). Decide where and how you would like to display the SVG palette.
