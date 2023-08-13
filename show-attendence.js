let sheetID = '1ZgsoKX-H1yo94Gy1uO_DC69SKzW7eLxAfi3i7ByhZ-U';
let sheetName = 'Sheet1';
let sheetRange = 'A2:C';
let url = ('https://docs.google.com/spreadsheets/d/' + sheetID + '/gviz/tq?sheet=' + sheetName + '&range=' + sheetRange);

async function fetchEmployee() {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const rawData = JSON.parse(text.substr(47).slice(0, -2)).table.rows;
        const employee = rawData.map(row => ({
            emp_id: row.c[0],
            emp_name: row.c[1],
            manager_id: row.c[2]
        }));
        return employee;
    } catch (error) {
        console.log('Error occurred:', error);
        return [];
    }
}

let sheetID_attendence = '19TX6_lBF5isSQO626g1KrUu-OmsqzrzwZziTjefY1b4';
let sheetName_attendence = 'Sheet1';
let sheetRange_attendence = 'A2:D';
let url_attendence = ('https://docs.google.com/spreadsheets/d/' + sheetID_attendence + '/gviz/tq?sheet=' + sheetName_attendence + '&range=' + sheetRange_attendence);

async function fetchAttendence() {
    try {
        const response = await fetch(url_attendence);
        const text = await response.text();
        const rawData = JSON.parse(text.substr(47).slice(0, -2)).table.rows;
        const attendence = rawData.map(row => ({
            emp_id: row.c[0],
            day: row.c[1],
            punch_in: row.c[2],
            punch_out: row.c[3]
        }));
        return attendence;
    } catch (error) {
        console.log('Error occurred:', error);
        return [];
    }
}


fetchEmployee()
    .then(employee => {
        fetchAttendence()
            .then(attendence => {
                // console.log(employee); 
                // console.log(attendence); 

                // Function to recursively find the IDs of employees under a given employee either directly or indirectly
                function findSubordinates(employeeID) {
                    let subordinates = [];
                    for (let i = 0; i < employee.length; i++) {
                        if (employee[i].manager_id.v == employeeID) {
                            subordinates.push(employee[i].emp_id.v);
                            subordinates = subordinates.concat(findSubordinates(employee[i].emp_id.v));
                        }
                    }
                    return subordinates;
                }
                function findSubordinatesOfAll() {
                    const allEmployeeSubordinates = {};
                    for (let i = 0; i < employee.length; i++) {
                        allEmployeeSubordinates[employee[i].emp_id.v] = findSubordinates(employee[i].emp_id.v);
                    }
                    return allEmployeeSubordinates;
                }

                // Function to convert employee IDs to employee names
                function idToNames() {
                    let employeeName = {};
                    for (let i = 0; i < employee.length; i++) {
                        employeeName[employee[i].emp_id.v] = employee[i].emp_name.v;
                    }
                    return employeeName;
                }

                function namesToID() {
                    let employeeID = {};
                    for (let i = 0; i < employee.length; i++) {
                        employeeID[employee[i].emp_name.v] = employee[i].emp_id.v;
                    }
                    return employeeID;
                }

                // Function to find the attendance of a given employee and all the employee inside dictionary allEmployeeSubordinates
                function findAttendance(employeeID) {
                    let attendanceOfEmployee = [];
                    for (let i = 0; i < attendence.length; i++) {
                        if (attendence[i].emp_id.v == employeeID || allEmployeeSubordinates[employeeID].includes(attendence[i].emp_id.v)) {
                            attendanceOfEmployee.push([attendence[i].emp_id.v, employeeName[attendence[i].emp_id.v], attendence[i].day, attendence[i].punch_in, attendence[i].punch_out]);
                        }
                    }
                    // Sort the attendance records by first by day and then by punch-in time
                    attendanceOfEmployee.sort((a, b) => {
                        if (a[2].v < b[2].v) {
                            return -1;
                        } else if (a[2].v > b[2].v) {
                            return 1;
                        } else {
                            if (a[3].v < b[3].v) {
                                return -1;
                            } else if (a[3].v > b[3].v) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    });
                    for (let i = 0; i < attendanceOfEmployee.length; i++) {
                        attendanceOfEmployee[i][2] = attendanceOfEmployee[i][2].f;
                        attendanceOfEmployee[i][3] = attendanceOfEmployee[i][3].f;
                        attendanceOfEmployee[i][4] = attendanceOfEmployee[i][4].f;
                    }
                    return attendanceOfEmployee;
                }

                // Get the duration of stay for each employee in the attendance records
                function getDuration(attendanceRecords) {
                    let duration = [];
                    for (let i = 0; i < attendanceRecords.length; i++) {
                        let punchIn = attendanceRecords[i][3].split(":");
                        let punchOut = attendanceRecords[i][4].split(":");
                        let timePunchedIn = parseInt(punchIn[0]) * 3600 + parseInt(punchIn[1]) * 60 + parseInt(punchIn[2]);
                        let timePunchedOut = parseInt(punchOut[0]) * 3600 + parseInt(punchOut[1]) * 60 + parseInt(punchOut[2]);
                        duration.push(timePunchedOut - timePunchedIn);
                    }
                    return duration;
                }


                let allEmployeeSubordinates = findSubordinatesOfAll();
                let employeeName = idToNames();

                document.getElementById("show-attendance-form").addEventListener("submit", function (event) {
                    event.preventDefault(); // Prevent form submission

                    const selectedEmployeeName = document.getElementById("employeeSelect").value;
                    const selectedEmployeeId = namesToID()[selectedEmployeeName];
                    const filteredAttendance = findAttendance(selectedEmployeeId);
                    const duration = getDuration(filteredAttendance);

                    displayAttendanceTable(selectedEmployeeName, filteredAttendance, duration);
                });

                // Function to display the attendance table
                function displayAttendanceTable(employeeName, attendanceRecords, duration) {
                    const table = document.getElementById("show-attendence-table");

                    // Clear existing table content
                    table.innerHTML = "";

                    // Create table headers
                    const headers = ["Employee ID", "Employee Name", "Day", "Punch-in", "Punch-out"];
                    const headerRow = document.createElement("tr");
                    headers.forEach((header) => {
                        const th = document.createElement("th");
                        th.textContent = header;
                        headerRow.appendChild(th);
                    });
                    table.appendChild(headerRow);

                    let i = 0;
                    attendanceRecords.forEach((record) => {
                        const row = document.createElement("tr");
                        record.forEach((value) => {
                            const cell = document.createElement("td");
                            cell.textContent = value;
                            row.appendChild(cell);
                        });
                        if (duration[i] < 8 * 3600 == true) {
                            row.classList.add("red-row");
                        } else {
                            row.classList.add("green-row");
                        }
                        i++;
                        table.appendChild(row);
                    });
                }

            });
    });