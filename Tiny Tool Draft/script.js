let numberOfClasses = 2;

function addColumn() {
    let table = document.getElementById('mainTable');
    let rows = table.getElementsByTagName('tr');

    let head = document.createElement('th');
    head.className = "table-cell";
    head.textContent = "Class " + numberOfClasses;
    rows[0].appendChild(head);
    numberOfClasses++;

    for (let i = 1; i < rows.length; i++) {
        let cell = document.createElement('td');
        cell.className = "table-cell";
        cell.innerHTML = '<input type="text">';
        rows[i].appendChild(cell);
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

    console.log(classes); // For debugging
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
function addData() {
    const methodName = document.getElementById('methodName').value.trim();
    const attributeName = document.getElementById('attributeName').value.trim();

    if (methodName === "" || attributeName === "") {
        alert("Please enter both a method name and an attribute name.");
        return;
    }

    // Update the table with the new method and attribute
    updateDataTable(methodName, attributeName);
    // Save the data to session storage
    saveDataToSession(methodName, attributeName);

    // Clear the input fields after adding
    document.getElementById('methodName').value = '';
    document.getElementById('attributeName').value = '';
}


//Update The data from Methods and Attributes input on the table.
function updateDataTable(methodName, attributeName) {
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const methodCell = newRow.insertCell(0);
    const attributeCell = newRow.insertCell(1);

    methodCell.textContent = methodName;
    attributeCell.textContent = attributeName;
}


//Saving the data from the M&A inputs 
function saveDataToSession(methodName, attributeName) {
    // Retrieve existing data from session storage
    let savedData = JSON.parse(sessionStorage.getItem('methodAttributesData')) || [];
    savedData.push({ methodName, attributeName });

    // Save updated data back to session storage
    sessionStorage.setItem('methodAttributesData', JSON.stringify(savedData));
}

//Have access to the saved data from the Methods and Attributes page
function loadDataFromSession() {
    const existingEntries = JSON.parse(sessionStorage.getItem('methodAttributesData'));
    if (existingEntries) {
        existingEntries.forEach(entry => {
            updateDataTable(entry.methodName, entry.attributeName);
        });
    }
}

window.onload = loadDataFromSession;  // Call this function when the page loads

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
let methods = [];
let addedMethods = new Set(); // Track added methods to ensure uniqueness

window.onload = function() {
    loadMethodsFromSession();
};
function toggleCalculationType(type) {
    const complexityInput = document.getElementById('complexity');
    const complexityHeader = document.getElementById('complexityHeader');
    const methodInputArea = document.getElementById('methodInputArea');
    const calculateButton = document.querySelector('button[onclick="calculateTotalWMC()"]');

    document.querySelectorAll("#methodsTable tbody tr").forEach(row => row.deleteCell(-1)); // Remove last cell from each row

    if (type === 'complex') {
        methodInputArea.style.display = 'block';
        complexityInput.disabled = false;
        complexityHeader.style.display = "";
        calculateButton.disabled = false;
        methods.forEach(method => addComplexityColumn(method.complexity)); // Re-add complexity column for existing methods
    } else {
        methodInputArea.style.display = 'block';
        complexityInput.disabled = true;
        complexityHeader.style.display = "none";
        calculateButton.disabled = false;
    }
}

function addSelectedMethod() {
    window.onload = function() {
        loadMethodsFromSession();
    };
    const methodName = document.getElementById('methodSelect').value || document.getElementById('newMethodName').value.trim();
    const complexity = document.getElementById('complexity').disabled ? 0 : parseInt(document.getElementById('complexity').value, 10) || 0;

    if (!methodName) {
        alert("Please enter or select a method name.");
        return;
    }

    if (addedMethods.has(methodName)) {
        alert("This method has already been added.");
        return;
    }

    const method = { methodName, complexity };
    methods.push(method);
    addedMethods.add(methodName);
    updateMethodsTable(method);
    updateMethodDropdown();

    document.getElementById('newMethodName').value = '';
    document.getElementById('complexity').value = '';
}

function updateMethodsTable(method) {
    const tableBody = document.getElementById('methodsTable').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();
    const methodNameCell = row.insertCell(0);
    methodNameCell.textContent = method.methodName;

    if (!document.getElementById('complexity').disabled) {
        const complexityCell = row.insertCell(1);
        complexityCell.textContent = method.complexity;
    }
}

function addComplexityColumn(complexity) {
    const rows = document.getElementById('methodsTable').getElementsByTagName('tbody')[0].rows;
    Array.from(rows).forEach(row => {
        const cell = row.insertCell(1);
        cell.textContent = complexity;
    });
}

function calculateTotalWMC() {
    const isComplexityEnabled = !document.getElementById('complexity').disabled;
    let totalWMC;

    if (isComplexityEnabled) {
        totalWMC = methods.reduce((acc, method) => acc + method.complexity, 0);
    } else {
        totalWMC = methods.length; // Simple calculation just counts the number of methods
    }

    document.getElementById('totalWMC').querySelector('span').textContent = totalWMC;
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
