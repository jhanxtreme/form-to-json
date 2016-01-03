/**
Author: Jhan Mateo
Date Started: 7/29/2015
Date Ended: 7/30/2015
Description: Using native javascript (no js framework), this application will serializes from form data to Json format.
The MIT License (MIT)

Copyright (c) 2015 Jhan Mateo

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software 
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.
**/

'use strict';

function formToJson (form, sett) {
  
    var defaults = {
        returnData: false, // return the data at the end
        printDataIn: '#json_result', // selector where json should be printed
        minValueLength: 1 // select only inputs with at least x characters
    }
    
    var settings = Object.assign(defaults, sett);

	if ('form' !== form.nodeName.toLowerCase() && 1 !== form.nodeType) {
		console.log('Form error');
		return false;
	}

	var jsonData = {};
    var newArrObj;
    var index;
    var key;
    var inputName;
    var newObj;

	for (var i = 0; i < form.length; i++) {

		if (
          form[i].type !== 'submit' ||
          form[i].type !== 'button' ||
          form[i].nodeName.toLowerCase() !== 'fieldset' ||
          form[i].nodeName.toLowerCase() !== 'reset'
        ) {
		    var longEnough = form[i].value.length >= settings.minValueLength;
          
			if (
				(form[i] !== undefined && form[i] !== null) &&
				(form[i].type === 'checkbox' && form[i].checked) ||
				(form[i].type === 'radio' && form[i].checked) ||
				(form[i].type === 'text' && longEnough) ||
				(form[i].type === 'range' && longEnough) ||
				(form[i].type === 'select-one' && form[i].options[form[i].selectedIndex].value.length >= settings.minValueLength) ||
				(form[i].type === 'select-multiple' && form[i].selectedOptions.length >= settings.minValueLength) ||
				(form[i].type === 'textarea' && longEnough) ||
				(form[i].type === 'number' && longEnough) ||
				(form[i].type === 'date' && longEnough) ||
				(form[i].type === 'color' && longEnough) ||
				(form[i].type === 'month' && longEnough) ||
				(form[i].type === 'week' && longEnough) ||
				(form[i].type === 'time' && longEnough) ||
				(form[i].type === 'datetime' && longEnough) ||
				(form[i].type === 'datetime-local' && longEnough) ||
				(form[i].type === 'email' && longEnough) ||
				(form[i].type === 'search' && longEnough) ||
				(form[i].type === 'tel' && longEnough) ||
				(form[i].type === 'url' && longEnough) ||
				(form[i].type === 'image' && longEnough) ||
				(form[i].type === 'file' && longEnough)
			) {

				// get the name of the current input
				inputName = form[i].name;
				
				// array/object
				if (inputName.match(/\[.*\]/g)) {

					if (inputName.match(/\[.+\]/g)) {

						// array object,  Object[][name]
						if (inputName.match(/\[.+\]/g)[0].match(/\[[0-9]\]/) !== null) {

							newArrObj = inputName.replace(/\[.+\]/g,''); // get object name
							index = inputName.match(/[0-9]/g)[0]; // get index group
							key = inputName.match(/\[.+\]/g)[0].replace(/(\[|\]|[0-9])/g,'');
						
							// create an array in an object
							if (typeof jsonData[newArrObj] === 'undefined') {
							 	jsonData[newArrObj] = [];
							}

							// create an object inside array
							if (typeof jsonData[newArrObj][index] === 'undefined') {
								jsonData[newArrObj][index] = {};
							}

							jsonData[newArrObj][index][key] = form[i].value;

						} else if (inputName.match(/\[.+\]/g) !== null) {
							// to object
							// Object[name]

							// get object name
							newObj = inputName.replace(/\[.+\]/g,'');

							// set new object
							if (typeof jsonData[newObj] === 'undefined') {
								jsonData[newObj] = {};
							}
							// assign a key name
							key = inputName.match(/\[.+\]/g)[0].replace(/(\[|\])/g,'');

							// set key and form value
							jsonData[newObj][key] = form[i].value;
						}
					} else {		

						// to array, Object[]
						key = inputName.replace(/\[.*\]/g, '');

						if (form[i].type === 'select-multiple') {
							for (var j = 0; j < form[i].selectedOptions.length; j++) {
								if (form[i].selectedOptions[j].value.length > 0) {
									if (typeof jsonData[key] === 'undefined') {
										jsonData[key] = [];
									}
									jsonData[key].push(form[i].selectedOptions[j].value);
								}
							}
							
						} else {
							if (typeof jsonData[key] === 'undefined') {
								jsonData[key] = [];
							}
							jsonData[key].push(form[i].value);
						}
						
					}	
				} else {
					// basic info
					key = form[i].name.replace(/\[.*\]/g, '');
					jsonData[key] = form[i].value;

				}
			}
		}
	}

    if (document.querySelector(settings.printDataIn) !== null) { 
        document.querySelector(settings.printDataIn).innerHTML = JSON.stringify(jsonData);
    }
  
    if (settings.returnData) {
      return jsonData;
    }
    
    return false;
}
