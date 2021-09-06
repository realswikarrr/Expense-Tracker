const expenseList = document.querySelector("[data-history]");
const formContainer = document.querySelector("[data-form-container]");
const formInputName = document.querySelector("[data-form-name]");
const formInputAmount = document.querySelector("[data-form-amount]");
const incomeDetail = document.querySelector("#money-plus");
const expenseDetails = document.querySelector("#money-minus");
const totalBalance = document.querySelector("#balance");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_INCOME_KEY = "task.income";
const LOCAL_STORAGE_EXPENSES_KEY = "task.expenses";
lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
income = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INCOME_KEY)) || [];
expenses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_EXPENSES_KEY)) || [];

formContainer.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = formInputName.value;
  const amount = formInputAmount.value;
  if (name == null || amount == null || name == "" || amount == "") {
    return alert("Please Don't Leave Any Field Empty");
  }
  const addItems = addList(name, amount);
  let sign = amount > 0 ? "+" : "-";
  if (sign == "-") {
    expenses.push(addItems);
  } else {
    income.push(addItems);
  }
  lists.push(addItems);
  formInputName.value = null;
  formInputAmount.value = null;
  saveAndRender();
});

function showTotalBalance() {
  let amountSign = totalAmount() > 0 ? "+" : "-";

  if (totalAmount() == 0) {
    totalBalance.textContent = `$${totalAmount()}`;
  } else {
    if (amountSign == "-") {
      totalBalance.textContent = `${amountSign}$${Math.abs(totalAmount())}`;
    } else {
      totalBalance.textContent = `${amountSign}$${totalAmount()}`;
    }
  }
}

function totalAmount() {
  return totalIncome() + totalExpenses();
}

function totalIncome() {
  var sum = 0;
  for (let i = 0; i < income.length; i++) {
    sum = sum + parseInt(income[i].amount);
  }
  return sum;
}

function totalExpenses() {
  var sum = 0;
  for (let i = 0; i < expenses.length; i++) {
    sum = sum + parseInt(expenses[i].amount);
  }
  return sum;
}

function addList(name, amount) {
  return { id: Date.now().toString(), name: name, amount: amount };
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_INCOME_KEY, JSON.stringify(income));
  localStorage.setItem(LOCAL_STORAGE_EXPENSES_KEY, JSON.stringify(expenses));
}

function saveAndRender() {
  save();
  render();
}

function render() {
  clearList(expenseList);
  incomeDetail.textContent = `+$0.00`;
  expenseDetails.textContent = `-$0.00`;
  lists.forEach((list) => {
    let items = document.createElement("li");
    incomeDetail.dataset.listId = list.id;
    expenseDetails.dataset.listId = list.id;
    let sign = list.amount > 0 ? "+" : "-";
    if (sign == "-") {
      items.classList.add("minus");
    } else {
      items.classList.add("plus");
    }
    items.innerHTML = `${list.name} <span>${sign}$${Math.abs(
      list.amount
    )}</span><button data-list-id=${list.id} class="delete-btn">x</button>`;
    expenseList.appendChild(items);
  });

  income.forEach((income) => {
    incomeDetail.textContent = `+$${totalIncome()}`;
  });

  expenses.forEach((expenses) => {
    expenseDetails.textContent = `-$${Math.abs(totalExpenses())}`;
  });

  showTotalBalance();
}

document.addEventListener("click", removeElement);

function removeElement(e) {
  const item = e.target;
  if (item.className == "delete-btn") {
    listId = item.dataset.listId;
    deleteList(listId);
  }
}

function deleteList(index) {
  const updatedList = lists.filter((item) => item.id !== index);
  const updatedIncome = income.filter((item) => item.id !== index);
  const updatedExpenses = expenses.filter((item) => item.id !== index);
  lists = updatedList;
  income = updatedIncome;
  expenses = updatedExpenses;
  saveAndRender();
}

function clearList(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
