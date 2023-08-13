const addAttendenceURL = 'https://script.google.com/macros/s/AKfycbxvtLBSeLUADjttjEI91WuP9rvexWfFUYoIOWwzpwXUPhATiJqxf2qUeMvW79yv93kI/exec'
const attendenceForm = document.forms['add-employee-attendence-form']

attendenceForm.addEventListener('submit', event => {
    event.preventDefault()
    fetch(addAttendenceURL, { method: 'POST', body: new FormData(attendenceForm) })
        .then(response => alert("Attendence Added successfully!"))
        .then(() => { window.location.reload(); })
        .catch(error => console.error('Error!', error.message))
})