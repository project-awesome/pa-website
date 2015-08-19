


describe('Angular Filters', function() {

	beforeEach(module('awesomeApp'));

	describe('indexToLetter', function() {

		it('should convert indices 0-25 to a-z',
			inject(function(indexToLetterFilter) {
			expect(indexToLetterFilter(0)).to.equal('a');
			expect(indexToLetterFilter(25)).to.equal('z');
		}));

		it('should leave any other index value alone',
			inject(function(indexToLetterFilter) {
			expect(indexToLetterFilter(-1)).to.equal(-1);
			expect(indexToLetterFilter(26)).to.equal(26);
		}));


	});
});








