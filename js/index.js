
let options = {
	titleInputSection: 'input fields',
	titleListSection: 'list of cards',
	alarmIextForCardNumber: 'The number is wrong or already exist',
	validationBankCard: createValidationBankCard(),
	initState: JSON.parse(window.localStorage.getItem('initState')),
	tmplNotebook: _.template(document.getElementById('bank-card-notebook').innerHTML),
	tmplItem: _.template(document.getElementById('bank-card-notebook__item').innerHTML),
};
let notebook = new createNotebook(options);
let notebookNode = notebook.getElem();

document.getElementById('entry-point').appendChild(notebookNode);



function createNotebook(optons) {
	let elem;
	let state = options.initState || {ids: [], elements: {},};
	let inputOfNumber;
	let inputOfComment;
	let listOfCards;
	let { alarmIextForCardNumber } = options;
	let { validationBankCard } = options;

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
			if ( inputOfNumber.classList.contains('wrong-number') ) {
				inputOfNumber.classList.remove('wrong-number');
				removeAlarmWindow(isEventOnNumberOfCard);
			}
		}

		elem.onclick = function(e) {

			let isEventOnRecord = e.target.closest('input[value="record"]');
			let isEventOnClose = e.target.closest('.bank-card-notebook__item-close');

			if ( !isEventOnRecord && !isEventOnClose ) return;

			if ( isEventOnRecord ) {
				let id = inputOfNumber.value;

				if ( !validationBankCard(id) || state.ids.some( (item) => item === id) ) {
					createAlarmWindow(inputOfNumber, alarmIextForCardNumber);
				} else {
					state.ids.push(id);
					state.elements[id] = [inputOfComment.value, validationBankCard.getCardBrand(id)];
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

		let item = document.createElement('div');

		item.innerHTML = html;
		item = item.firstElementChild;

		listOfCards.appendChild(item);
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

	function removeAlarmWindow(link) {
		let alarmWindow = link.parentElement.querySelector('.alarm-win');

		link.parentElement.removeChild(alarmWindow);
	}

	function createAlarmWindow(link, text) {
		if ( link.parentElement.querySelector('.alarm-win') ) {
			link.focus();
			return;
		} 

		let win = document.createElement('div');
		let pointer = document.createElement('div');

		win.className = 'alarm-win';
		pointer.className = 'alarm-win-pointer';

		win.textContent = text;
		win.appendChild(pointer);
		link.parentElement.appendChild(win);
		
		link.focus();
		link.classList.add('wrong-number');
	}

	this.getElem = getElem;
}
