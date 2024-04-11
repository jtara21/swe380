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
let methods = [];
let attributes = [];

function addMethod() {
    const methodsList = document.getElementById('methodsList');
    const methodInput = document.createElement('input');
    methodInput.type = 'text';
    methodInput.placeholder = 'Method Name';
    methodsList.insertBefore(methodInput, methodsList.lastChild);
    methods.push(methodInput);
}

function addAttribute() {
    const attributesList = document.getElementById('attributesList');
    const attributeInput = document.createElement('input');
    attributeInput.type = 'text';
    attributeInput.placeholder = 'Attribute Name';
    attributesList.insertBefore(attributeInput, attributesList.lastChild);
    attributes.push(attributeInput);
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
