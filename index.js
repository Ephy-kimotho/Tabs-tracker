const inputEl = document.getElementById("input-el");
const container = document.querySelector(".container");
const btnContainer = document.querySelector(".btn-container");
const linksContainer = document.querySelector(".links-container");

let myLeads = JSON.parse(localStorage.getItem("leads")) || [];

btnContainer.addEventListener("click", (e) => {
  const target = e.target;
  const { id } = target;

  switch (id) {
    case "input-btn":
      addLink();
      break;
    case "save-btn":
      saveTab();
      break;
    case "delete-input":
      deleteLink();
      break;
    case "clear-btn":
      clearAll();
      break;
  }
});

inputEl.addEventListener("keydown", (e) => {
  const { value } = e.currentTarget;
  if (e.key === "Enter" && value) {
    addLink();
  }
});

function addLink() {
  const link = inputEl.value.trim();
  clearInput();
  myLeads.push(link);
  saveLeads();
  render(myLeads);
}

function deleteLink() {
  const link = inputEl.value;
  const index = myLeads.findIndex((lead) => lead === link);
  if (index !== -1) {
    myLeads.splice(index, 1);
    clearInput();
    saveLeads();
    render(myLeads);
  }
}

function clearAll() {
  myLeads = [];
  localStorage.removeItem("leads");
  render(myLeads);
}

function saveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    saveLeads();
    render(myLeads);
  });
}

function render(leads) {
  linksContainer.innerHTML = "";
  leads.forEach((lead) => {
    const li = document.createElement("li");
    const newLink = document.createElement("a");

    newLink.classList.add("link");
    newLink.setAttribute("href", lead);
    newLink.setAttribute("target", "_blank");
    newLink.textContent = lead;

    li.appendChild(newLink);
    linksContainer.appendChild(li);
  });

  checkForEmptyLeads();
}

function saveLeads() {
  localStorage.setItem("leads", JSON.stringify(myLeads));
}

function clearInput() {
  inputEl.value = "";
}

const p = document.createElement("p");
p.textContent = "No links saved.";
p.classList.add("message");

function checkForEmptyLeads() {
  if (myLeads.length === 0 && !container.contains(p)) {
    container.insertBefore(p, linksContainer);
  } else if (container.contains(p)) {
    container.removeChild(p);
  }
}

render(myLeads);
