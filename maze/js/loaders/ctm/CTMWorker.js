/*
 * Copyright (c) Joe Martella All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

importScripts( "lzma.js", "ctm.js" );

self.onmessage = function( event ) {

	var files = [];

	for ( var i = 0; i < event.data.offsets.length; i ++ ) {

		var stream = new CTM.Stream( event.data.data );
		stream.offset = event.data.offsets[ i ];

		files[ i ] = new CTM.File( stream );

	}

	self.postMessage( files );
	self.close();

}
