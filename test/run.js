var
	should = require('should')

	sopp = require('./../lib/sopp')

describe('sopp', function() {
	it('should return false if no settings are passed', function() {
		should.equal(false, sopp())
	})

	it('should throw an exception if a short-hand argument is assigned for more than 1 option', function() {
		(function() {
			var settings = [
				{ name: 'a', short: 'x'  }
				, { name: 'b', short: 'x' }
			]
			sopp(settings)
		}).should.throw()
	})

	it('should throw an exception if a long-hand argument is assigned for more than 1 option', function() {
		(function() {
			var settings = [
				{ name: 'scren', long: '--scream' }
				, { name: 'yell', long: '--scream' }
			]

			sopp(settings)
		}).should.throw()
	})

	it('should accept type Boolean, String and Array', function() {
		(function() {
			var settings = [
				{ name: 'string', type: String }
				, { name: 'bool', type: Boolean }
				, { name: 'array', type: Array }
			]

			sopp(settings)
		}).should.not.throw()
	})

	it('should throw an exception if a unsupported type is assigned', function() {
		(function() {
			var settings = [
				{ name: 'string', type: String }
				, { name: 'bool', type: Boolean }
				, { name: 'number', type: Number }
			]

			sopp(settings)
		}).should.throw()
	})
})
