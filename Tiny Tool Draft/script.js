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
		
		if(methodInput.value){			
			classes[indexOfClass].methods.push(methodInput.value);
		}
		if(attributeInput.value){
			classes[indexOfClass].attributes.push(attributeInput.value);
		}
	}
	
	sessionSaveData();
}

function displayClassMethodsAndAttributes(){
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let arrayLength = Math.max(classes[indexOfClass].methods.length, classes[indexOfClass].attributes.length);
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

			if (method){
			methodCell.innerHTML = `<div class="input-method">${method}</div>`;
			}
			if(attribute){
			attributeCell.innerHTML = `<div class="input-attribute">${attribute}</div>`;
			}
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
			let method = classes[indexOfClass].methods[i];
			let complexity = classes[indexOfClass].methods[i,1];

			methodCell.innerHTML = `<div class="input-method">${method}</div>`;
			complexityCell.innerHTML = '<input type="number" min ="1" class="input-complexity">';
		}
	}
}

function toggleComplexityInputs() {
    const isChecked = document.getElementById('enableComplex').checked;
    const complexityInputs = document.querySelectorAll('.complexity-input');
    complexityInputs.forEach(input => {
        input.disabled = !isChecked;
    });
}

function calculateWMC() {
	const table = document.getElementById('WMCTable');
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
    let complexityInputs = [];
    let totalWMC = 0;

	for(let i=1; i < table.rows.length; i++){
	
		let row = table.rows[i];
		let complexity = row.cells[1].getElementsByClassName('input-complexity')[0];
		
		complexityInputs.push(complexity.value);
	}
	
	classes[indexOfClass].complexities = complexityInputs;
	
	if (!document.getElementById('enableComplex').checked) {
        totalWMC = complexityInputs.length; // Simple calculation: count methods
	}
	else {
		for(let i=0; i<complexityInputs.length; i++){
			totalWMC += +complexityInputs[i];
		}
	}

	classes[indexOfClass].WMC = totalWMC;
	sessionSaveData();
}


//LCM Page
/*
function saveLCMData() {
    function SaveLCMTable() {
        const className = document.getElementById('classDropdown').value;
        let indexOfClass = classes.findIndex(cls => cls.name === className);
        let attributes = classes[indexOfClass].attributes;
        const table = document.getElementById('LCMTable');

        // see if associations array has enough space for the class
        while (associations.length <= indexOfClass) {
            associations.push([]);
        }

        let tempAssoc = [];

        // iterates over each table row. It skips the header row.
        for (let i = 1; i < table.rows.length; i++) {
            let row = table.rows[i];
            let tempAssoc2 = [];

            // iterates thru each cell in row (besides header cell)
            for (let j = 1; j < row.cells.length; j++) {
                let cell = row.cells[j];
                let select = cell.querySelector("select");
                let selectedIndex = select.selectedIndex;
                let selectedOption = select.options[selectedIndex];
                let value = selectedOption.text === "Yes" ? 1 : 0;
                tempAssoc2.push(value);
            }
            tempAssoc.push(tempAssoc2);
        }

        // associations array is updated
        associations[indexOfClass] = tempAssoc;
    }

    // calls when necessary
    SaveLCMTable();
}
*/
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

	let header = table.createTHead();
        let headerRow = header.insertRow();
	let emptyCell = headerRow.insertCell();
        attributes.forEach(function(attribute) {
        	let colHead = headerRow.insertCell();
                colHead.textContent = attribute;
        });
	
	methods.forEach(function(method, methodIndex) {
		let body = table.createTBody();
        	let row = body.insertRow();
        	let rowHead = row.insertCell();
        	rowHead.textContent = method;

        	// Add dropdown boxes to each cell (except for the header row and header column)
        	for (let i = 0; i < attributes.length; i++) {
            		let newCell = row.insertCell();
                	let select = document.createElement("select");
                	let optionNo = document.createElement("option");
                	optionNo.text = "No";
                	select.add(optionNo);
                	newCell.appendChild(select);
			let optionYes = document.createElement("option");
                	optionYes.text = "Yes";
                	select.add(optionYes);
        	}
    	});
}

function LCMButton(){
	SaveLCMTable();
	CalculateLCM();
}

