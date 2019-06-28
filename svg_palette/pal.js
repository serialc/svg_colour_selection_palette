/*
 SVG Palette
 by Cyrille Médard de Chardon 2010
*/


var PL = {};

//find the x,y location of the object
PL.findObj = function(domobject) {
	var curleft = 0;
	var curtop = 0;

	if (domobject.offsetParent) {
		while (domobject.offsetParent) {
			curleft += domobject.offsetLeft;
			curtop += domobject.offsetTop;
			domobject = domobject.offsetParent;
		}
		return [curleft,curtop];
	}
};

PL.//converts object containing three 0-255 values and returns a six digit hex value
prepColours = function(colour) {
	colour.R = parseInt(colour.R,10).toString(16);
	colour.G = parseInt(colour.G,10).toString(16);
	colour.B = parseInt(colour.B,10).toString(16);
	
	for( clr in colour ) {
		//if it is '0' --> '00'
		if(colour[clr] === '0' ) {
			colour[clr] = '00';
		} else if(colour[clr].length === 1) {
			//the value is not '0' but only has 1 digit, append a zero
			colour[clr] = '0' + colour[clr];
		}
	}

	//create 6 value hex colour code
	return colour.R + '' + colour.G + '' + colour.B;
};

//calculates a colour value based on mouse location relative to known location of colour palette
PL.getLocationRGB = function(x, y) {
	var hex_colour = '';
	var sec_size = 200/6;
	var sec_colour = parseInt(y/sec_size,10);

	//hold a 0 to 255 value
	var w_val = 0;
	var b_val = 0;
	var c_val = {};

	var colour = {
		R: 0,
		G: 0,
		B: 0
	};
	
	//clicked on main palette
	if(x < 201) {
		//determine black / white of colour
		if(x > 100) {
			// 100 < x < 201
			b_val = parseInt((x-100)*255/100,10);
		} else {
			// x < 101
			w_val = parseInt((100-x)*255/100,10);
		}
		
		//based on section get y, convert to 0-255 range value
		hue = (y-(sec_size*sec_colour))*255/sec_size;

		c_val.c_none = 0+w_val;
		c_val.c_vary_inc = (hue)+(w_val*(1 - hue/255))-(b_val*(hue/255));
		c_val.c_vary_dec = (255-hue)+(w_val*(hue/255))-(b_val*(1 - hue/255));
		c_val.c_full = 255-b_val;

		switch(sec_colour) {
			case 0:
				//red to yellow, section 1
				// full red, increasing green, no blue
				//determine R G B colour values and create hex 6 value string
				colour.R = c_val.c_full;
				colour.G = c_val.c_vary_inc;
				colour.B = c_val.c_none;
			break;
			case 1:
				//yellow to green, section 2
				//decreasing red, full green, no blue
				colour.R = c_val.c_vary_dec;
				colour.G = c_val.c_full;
				colour.B = c_val.c_none;
			break;
			case 2:
				//green to teal, section 3
				//no red, full green, increasing blue
				colour.R = c_val.c_none;
				colour.G = c_val.c_full;
				colour.B = c_val.c_vary_inc;
			break;
			case 3:
				//teal to blue, section 4
				//no red, decreasing green, full blue
				colour.R = c_val.c_none;
				colour.G = c_val.c_vary_dec;
				colour.B = c_val.c_full;
			break;
			case 4:
				//blue to fucia, section 5
				//increasing red, no green, full blue
				colour.R = c_val.c_vary_inc;
				colour.G = c_val.c_none;
				colour.B = c_val.c_full;
			break;
			case 5:
				//fucia to red, section 6
				//full red, no green, decreasing blue
				colour.R = c_val.c_full;
				colour.G = c_val.c_none;
				colour.B = c_val.c_vary_dec;
			break;
		}

		//assemble colour 0-255 values to hex colour code
		hex_colour = PL.prepColours(colour);

	} else {	//clicked on greyscale palette
		//x is 201 to 220
		hex_colour = parseInt(y*255/200,10).toString(16);
		if(hex_colour.length === 1) {
			hex_colour = '0' + hex_colour;
		}
		//format nicely
		hex_colour = hex_colour + '' + hex_colour + '' + hex_colour;
	}
	return hex_colour;
};

//on icon click show palette and prepare to receive colour click selection
PL.openPl = function(func2call, active_change) {

	//show the paletee div
	var palpkg = document.getElementById('svgpal');
	palpkg.style.display = 'inherit';

	//find the coordinates of the palette Package
	var pal_offset = PL.findObj(palpkg);

	//get svg palette for event handling
	var svgpal = document.getElementById('svgpal');

	//on click get location of click on palette, convert to hex colour, update input field, close palette
	if(svgpal.addEventListener) {
		svgpal.addEventListener("mousemove", paletteMM = function(evt) {

			// determine relative mouse location
			var slvd_x = evt.clientX - pal_offset[0] + window.pageXOffset;
			var slvd_y = evt.clientY - pal_offset[1] + window.pageYOffset;

			// determine colour based on click location
			var hex_colour = PL.getLocationRGB(slvd_x, slvd_y);

			// return colour selected
            if( active_change ) {
                func2call(hex_colour);
            }

		}, false);
        svgpal.addEventListener("click", paletteClick = function(evt) {
            // remove event listeners
			svgpal.removeEventListener("click", paletteClick, false);
			svgpal.removeEventListener("mousemove", paletteMM, false);

			// hide the colour palette
			palpkg.style.display = 'none';

			// determine relative mouse location
			var slvd_x = evt.clientX - pal_offset[0] + window.pageXOffset;
			var slvd_y = evt.clientY - pal_offset[1] + window.pageYOffset;

			// determine colour based on click location
			var hex_colour = PL.getLocationRGB(slvd_x, slvd_y);

			// return colour selected
			func2call(hex_colour);
        }, false);
	}
};
