let classes = [];
let resultsDisplayed = false;

function testFunc(){
	const className = document.getElementById('classDropdown').value;
	let indexOfClass = classes.findIndex(cls => cls.name === className);
	if((classes[indexOfClass].methods.length > 0) || (classes[indexOfClass].attributes.length > 0)){
		console.log(indexOfClass);
	}
}


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

//LCM Page
let associations = [];

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
	console.log('saved');
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

    console.log(classes); // For debugging
	
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
	
	for(let i=1; i<table.rows.length; i++){
		console.log('test' + i);
	}
}

// Next page
function goToWeightPerMethodPage() {
    window.location.href = 'WMC.html'; // Redirects to the Weight per Method page
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