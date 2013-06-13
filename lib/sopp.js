/*
 *  Copyright (C) Ronny Haase, 2013
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
 // TODO: Rename everything named default, short or long (Those are JS keywords!)

module.exports = exports = function sopp(settings, argv, slicepos) {
	var parsed = { illegal_: [], files_: [] }

	if ( typeof slicepos !== 'number' || slicepos < 0 )
		slicepos = 2
	if ( !Array.isArray(argv) )
		argv = process.argv.slice(slicepos)

	var argc = argv.length;

	(function noConflict(opts) {
		var shortList = ''
			, longList = []
			, supportedTypes = [String, Boolean, Array]

		for (var i = 0, len = opts.length; i < len; i++) {
			// Look for duplicate short command
			if ( shortList.indexOf(opts[i].short) === -1 )
				shortList += opts[i].short
			else
				throw new Error('(sopp) The shortage ´' + opts[i].short  + '´ is assigned more than once!')

			// Look for duplicate long command
			if ( longList.indexOf(opts[i].long) === -1 )
				longList.push(opts[i].long)
			else
				throw new Error('(sopp) The long command ´' + opts[i].long  + '´ is assigned more than once!')

			// Check for type support
			if ( supportedTypes.indexOf(opts[i].type) === -1)
				throw new Error('(sopp) SOPP doesn\'t support the type "' + opts[i].type + '"!')
			
			// Preset options with default value
			if ( opts[i].hasOwnProperty('defaultval') )
				parsed[opts[i].name] = opts[i].defaultval
		}
	})(settings)

	function isLongOpt(s) {
		// TODO: Make this a RegEx
		return ( 
			// s is a String
			typeof s === 'string'
			// First two chars are '-'
			&& s[0] === '-' && s[1] === '-'
			// '--' is followed by at least one more character
			&& s[2] !== undefined
		)
	}

	function isShortOpt(s) {
		// TODO: Make this a RegEx
		return (
			// s is a String
			typeof s === 'string'
			// First char is '-'
			&& s[0] === '-'
			// There's a second char and it's not '-'
			&& s[1] !== undefined && s[1] !== '-'
		)
	}

	function isEmptyOpt(s) {
		return ( typeof s === 'string' && ( s === '-' || s === '--' ) )
	}

	function findLong(s) {
		for (var i = 0, len = settings.length; i !== len; i++)
			if ( settings[i].long === s )
				return settings[i]

		return false
	}

	function findShort(s) {
		for (var i = 0, len = settings.length; i !== len; i++)
			if ( settings[i].short.indexOf(s) !== -1 )
				return settings[i]

		return false
	}

	//
	// Parsing
	//
	var
		arg = ''
		, arg_opt

	// Iterate through arguments
	for (var i = 0; i < argc; i++) {
		arg = argv[i]

		if ( isShortOpt(arg) ) {
			//
			// Short-hand option parsing
			//
			for (var j = 1; arg[j]; j++) {
				if ( arg_opt = findShort(arg[j]) ) {
					if ( arg_opt.type === Boolean ) {
						parsed[arg_opt.name] = true
					// The option (String) expects a value and we're not at the argument's end
					} else if ( arg_opt.type === String && arg[j+1] ) {
						// The rest of the argument is treated as the options value
						parsed[arg_opt.name] = arg.slice(j+1)
						break
					// The option (String) expects a value, but we're at the argument's end, and current argument is followed by another
					} else if ( arg_opt.type === String && !arg[j+1] && argv[i+1]) {
						// The next argument is treated as the options value
						parsed[arg_opt.name] = argv[++i]
						break
					// The option (Array) expects a value and we're not at the argument's end
					} else if ( arg_opt.type === Array && arg[j+1] ) {
						// If option is undefined, yet, create it
						if ( parsed[arg_opt.name] === undefined )
							parsed[arg_opt.name] = [ arg.slice(j+1) ]
						// Else push to it
						else
							parsed[arg_opt.name].push( arg.slice(j+1) )

						break
					// The option (Array) expects a value, but we're at the argument's end, and current argument is followed by another
					} else if ( arg_opt.type === Array && !arg[j+1] && argv[i+1] ) {
						// If option is undefined, yet, create it
						if ( parsed[arg_opt.name] === undefined )
							parsed[arg_opt.name] = [ argv[++i] ]
						// Else push it
						else
							parsed[arg_opt.name].push( argv[++i] )

						break
					}
				// Unknown short-hand option -> illegal
				} else {
					parsed.illegal_.push(arg)
				}
			} 

		} else if ( isLongOpt(arg) ) {
			//
			// Long-hand option parsing
			//
			var
				lo_pos_eq = ( (lo_pos_eq = arg.indexOf('=')) !== -1 ) ? lo_pos_eq : arg.length
				, lo_name = arg.slice(0,lo_pos_eq)
				, lo_val = arg.slice(lo_pos_eq+1)
	
			if ( arg_opt = findLong(lo_name) ) {
				if ( arg_opt.type === Boolean )
					parsed[arg_opt.name] = true
				else if ( arg_opt.type === String && lo_val !== '' )
					parsed[arg_opt.name] = lo_val
				else if ( arg_opt.type === Array && lo_val !== '' ) {
					if ( parsed[arg_opt.name] === undefined )
						parsed[arg_opt.name] = [lo_val]
					else
						parsed[arg_opt.name].push(lo_val)
				}
			} else {
				parsed.illegal_.push(lo_name)
			}

		} else if ( isEmptyOpt(arg) ) {
			// Ignore

		} else {
			parsed.files_.push(arg)
		}

	} // /for

	return parsed
} // /sopp
