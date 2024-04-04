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
