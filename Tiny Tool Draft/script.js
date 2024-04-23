//Home page table results template
function displayResults() {
    // Simulated results data
    let table = document.getElementById('metricsTable');
    let rows = table.getElementsByTagName('tr');
    let head = document.createElement('th');
    const results = {
        DIT: '5 levels',
        NOC: '3 children',
        CBO: '2 objects',
        RFC: '10 methods',
        LCOM: 'Low cohesion',
        WMC: 'High complexity'
    };

    // Displaying the results in the table
    for (const metric in results) {
        document.getElementById(metric).textContent = results[metric];
    }
}


//LCM Page
let associations = [];

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

function calculateLCOM() {
    // Implement LCOM calculation logic here based on the associations
    const lcomScore = calculateLCOMScore(associations); // You will need to define this function
    document.getElementById('lcomScore').querySelector('span').textContent = lcomScore;
}





//DIT and NOC page
let classes = [];

function updateParentClassDropdown() {
    const parentClassDropdown = document.getElementById('parentClass');
    parentClassDropdown.innerHTML = '<option value="">None (root class)</option>'; // Reset

    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = cls.name;
        parentClassDropdown.appendChild(option);
    });
}

function sessionSaveInheritanceData(){
    // Save the data to session storage
    sessionStorage.setItem('inheritanceData', JSON.stringify(classes));
	console.log('saved');
}

function sessionLoadInheritanceData(){
	if (sessionStorage.getItem('inheritanceData')){
		classes = JSON.parse(sessionStorage.getItem('inheritanceData'));
		console.log(classes);
	}
}

function addClass() {
    const className = document.getElementById('className').value.trim();
    const parentClassName = document.getElementById('parentClass').value;

    if (className === "") {
        alert("Please enter a class name.");
        return;
    }

    // Prevent duplicate class names
    if (classes.find(cls => cls.name === className)) {
        alert("Class name already exists.");
        return;
    }

    const newClass = {
        name: className,
        parentName: parentClassName,
    };

    classes.push(newClass);
    updateParentClassDropdown(); // Update dropdown after adding a class

    // Reset input fields
    document.getElementById('className').value = '';
    document.getElementById('parentClass').value = '';

    //console.log(classes); // For debugging
	
	sessionSaveInheritanceData();
}

function removeClass() {
    const classNameToRemove = document.getElementById('className').value.trim();

    classes = classes.filter(cls => cls.name !== classNameToRemove);
    updateParentClassDropdown(); // Update dropdown after removing a class

    // Reset input fields
    document.getElementById('className').value = '';
    document.getElementById('parentClass').value = '';

    console.log(classes); // For debugging
}







//Methods and Attributes Page
// General function to add method and attribute
// Add a new editable row to the table
function addEditableRow() {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const methodCell = newRow.insertCell(0);
    const attributeCell = newRow.insertCell(1);

    methodCell.innerHTML = '<input type="text" class="input-method" onchange="saveDataToSession()">';
    attributeCell.innerHTML = '<input type="text" class="input-attribute" onchange="saveDataToSession()">';
}

// Save the data from the table to session storage
function saveDataToSession() {
    const inputsMethod = document.querySelectorAll('.input-method');
    const inputsAttribute = document.querySelectorAll('.input-attribute');
    let data = [];

    // Iterate over all inputs and save entries where at least one of the fields is filled
    inputsMethod.forEach((input, index) => {
        // Check if either method or attribute input is filled out
        if (input.value.trim() || inputsAttribute[index].value.trim()) {
            data.push({
                methodName: input.value.trim(),
                attributeName: inputsAttribute[index].value.trim()
            });
        }
    });

    // Save the data to session storage
    sessionStorage.setItem('methodAttributesData', JSON.stringify(data));

    // Alert the user that data has been saved
    //alert('Data has been saved successfully!');
}

// Load data from session storage to the table
function loadDataFromSession() {

    const savedData = JSON.parse(sessionStorage.getItem('methodAttributesData'));
    if (savedData && savedData.length > 0) {
        savedData.forEach(entry => {
            const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
            const newRow = tableBody.insertRow();
            const methodCell = newRow.insertCell(0);
            const attributeCell = newRow.insertCell(1);
            methodCell.innerHTML = `<input type="text" class="input-method" value="${entry.methodName}" onchange="saveDataToSession()">`;
            attributeCell.innerHTML = `<input type="text" class="input-attribute" value="${entry.attributeName}" onchange="saveDataToSession()">`;
        });
    }
}

// Next page
function goToWeightPerMethodPage() {
    window.location.href = 'WMC.html'; // Redirects to the Weight per Method page
}



// Function to update class dropdown based on your class data
function updateClassDropdown() {
    const classDropdown = document.getElementById('selectedClass');
    // Assume you have a getClassNames function that returns an array of class names
    const classNames = getClassNames(); // You need to implement this function
    classNames.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classDropdown.appendChild(option);
    });
}
// Call this function once your page data is ready
updateClassDropdown();






//Weighted Method per class
window.onload = function() {
    loadDataFromSession();
    updateMethodsTable();
};

//WMC page
document.addEventListener('DOMContentLoaded', function() {
    loadMethodsFromSession();
});

function loadMethodsFromSession() {
    const savedData = JSON.parse(sessionStorage.getItem('methodAttributesData'));
    if (savedData && savedData.length > 0) {
        savedData.forEach(entry => {
            addMethodToTable(entry.methodName);
        });
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
	sessionLoadInheritanceData();
	loadDataFromSession();
	if(window.location.pathname.includes('/DIT&NOC.html')){
		updateParentClassDropdown();
	}
	updateMethodsTable(); //Update methods table if there's another function to do so	
}
