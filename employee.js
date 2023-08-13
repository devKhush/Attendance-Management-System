const addEmployeeURL = 'https://script.google.com/macros/s/AKfycbyyy5XHwqo9sA5DHt1j8mfiB1C-gBOPMO5UEdbbBubBubsBA_chRIxb3OVO_gFRZQxx/exec'
const employeeForm = document.forms['add-employee-form']

employeeForm.addEventListener('submit', e => {
    e.preventDefault()
    fetch(addEmployeeURL, { method: 'POST', body: new FormData(employeeForm) })
        .then(response => alert("Employee Added successfully!"))
        .then(() => { window.location.reload(); })
        .catch(error => console.error('Error!', error.message))
})