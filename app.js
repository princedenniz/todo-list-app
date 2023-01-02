//select element
const todoContainer = document.getElementById("todos-list");
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const notificationEl = document.querySelector(".notification");

//vars
let todos = JSON.parse(localStorage.getItem("todos")) || [];

let editTodoId = -1;

if (todos.length === 0) {
  todoContainer.innerHTML = "Nothing to do!";
}

//form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  saveTodo();
  localStorage.setItem("todos", JSON.stringify(todos));
});

function renderHtml() {
  const htmlDoc = todos.map((item, index) => {
    return `
        <div class="todo" id="${index}">
          
          <i style = "color : ${item.color}" class="fa ${
      item.checked
        ? " fa-check-circle bi bi-check-circle-fill "
        : "fa-circle-thin bi bi-circle"
    }" data-action = "check" ></i>
           
          <p data-action = "check" style = "color : ${
            item.color
          }" class="checked">${item.value} </p>
          <i
            class="fa fa-pencil-square-o bi bi-pencil-square"
            aria-hidden="true"
          data-action = "edit"></i>
          <i class="fa fa-trash-o bi bi-trash" aria-hidden="true" data-action = "delete"></i>
        </div>`;
  });
  //   console.log()
  todoContainer.innerHTML = htmlDoc.join("");
}

function saveTodo() {
  const todoValue = todoInput.value;
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === todoValue.toUpperCase()
  );
  if (todoValue === "") {
    notificationFun("type something");
  } else if (isDuplicate) {
    notificationFun("todo already exist!");
  } else {
    if (editTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === editTodoId ? todoInput.value : todo.value,
      }));
      editTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color:
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
            .toUpperCase(),
      });
    }

    // todos.push(todo);
    renderHtml();
  }
  todoInput.value = "";
}

todoContainer.addEventListener("click", (e) => {
  const todoEl = e.target;

  const todoParent = todoEl.parentNode;
  // console.log(todoParent);
  if (todoParent.className !== "todo") return;

  //target id position
  const targetTodoId = +todoParent.id;

  //target id dataset
  const action = todoEl.dataset.action;

  action === "check" && checkFunc(targetTodoId);
  action === "edit" && editFunc(targetTodoId);
  action === "delete" && deleteFunc(targetTodoId);
});

function checkFunc(CurrentTodoid) {
  const newArr = todos.map((todo, index) => ({
    ...todo,
    checked: CurrentTodoid === index ? !todo.checked : todo.checked,
  }));
  todos = newArr;
  renderHtml();
}

function editFunc(CurrentTodoid) {
  todoInput.value = todos[CurrentTodoid].value;
  editTodoId = CurrentTodoid;
}

function deleteFunc(CurrentTodoid) {
  todos = todos.filter((todo, index) => index !== CurrentTodoid);

  renderHtml();
}

function notificationFun(message) {
  notificationEl.innerHTML = message;
  notificationEl.classList.add("notif-enter");

  setTimeout(() => {
    notificationEl.classList.remove("notif-enter");
  }, 2000);
}
