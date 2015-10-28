(function(window, document, $, VE) {

/*global jQuery*/

// jQuery 1.8+
VE.parsers.push( function () {
	if ( ! jQuery || VE.versionCompare( jQuery.fn.jquery, '<', '1.8' ) ) {
		return [];
	}

	var elements = [];

	// Get all 'live' (on) events
	$(document).each(function(index1, element) {
		jQueryGeneric(elements, element, element);
	});

	// Get events on nodes
	$('*').each(function(index1, element) {

			jQueryGeneric(elements, element, element);

	});

	// log.green(elements)
	return elements;
});


function jQueryGeneric (elements, eventsObject, node) {

	if ( typeof eventsObject == 'object' ) {
		var events;

		if (typeof eventsObject.events == 'object') {
			events = eventsObject.events;
		}

		if ( ! events ) {
			events = $._data(eventsObject, 'events');
		}

		var func;
		// console.log(events)

		for ( var type in events ) {
			if ( events.hasOwnProperty( type ) ) {
				/* Ignore live event object - live events are listed as normal events as well */
				if ( type == 'live' ) {
					continue;
				}

		// console.log(type)

				var oEvents = events[type];

		// console.log(oEvents)

				for ( var j in oEvents ) {

					// console.log( oEvents[j].handler )

					if ( oEvents.hasOwnProperty( j ) ) {

						var aNodes = [];
						var sjQuery = "jQuery " + jQuery.fn.jquery;

						if ( typeof oEvents[j].selector != 'undefined' && oEvents[j].selector !== null ) {
							aNodes = $(oEvents[j].selector, node);
							sjQuery += " (live event)";
						}
						else {
							aNodes.push( node );
						}

						for ( var k=0, kLen=aNodes.length ; k<kLen ; k++ ) {

							elements.push( {
								"node": aNodes[k],
								"listeners": []
							} );

							if ( typeof oEvents[j].origHandler != 'undefined' ) {
								func = oEvents[j].origHandler.toString();
							}
							else if ( typeof oEvents[j].handler != 'undefined' ) {
								func = oEvents[j].handler.toString();
							}
							else {
								func = oEvents[j].toString();
							}

							/* We use jQuery for the Visual Event events... don't really want to display them */
							if ( oEvents[j] && oEvents[j].namespace != "VisualEvent" && func != "0" )
							{
								elements[ elements.length-1 ].listeners.push( {
									"type": type,
									"func": func,
									"removed": false,
									"source": sjQuery
								} );
							}
						}
					}

					// Remove elements that didn't have any listeners (i.e. might be a Visual Event node)
					if ( elements.length && elements[ elements.length-1 ].listeners.length === 0 ) {
						elements.splice( elements.length-1, 1 );
					}
				}
			}
		}
	}
}

})(window, document, jQuery, VisualEvent);

