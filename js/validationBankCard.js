
let createValidationBankCard = function() {
	function VBC(rawNumber) {
		let number = makeContinuousNumber(rawNumber);

		return ( /^4[0-9]{12}(?:[0-9]{3})?$/.test(number) ) || ( /^(5[1-5][0-9]{14}|2221[0-9]{12}|222[2-9][0-9]{12}|22[3-9][0-9]{13}|2[3-6][0-9]{14}|27[01][0-9]{13}|2720[0-9]{12})$/.test(number) );
	}

	VBC.getCardBrand = function(rawNumber) {
		let number = makeContinuousNumber(rawNumber);

		if ( /^4[0-9]{12}(?:[0-9]{3})?$/.test(number) ) return 'visa';

		if ( /^(5[1-5][0-9]{14}|2221[0-9]{12}|222[2-9][0-9]{12}|22[3-9][0-9]{13}|2[3-6][0-9]{14}|27[01][0-9]{13}|2720[0-9]{12})$/.test(number) ) return 'master-card';

		return null;
	}

	function makeContinuousNumber(rawNumber) {
		return rawNumber.replace(/\D/g, '');
	}


	return VBC;
};
