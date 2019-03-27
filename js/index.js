
let options = {
	titleInputSection: "input fields",
	titleListSection: "list of cards",
	initState: JSON.parse(window.localStorage.getItem('initState')),
	tmplNotebook: _.template(document.getElementById('bank-card-notebook').innerHTML),
	tmplItem: _.template(document.getElementById('bank-card-notebook__item').innerHTML),
};
let notebook = new Notebook(options);
let notebookNode = notebook.getElem();

document.getElementById('entry-point').appendChild(notebookNode);



function Notebook(optons) {
	let elem;
	let state = options.initState || {ids: [], elements: {},};
	let inputOfNumber;
	let inputOfComment;
	let listOfCards;

	function getElem() {
		if (!elem) render();
		return elem; 
	}

	function render() {
		let html = options.tmplNotebook({
			titleInputSection: options.titleInputSection,
			titleListSection: options.titleListSection,
		});

		elem = document.createElement('div');
		elem.innerHTML = html;
		elem = elem.firstElementChild;

		inputOfNumber = elem.querySelector('[name="number-of-card"]');
		inputOfComment = elem.querySelector('[name="comment-of-card"]');
		listOfCards = elem.querySelector('.bank-card-notebook__list');
		
		if (state.ids.length) renderList();

		elem.oninput = function(e) {
			let isEventOnNumberOfCard = e.target.closest('[name*="number-of-card"]');
					
			if ( !isEventOnNumberOfCard ) return;

			applyMask(isEventOnNumberOfCard);
			checkLengthOfNumberOfCard();			
			if ( inputOfNumber.classList.contains('wrong-number') ) inputOfNumber.classList.remove('wrong-number');
		}

		elem.onclick = function(e) {

			let isEventOnRecord = e.target.closest('input[value="record"]');
			let isEventOnClose = e.target.closest('.bank-card-notebook__item-close');

			if ( !isEventOnRecord && !isEventOnClose ) return;

			if ( isEventOnRecord ) {
				let id = inputOfNumber.value;
				let brandOfCard = getBrandOfCard(id);


				if ( !brandOfCard ) {
					wrongNumber();
				} else {
					state.ids.push(id);
					state.elements[id] = [inputOfComment.value, brandOfCard];
					renderItem(id);
					inputOfComment.value = '';
					inputOfNumber.value = '';
					inputOfNumber.focus();
					checkLengthOfNumberOfCard();
					sendDataToLocalStorage();
				}
			}

			if ( isEventOnClose && confirm('Are you sure?') )  {
				
				let id = isEventOnClose.previousElementSibling.textContent;
				let card = isEventOnClose.closest('.bank-card-notebook__item');
		
				state.ids = state.ids.filter( (elem) => elem !== id );
				delete state.elements[id];
				deleteItem(card);
				inputOfNumber.focus();
				sendDataToLocalStorage();
			}
		}
	}

	function getBrandOfCard(number) {
		let unbrokenNumber = number.replace(/\D/g, '');

		if ( /^4[0-9]{12}(?:[0-9]{3})?$/.test(unbrokenNumber) ) return 'visa';

		if ( /^(5[1-5][0-9]{14}|2221[0-9]{12}|222[2-9][0-9]{12}|22[3-9][0-9]{13}|2[3-6][0-9]{14}|27[01][0-9]{13}|2720[0-9]{12})$/.test(unbrokenNumber) ) return 'master-card';

		return null;
	}

	function renderList() {
		state.ids.forEach((id) => {
			renderItem(id);
		});
	}

	function renderItem(id) {
		let html = options.tmplItem({
			brand: state.elements[id][1],
			number: id,
			comment: state.elements[id][0],
		});

		let el = document.createElement('div');

		el.innerHTML = html;
		el = el.firstElementChild;

		listOfCards.appendChild(el);
	}

	function deleteItem(card) {
		listOfCards.removeChild(card);
	}

	function sendDataToLocalStorage() {
		window.localStorage.setItem('initState', JSON.stringify(state));
	}

	function applyMask(field) {
		let arrOfmask = field.dataset.mask.split('');
		

		function isNumber(symbol) {
			return /\d/.test(symbol);
		}

		function reapplyMask(data) {
			let arrOfvalue = data.split('').filter(isNumber);

			return arrOfmask.map((char) => {
						if (arrOfvalue.length === 0) return '';
						if (char !== '_') return char;

						return arrOfvalue.shift();
					}).join('');
		}

		field.value = reapplyMask(field.value);
	}

	function checkLengthOfNumberOfCard() {
		if ( inputOfNumber.value.length === 25 ) {
				inputOfComment.nextElementSibling.disabled = false;
		} else {
				inputOfComment.nextElementSibling.disabled = true;
		}
	}

	function wrongNumber() {
		inputOfNumber.focus();
		inputOfNumber.classList.add('wrong-number');
		alert('Wrong number');
	}

	this.getElem = getElem;
}
