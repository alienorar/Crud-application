const open_btn = document.getElementById("open-btn");
const user_modal = document.getElementById("user-modal");
const close = document.getElementById("close");
const save = document.getElementById("save");
const result = document.getElementById("result");
let form = {};
let edit_user = -1;
let delete_user = -1
let current_page = 1;
let items_per_page = 2;
const users = JSON.parse(localStorage.getItem("users")) || [];
let search = "";
document.addEventListener("DOMContentLoaded", function () {
    save.addEventListener("click", addUser);
    save.addEventListener("click", () => {
        toggleModal("none");
    })
    displayUsers();
    saveStorage();


});
open_btn.addEventListener("click", function () {
    toggleModal("block");
});
close.addEventListener("click", function () {
    toggleModal("none");
});
window.addEventListener("click", function (event) {
    if (event.target === user_modal) {
        toggleModal("none");
    }
});
function addUser() {
    console.log(form);
    if (edit_user > -1) {
        users[edit_user] = { ...form };
    } else {
        users.push({ ...form });
    }
    displayUsers();
    saveStorage();
    toggleModal("none");
}
function displayUsers() {
    result.innerHTML = "";
    let filtered_users = users?.filter(item => {
        if (item?.first_name?.includes(search)) {
            return item
        }
    });
    let start_index = (current_page - 1) * items_per_page
    let end_index = start_index + items_per_page
    let display_users = filtered_users.slice(start_index, end_index)

    display_users.forEach((item, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.first_name}</td>
            <td>${item.last_name}</td>
            <td>${item.age}</td>
            <td>${item.phone_number}</td>
            <td>${item.email}</td>
            <td>
            <button class="btn btn-info" onclick="editUser(${index}) ">edit</button>
            </td>
            <td>
            <button class="btn btn-danger" onclick="deleteUser(${index}) ">Delete</button>
            </td>
        `;
        result.appendChild(tr);
    });
    paginationUsers(filtered_users.length)
}

function paginationUsers(total_users) {
    let pagination_controls = document.getElementById("pagination-controls")
    let total_pages = Math.ceil(total_users / items_per_page)
    pagination_controls.innerHTML = ""
    for (let i = 1; i <= total_pages; i++) {
        let page_btn = document.createElement("button")
        page_btn.innerText = i
        page_btn.className = i === current_page ? "btn btn-primary mx-1" : "btn btn-outline-primary mx-1"
        page_btn.addEventListener("click", function () {
            current_page = i
            localStorage.setItem("pages", current_page)
            displayUsers()
        })
        pagination_controls.appendChild(page_btn)


    }

}


function deleteUser(index) {
    form = { ...users[index] };
    console.log(form);
    delete_user = index
    users.splice(delete_user, 1)
    form = {}
    saveStorage()
    displayUsers()

}


function handleChange(event) {
    const { name, value } = event.target;
    form = { ...form, [name]: value };
}
function handleSearch(event) {
    search = event.target.value.toLowerCase();
    displayUsers();
}
function toggleModal(status) {
    user_modal.style.display = status;
}
function saveStorage() {
    localStorage.setItem("users", JSON.stringify(users));
}
function editUser(index) {
    console.log(index);
    form = { ...users[index] };
    console.log(form);
    edit_user = index;
    document.querySelector("input[name='first_name']").value = form.first_name;
    document.querySelector("input[name='last_name']").value = form.last_name;
    document.querySelector("input[name='age']").value = form.age;
    document.querySelector("input[name='phone_number']").value =
        form.phone_number;
    document.querySelector("input[name='email']").value = form.email;
    toggleModal("block");
}
