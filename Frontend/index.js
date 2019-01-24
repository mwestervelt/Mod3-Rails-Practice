//Code your solution here
document.addEventListener("DOMContentLoaded", init)

function init(){
  console.log("working")
  getAllLists().then(putListNamesInDropdown)
}

function putListNamesInDropdown(listArray){
  listArray.forEach(list => {
    const listDropdown = document.querySelector("#list-select")
    const dropdownOption = document.createElement("option")
    dropdownOption.setAttribute("data-id", `${list.id}`)
    dropdownOption.setAttribute("value", `${list.id}`)
    dropdownOption.innerText += list.name
    listDropdown.append(dropdownOption)
    listDropdown.addEventListener("change", findListDetail)
  })

}

function findListDetail(event){
  getOneList(event.target.value).then(listInfo => slapListDetail(listInfo))
}

/// list stuff
function slapListDetail(list){
  const mainList = document.querySelector("#main-list")
  mainList.innerHTML = ""
  mainList.innerHTML = `<h1 id="main-list-name">${list.name} - ${list.priority}</h1>
      <ul class="list-group list-group-flush" id="main-list-tasks">
        </ul><br>
          <h1>Create a New Task</h1>
        <div id="task-form-container">
        <form id="new-task-form">
          <label>Task Name:</label>
          <input data-id=${list.id} type="text" id="task-name">
          <input data-id=${list.id} type="submit">
        </form>
    </div>`

    const taskForm = document.querySelector("#new-task-form")
    taskForm.addEventListener("submit", submitNewTask)
/// task stuff
    list.tasks.forEach(task => {
      let checked = task.done == true ? 'checked' : ''
      const taskList = document.querySelector("#main-list-tasks")
      const taskLi = document.createElement("li")
      const checkbox = document.createElement("checkbox")
      checkbox.innerHTML = `<input data-id=${task.id} type="checkbox" ${checked} class="task-checkbox">`
      taskLi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
      taskLi.setAttribute("data-id", `${task.id}`)
      taskLi.innerText = task.name
      taskList.append(taskLi)
      taskLi.append(checkbox)
      taskLi.addEventListener("change", toggleDone)
    })
}

function submitNewTask(event){
  const taskForm = document.querySelector("#new-task-form")
  event.preventDefault()
  let listID = event.target.querySelector("#task-name").dataset.id
  let findInput = event.target
  let newTaskInput = findInput.querySelector("#task-name").value
  newTaskObj = {name: newTaskInput, done: false, list_id: listID}
  postNewTask(newTaskObj).then(doSomethingWithTask)
}

function doSomethingWithTask(newTask){
  const newTaskLi = document.createElement("li")
  const taskList = document.querySelector("#main-list-tasks")
  newTaskLi.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center")
  newTaskLi.innerText = newTask.name
  taskList.prepend(newTaskLi)
}

function toggleDone(event){
  let taskID = event.target.dataset.id
  let isDone = event.target.checked
  //// line 84
  /// this was the only one line added after time limit
  /// was working on Front-end and the patch was written
  updateDoneTask(taskID, isDone)
}

//fetches
 const listURL = `http://localhost:3000/lists`
 const taskURL = `http://localhost:3000/tasks`

 function getAllLists(){
   return fetch(listURL)
   .then(response => response.json())
 }

function getOneList(listID){
  return fetch(listURL + `/${listID}`)
  .then(response => response.json())
}

function postNewTask(newTaskObj){
  const options =  {
       method: "POST",
       headers: {
           "Content-Type": "application/json",
           'Accepts': 'application/json'
       },
       body: JSON.stringify(newTaskObj),
   }
   return fetch(taskURL, options)
   .then(response => response.json())
}

function updateDoneTask(taskID, isDone){
  console.log("toggle is being persited");
  const options =  {
       method: "PATCH",
       headers: {
           "Content-Type": "application/json",
           'Accepts': 'application/json'
       },
       body: JSON.stringify({done: isDone}),
   }
   return fetch(taskURL + `/${taskID}`, options)
   .then(response => response.json())
}
