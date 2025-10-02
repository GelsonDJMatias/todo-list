//Retrieve data stored in the browser's Local Storage
function getTask() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

//Save tasks to the browser's Local Storage
function setTask(data) {
    return localStorage.setItem("tasks", JSON.stringify(data));
}

//Send message
function message(msg) {
    return msg;
}

//Create new task
function newTask() {
    const input = document.getElementById("input-task");
    const text = input.value.trim();

    //Reject if input field is empty
    if(text === '') {
        alert("⚠ Oops! The field is empty. Please enter a task to continue.");
        return;
    }

    addTask(text);

    input.value = "";
    input.focus();
}

//Add task to the list
function addTask(task) {
    const tasks = getTask();

    const newTask = {id: Date.now(), name: task, check: false};
    tasks.push(newTask)

    setTask(tasks);

    showTask();
}

//Show tasks
function showTask () {
    const tasks = getTask();

    //Verifying if my list is empty
    const list = document.getElementById("list");

    if(tasks.length === 0 ) {
        list.textContent = "⚠ Your list is empty. Click 'Add' to create a new task.";
        return;
    }

    list.innerHTML = '';

    tasks.forEach(task => {

        const li = document.createElement("li");
        li.classList.add("task-li");
        li.dataset.id = task.id;
        
        const div = document.createElement("div");
        div.classList.add("edit-field");

        li.innerHTML = `
            <div id="box-1">
                <span id="span-text">
                    <span id="span-check">
                    ${task.check ? '<i class="fa-solid fa-check-double"></i>':''}
                    </span>${task.name}
                </span>

                <div id="buttons">
                    <div class="tooltip">
                        <button class="edit"><i class="fa-regular fa-pen-to-square"></i></button>
                        <span class="tooltip-text">Edit task</span>
                    </div>
                    <div class="tooltip">
                        <button class="delete"><i class="fa-solid fa-trash"></i></button>
                        <span class="tooltip-text">Delete task</span>
                    </div>
                
                    <div class="tooltip">
                        <button class="check">
                            ${task.check 
                                ? '<i class="fa-solid fa-circle-minus"></i><span class="tooltip-text">Uncheck task</span>' 
                                :'<i class="fa-regular fa-square-check"></i><span class="tooltip-text">Task completed</span>'
                            }
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="edit-field hidden box-2">
                <input type="text" name="taskEdit-name" class="input-edit" value="${task.name}">
                <button class="saveButton"><i class="fa-solid fa-floppy-disk"></i></button>
            </div>
                        
        `;

        list.appendChild(li);
        
    });

}

const list = document.getElementById("list");
let previousId = null;

//Event delegation (one single event for all buttons)
list.addEventListener("click", (event) => {
    //
    const li = event.target.closest("li");
    //If nothing valid was clicked, exit.
    if(!li) return;

    const id = Number(li.dataset.id);

    const editBtn = event.target.closest("button.edit");
    const deleteBtn = event.target.closest("button.delete");
    const checkBtn = event.target.closest("button.check");
    const saveBtn = event.target.closest("button.saveButton");

   if(editBtn) {
    editTask(id);
   } else if(deleteBtn) {
    deleteTask(id);
   } else if(checkBtn) {
    taskCompleted(id);
   } else if(saveBtn) {
    saveTask(id);
   }
})

//Edit existing task
function editTask(id) {
    const li = document.querySelector(`li[data-id="${id}"]`);

    
    const box2 = li.querySelector(".box-2");
    box2.classList.toggle("hidden");

    const input = box2.querySelector(".input-edit");
    input.focus()
   
    input.setSelectionRange(input.value.length, input.value.length);
}

//Save edited task
function saveTask(id) {
    const tasks = getTask();

    const li = document.querySelector(`li[data-id="${id}"]`);
    const box2 = li.querySelector(".box-2");
    const input = box2.querySelector(".input-edit");

    const task = tasks.find(task => task.id === id);

    if(input.value.trim() === '') {
        alert("⚠ Oops! The field is empty. Please enter a task to continue.");
        return input.value = task.name;
    }

    const text = input.value;
    
    if(text && text !== task.name){
       
        task.name = text;
        setTask(tasks);
        
        showTask();
        box2.classList.add("hidden");
    }
}

//Delete task
function deleteTask(id) {
    const tasks = getTask();

    const deleteTask = tasks.filter(task => task.id !== id);
    if(!deleteTask) {
        alert("⚠ O ID não foi encontrado!");
    }

    setTask(deleteTask);

    showTask();
}

//Mark task as completed
function taskCompleted(id) {
    const tasks = getTask();

    const task = tasks.find(task => task.id === id);
    if(task) {
        task.check = !task.check;
        setTask(tasks);

        showTask();
    }

}

//button add task
const btnAdd = document.getElementById("addButton");
btnAdd.addEventListener("click", newTask);

//input with Enter
const inputTask = document.getElementById("input-task");

inputTask.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        newTask();
    }
})


//dark Mode localStorage
function getMode() {
    return localStorage.getItem("dark-mode");
}

function setMode(setIn) {
    return localStorage.setItem("dark-mode", `${setIn}`);
}

//Dark 
const btnMode = document.getElementById("modedark");
const mode = document.body;
let darkmode = getMode();

const enableDarkMode = () => {
    const enablited = "enable"
    mode.classList.add("dark");
    setMode(enablited);
}

const disableDarkMode = () => {
    const disablited = "disable";
    mode.classList.remove("dark");
    setMode(disablited);
}


if(darkmode === "enable") {
    enableDarkMode();
    btnMode.innerHTML = '<i class="fa-solid fa-sun"></i>';
} else {
    btnMode.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

//event to listener the mode
btnMode.addEventListener("click", () => {
    darkmode = getMode();

    if(darkmode === "disable"){
        enableDarkMode();
        btnMode.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        disableDarkMode();
        btnMode.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
})

//load task 
window.onload = function() {
    showTask();

    darkmode = getMode();
    if(!darkmode) {
        setMode("disable");
    }
}