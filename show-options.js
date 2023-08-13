let sheetID = '1ZgsoKX-H1yo94Gy1uO_DC69SKzW7eLxAfi3i7ByhZ-U';
let sheetName = 'Sheet1';
let sheetRange = 'B2:B';
let url = ('https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?sheet=' + sheetName + '&range=' + sheetRange);

fetch(url)
    .then(res => res.text())
    .then(text => {
        let json = JSON.parse(text.substr(47).slice(0, -2)).table.rows;
        let select = document.getElementById('employeeSelect');
        json.forEach((row) => {
            // Set default option with name "Vastav Vijay"
            if (row.c[0].v == 'Vastav Vijay') {
                select.innerHTML += `<option value="${row.c[0].v}" selected>${row.c[0].v}</option>`;
            }
            let option = document.createElement('option');
            option.value = row.c[0].v;
            option.text = row.c[0].v;
            select.appendChild(option);
        });
    });