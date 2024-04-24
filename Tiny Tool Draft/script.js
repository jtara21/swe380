let classes = [];
let resultsDisplayed = false;

//Home Page

function displayResults() {
	
	if(resultsDisplayed){
		return;
	}
	
    // Get the table
    let table = document.getElementById("metricsTable");

    // Add new header cells (th) for each class in the array
    let headerRow = table.rows[0];
    for (let i = 0; i < classes.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = classes[i].name;
        headerRow.appendChild(th);
    }


    // Add new data cells (td) for each class in the array
    for (let j = 0; j < classes.length; j++) {
        let td = document.createElement('td');
        td.innerHTML = classes[j].depth;
        table.rows[1].appendChild(td);
    }
	for (let j = 0; j < classes.length; j++) {
        let td = document.createElement('td');
        td.innerHTML = classes[j].numberOfChildren;
        table.rows[2].appendChild(td);
    }
	for (let j = 0; j < classes.length; j++) {
        let td = document.createElement('td');
        td.innerHTML = classes[j].WMC;
        table.rows[3].appendChild(td);
    }
	for (let j = 0; j < classes.length; j++) {
        let td = document.createElement('td');
        td.innerHTML = classes[j].LCM;
        table.rows[4].appendChild(td);
    }
	for (let j = 0; j < classes.length; j++) {
        let td = document.createElement('td');
        td.innerHTML = classes[j].RFC;
        table.rows[5].appendChild(td);
    }
	for (let j = 0; j < classes.length; j++) {
        let td = document.createElement('td');
        td.innerHTML = classes[j].CBO;
        table.rows[6].appendChild(td);
    }
	
	resultsDisplayed = true;
}


//DIT and NOC page

function updateClassDropdown() {
    const dropdown = document.getElementById('classDropdown');
    dropdown.innerHTML = '<option value="">None</option>'; // Reset

    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = cls.name;
        dropdown.appendChild(option);
    });
}

function sessionSaveData(){
    // Save the data to session storage
    sessionStorage.setItem('inheritanceData', JSON.stringify(classes));
	console.log(classes);
}

function sessionLoadData(){
	if (sessionStorage.getItem('inheritanceData')){
		classes = JSON.parse(sessionStorage.getItem('inheritanceData'));
		console.log(classes);
	}
}

function addClass() {
    const className = document.getElementById('className').value.trim();
    const parentClassName = document.getElementById('classDropdown').value;

    if (className === "") {
        alert("Please enter a class name.");
        return;
    }

    // Prevent duplicate class names
    if (classes.find(cls => cls.name === className)) {
        alert("Class name already exists.");
        return;
    }
	
	
	// if a parent was chosen, get the iundex of the parent in the array
	if (parentClassName != '') {
		var indexOfParent = classes.findIndex(cls => cls.name === parentClassName);
    }
	

    const newClass = {
        name: className,
	parentRef: classes[indexOfParent],
	depth: 0,
	numberOfChildren: 0,
	WMC: 0,
	LCM: 0,
	RFC: 0,
	CBO: 0,
	methods: [],
	complexities: [],
	attributes: [],
    };
	
	
	if (parentClassName != '') {
		newClass.depth = newClass.parentRef.depth + 1;
		newClass.parentRef.numberOfChildren++;
	}
	

    classes.push(newClass);
    updateClassDropdown(); // Update dropdown after adding a class

    // Reset input fields
    document.getElementById('className').value = '';
    document.getElementById('classDropdown').value = '';
	
	sessionSaveData();
}

function removeClass() {
    const classNameToRemove = document.getElementById('className').value.trim();

    classes = classes.filter(cls => cls.name !== classNameToRemove);
    updateClassDropdown()(); // Update dropdown after removing a class

    // Reset input fields
    document.getElementById('className').value = '';
    document.getElementById('parentClass').value = '';

    console.log(classes); // For debugging
}

//Methods and Attributes Page