function SaveLCMTable() {
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let attributes = classes[indexOfClass].attributes;
	const table = document.getElementById('LCMTable');
	
	while(associations.length < indexOfClass) {
		associations.push(0);
	}
	
	let tempAssoc = [];
	
	for (let i = 1 ; i < table.rows.length ; i++) {
		
		let row = table.rows[i];
		let tempAssoc2 = [];
		
		let cells = row.querySelectorAll("td");
                cells.forEach(function(cell, cellIndex) {
                    if (cellIndex > 0) { // Skip header column
                        let select = cell.querySelector("select");
                        let selectedIndex = select.selectedIndex;
                        let selectedOption = select.options[selectedIndex];
                        let value = selectedOption.text === "Yes" ? 1 : 0;
                        tempAssoc2.push(value);
		    }
                });
		tempAssoc.push(tempAssoc2);
	}
	associations[indexOfClass] = tempAssoc;
	console.log(associations)
}

function CalculateLCM() {
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let methods = classes[indexOfClass].methods;
	let attributes = classes[indexOfClass].attributes;
	let mLen = classes[indexOfClass].methods.length;
	let aLen = classes[indexOfClass].attributes.length;

	let cohesion = [];
	for (let m1 = 0 ; m1 < mLen ; m1++) {
		let tempCohesion = [];
		for (let m2 = 0 ; m2 < mLen ; m2++){
			let value = 0;
			for (let att = 0 ; att < aLen ; att++){
				if (associations[indexOfClass][m1][att] == 1 && associations[indexOfClass][m2][att] == 1) {
					value = 1;
				}
			}
			tempCohesion.push(value);
		}
		cohesion.push(tempCohesion);
	}
	console.log(cohesion);

	let Head = [];
	for (let m1 = 0 ; m1 <mLen ; m1++) {
		Head.push(1);
		for (let m2 = 0 ; m2 < m1 ; m2++){
			if (cohesion[m1][m2] == 1){
				Head[m1] = 0;
				if (Head[m2] == 1){
					for (let m3 = 0 ; m3 < m2 ; m3++){
						if (cohesion[m1][m3] == 1){
							Head[m2] = 0;
						}
					}
				}
			}
		}
	}
	let LCM = 0;
	for (let i = 0 ; i < Head.length ; i++){
		if (Head[i] == 1){
			LCM++;
		}
	}
	classes[indexOfClasses].LCM = LCM;
	console.log(LCM)
}

// CBO Page
function displayLCMTable(){
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	let methods = classes[indexOfClass].methods;
	let attributes = classes[indexOfClass].attributes;
	const table = document.getElementById('CBOTable');
	
	while(table.rows.length>0){
		table.deleteRow(0);
	}

	let header = table.createTHead();
        let headerRow = header.insertRow();
	let emptyCell = headerRow.insertCell();
        classes.forEach(function(cls) {
                if (cls.name !== className) { // Exclude the selected class
                    let colHead = headerRow.insertCell();
                    colHead.textContent = cls.name; // Using class name for header, assuming you meant cls.name not attribute
                }
            });
	
	methods.forEach(function(method, methodIndex) {
		let body = table.createTBody();
        	let row = body.insertRow();
        	let rowHead = row.insertCell();
        	rowHead.textContent = method;

        	// Add dropdown boxes to each cell (except for the header row and header column)
        	for (let i = 0; i < classes.length; i++) {
            		let newCell = row.insertCell();
                	let select = document.createElement("select");
                	let optionNo = document.createElement("option");
                	optionNo.text = "0";
                	newCell.appendChild(select);
			let optionYes = document.createElement("option");
                	optionYes.text = "1";
                	select.add(optionYes);

        
        	}
    	});

        attributes.forEach(function(attribute, attributeIndex) {
            let body = table.createTBody();
                let row = body.insertRow();
                let rowHead = row.insertCell();
                rowHead.textContent = method;
    
                // Add dropdown boxes to each cell (except for the header row and header column)
                for (let i = 0; i < classes.length; i++) {
                        let newCell = row.insertCell();
                        let select = document.createElement("select");
                        let optionNo = document.createElement("option");
                        optionNo.text = "0";
                        select.add(optionNo);
                        newCell.appendChild(select);
                let optionYes = document.createElement("option");
                        optionYes.text = "1";
                        select.add(optionYes);
                }
            });
        
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