// General function to add method and attribute
// Add a new editable row to the table
function addEditableRow() {
    const tableBody = document.getElementById('methodsAndAttributesTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const methodCell = newRow.insertCell(0);
    const attributeCell = newRow.insertCell(1);

    methodCell.innerHTML = '<input type="text" class="input-method">';
    attributeCell.innerHTML = '<input type="text" class="input-attribute">';
}

function saveMethodsAndAttributes(){
	const table = document.getElementById('methodsAndAttributesTable');
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let methodsLength = classes[indexOfClass].methods.length;
	
	for(let i=methodsLength+1; i < table.rows.length; i++){
		
		let row = table.rows[i];
		let methodInput = row.cells[0].getElementsByClassName('input-method')[0];
		let attributeInput = row.cells[1].getElementsByClassName('input-attribute')[0];
		
		classes[indexOfClass].methods.push(methodInput.value);
		classes[indexOfClass].attributes.push(attributeInput.value);
	}
	
	sessionSaveData();
}

function displayClassMethodsAndAttributes(){
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let arrayLength = classes[indexOfClass].methods.length;
	const tableBody = document.getElementById('methodsAndAttributesTable').getElementsByTagName('tbody')[0];
	
	while(tableBody.rows.length){
		tableBody.deleteRow(0);
	}
		
	if(arrayLength){
		for(let i=0; i < arrayLength; i++){
			const newRow = tableBody.insertRow();
			const methodCell = newRow.insertCell(0);
			const attributeCell = newRow.insertCell(1);
			let method = classes[indexOfClass].methods[i];
			let attribute = classes[indexOfClass].attributes[i];
			
			console.log(method + ' ' + attribute);

			methodCell.innerHTML = `<div class="input-method">${method}</div>`;
			attributeCell.innerHTML = `<div class="input-attribute">${attribute}</div>`;
		}
	}
}


//WMC Page

function displayClassMethodsAndComplexities(){
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let arrayLength = classes[indexOfClass].methods.length;
	const tableBody = document.getElementById('WMCTable').getElementsByTagName('tbody')[0];
	
	while(tableBody.rows.length){
		tableBody.deleteRow(0);
	}
		
	if(arrayLength){
		for(let i=0; i < arrayLength; i++){
			const newRow = tableBody.insertRow();
			const methodCell = newRow.insertCell(0);
			const complexityCell = newRow.insertCell(1);
			let method = classes[indexOfClass].methods[i,0];
			let complexity = classes[indexOfClass].methods[i,1];
			
			console.log(method + ' ' + complexity);

			methodCell.innerHTML = `<div class="input-method">${method}</div>`;
			complexityCell.innerHTML = `<div class="input-attribute">${complexity}</div>`;
		}
	}
}

function toggleComplexityInputs() {
    const isChecked = document.getElementById('enableComplex').checked;
    const complexityInputs = document.querySelectorAll('.complexity-input');
    complexityInputs.forEach(input => {
        input.disabled = !isChecked;
    });
    if (isChecked) {
        // Save the state when switching to complex mode
        saveWMCData();
    }
}

function calculateWMC() {
    const complexityInputs = document.querySelectorAll('.complexity-input');
    let totalWMC = 0;
    let wmcData = [];

    if (!document.getElementById('enableComplex').checked) {
        totalWMC = complexityInputs.length; // Simple calculation: count methods
    } else {
        complexityInputs.forEach(input => {
            const methodName = input.closest('tr').cells[0].textContent;
            const complexityValue = parseInt(input.value, 10) || 0;
            totalWMC += complexityValue;
            wmcData.push({
                methodName: methodName,
                complexity: complexityValue
            });
        });
    }

    const wmcSessionData = {
        methods: wmcData,
        totalWMC: totalWMC,
        isComplex: document.getElementById('enableComplex').checked
    };

    sessionStorage.setItem('wmcData', JSON.stringify(wmcSessionData));
    document.getElementById('totalWMC').textContent = 'Total WMC: ' + totalWMC;
}

function saveWMCData() {
    const complexityInputs = document.querySelectorAll('.complexity-input');
    let wmcData = [];

    complexityInputs.forEach(input => {
        const methodName = input.closest('tr').cells[0].textContent;
        const complexityValue = parseInt(input.value, 10) || 0;
        wmcData.push({
            methodName: methodName,
            complexity: complexityValue
        });
    });

    const wmcSessionData = {
        methods: wmcData,
        totalWMC: document.getElementById('totalWMC').textContent.replace('Total WMC: ', ''),
        isComplex: document.getElementById('enableComplex').checked
    };

    sessionStorage.setItem('wmcData', JSON.stringify(wmcSessionData));
}

//LCM Page
let associations = [];

function displayLCMTable(){
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let methods = classes[indexOfClass].methods;
	let attributes = classes[indexOfClass].attributes;
	const table = document.getElementById('LCMTable');
	
	while(table.rows.length>0){
		table.deleteRow(0);
	}
	
	methods.forEach(function(method, methodIndex) {
        	var row = table.insertRow();
        	var cell = row.insertCell();
        	cell.textContent = method;

        	// Label the columns with the attributes array
        	if (methodIndex === 0) {
            		var header = table.createTHead();
            		var headerRow = header.insertRow();
            		attributes.forEach(function(attribute) {
                		var cell = headerRow.insertCell();
                		cell.textContent = attribute;
            		});
        	}

        	// Add dropdown boxes to each cell (except for the header row and header column)
        	for (var i = 0; i < attributes.length; i++) {
            		var cell = row.insertCell();
            		if (methodIndex > 0 && i > 0) {
                		var select = document.createElement("select");
                		var optionYes = document.createElement("option");
                		optionYes.text = "Yes";
                		select.add(optionYes);
                		var optionNo = document.createElement("option");
                		optionNo.text = "No";
                		select.add(optionNo);
                		cell.appendChild(select);
            		}
        	}
    	});
}

/*
function addMethodAttribute() {
    const methodSelect = document.getElementById('methodSelect');
    const attributeSelect = document.getElementById('attributeSelect');
    const method = methodSelect.value;
    const attribute = attributeSelect.value;

    if (!method || !attribute) {
        alert("Please select both a method and an attribute.");
        return;
    }

    // Prevent duplicate entries
    const associationExists = associations.some(assoc => assoc.method === method && assoc.attribute === attribute);
    if (associationExists) {
        alert("This association has already been added.");
        return;
    }

    associations.push({ method, attribute });
    updateAssociationsTable();
}
*/

/*function displayClassMethodsAndCohesion(){
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let mLength = classes[indexOfClass].methods.length;
	let aLength = classes[indexOfClass].attributes.length;
	const tableBody = document.getElementById('LCMTable').getElementsByTagName('tbody')[0];
	const tableHead = document.getElementById('LCMTable').getElementsByTagName('thead')[0];
	
	while(tableHead.columns.length){
		tableBody.deleteColumn(0);
	while(tableBody.rows.length){
		tableBody.deleteRow(0);
	}
	if(aLength){
		for(let i=0; i < aLength; i++){
			const newColumn = tableHead.insertColumn();
			const attributeCell = newColumn.insertCell(0);
			let attribute = classes[indexOfClass].attributes[i];
			
			//console.log(attribute);

			attributeCell.innerHTML = `<div class="input-attribute">${attribute}</div>`;
		}
	if(mLength){
		for(let i=0; i < mLength; i++){
			const newRow = tableBody.insertRow();
			const methodCell = newRow.insertCell(0);
			let method = classes[indexOfClass].methods[i];
			
			//console.log(method);

			methodCell.innerHTML = `<div class="input-method">${method}</div>`;
		}
	}
}*/

function updateAssociationsTable() {
    const tableBody = document.getElementById('associationsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing entries

    associations.forEach(assoc => {
        const row = tableBody.insertRow();
        const methodCell = row.insertCell(0);
        const attributeCell = row.insertCell(1);
        methodCell.textContent = assoc.method;
        attributeCell.textContent = assoc.attribute;
    });
}

function calculateLCM() {
    // Implement LCM calculation logic here based on the associations
    const lcmScore = calculateLCMScore(associations); // You will need to define this function
    document.getElementById('lcmScore').querySelector('span').textContent = lcmScore;
}


//Help Page 
document.querySelectorAll('.help-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Ensure data loads when the page loads
window.onload = function() {
	sessionLoadData();
	if ((!window.location.href.includes('Home.html')) && (!window.location.href.includes('help.html'))){
		updateClassDropdown();
	}
}


/*
//retrieve data
function loadMethodsFromSession() {
    const savedData = JSON.parse(sessionStorage.getItem('wmcData'));
    if (savedData && savedData.methods && savedData.methods.length > 0) {
        savedData.methods.forEach(entry => {
            addMethodToTable(entry.methodName, entry.complexity);
        });
        document.getElementById('totalWMC').textContent = 'Total WMC: ' + savedData.totalWMC;
        document.getElementById('enableComplex').checked = savedData.isComplex;
        toggleComplexityInputs(); // Ensure inputs are correctly enabled/disabled based on saved state
    }
}

function addMethodToTable(methodName) {
    const tableBody = document.getElementById('methodsTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const methodNameCell = newRow.insertCell(0);
    const complexityCell = newRow.insertCell(1);
    methodNameCell.textContent = methodName;
    complexityCell.textContent = '-';  // Placeholder for complexity
}

function addMethodToTable(methodName, complexity = 0) {
    const tableBody = document.getElementById('methodsTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const methodNameCell = newRow.insertCell(0);
    const complexityCell = newRow.insertCell(1);
    methodNameCell.textContent = methodName;
    complexityCell.innerHTML = `<input type="number" class="complexity-input" value="${complexity}" min="0" disabled>`;
}
*/
