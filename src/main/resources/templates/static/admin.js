let allUsers;
let allRoles;

fetch('/rest/roles').then(
    res => {
        res.json().then(
            roles => {
                allRoles = roles;
            }
        )
    }
)

fetch('/rest/users').then(
    res => {
        res.json().then(
            data => {
                allUsers = data;
                createTable(allUsers);
            }
        )
    }
)

function createTable(data) {
    let temp = "";
    data.forEach(u => {
        console.log(u)
        temp += "<tr id=\"" + u.id + "\">";
        temp += "<td>" + u.id + "</td>";
        temp += "<td>" + u.name + "</td>";
        temp += "<td>" + u.age + "</td>";
        temp += "<td>" + u.email + "</td>";
        temp += "<td>";
        let rolesStr = "";
        u.roles.forEach(r => {
            rolesStr += r.role.replaceAll("ROLE_", "") + " ";
        })
        temp += rolesStr + "</td>";
        temp += "<td><button class=\"btn btn-info\" onclick=\"fEdit(this)\" id=\"editBtn" + u.id + "\">Edit</button></td>";
        temp += "<td><button class=\"btn btn-danger\" onclick=\"fDel(this)\" id=\"deleteBtn" + u.id + "\">Delete</button></td>" + "</tr>";
    })
    document.getElementById("usersTableBody").innerHTML = temp;
}

fetch('/rest/user').then(
    res => {
        res.json().then(
            data => {
                let temp = "";
                temp += "<tr id=\"" + data.id + "\">";
                temp += "<td>" + data.id + "</td>";
                temp += "<td>" + data.name + "</td>";
                temp += "<td>" + data.age + "</td>";
                temp += "<td>" + data.email + "</td>";
                temp += "<td>";
                let rolesStr = "";
                data.roles.forEach(r => {
                    rolesStr += r.role.replaceAll("ROLE_", "") + " ";
                })
                temp += rolesStr + "</td>" + "</tr>";
                document.getElementById("tableUserBody2").innerHTML = temp;
            }
        )
    }
)
fetch('/rest/roles').then(
    res => {
        res.json().then(
            roles => {
                let temp = "";
                console.log(roles)
                document.getElementById("rolesNew").size = roles.length;
                roles.forEach(r => {
                    temp += "<option>" + r.role + "</option>";
                })
                document.getElementById("rolesNew").innerHTML = temp;
            }
        )
    }
);
$('#addUserBtn').click(function () {
    let newUser = {
        name: "",
        age: "",
        email: "",
        password: "",
        roles: []
    };
    newUser.email = document.getElementById("emailNew").value;
    newUser.name = document.getElementById("nameNew").value;
    newUser.age = document.getElementById("AgeNew").value;
    newUser.password = document.getElementById("passwordNew").value;
    newUser.roles = [];
    [].slice.call(document.getElementById("rolesNew")).forEach(op => {
        if (op.selected) {
            allRoles.forEach(r => {
                if (r.role == op.text) {
                    newUser.roles.push(r);
                }
            })
        }
    })
    fetch('/rest/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {'Content-Type': 'application/json'}
    }).then(res1 => {
        if (res1.ok) {
            res1.json().then(u => {
                allUsers.push(u);
                createTable(allUsers);
            })
            document.getElementById("nameNew").value = "";
            document.getElementById("AgeNew").value = "";
            document.getElementById("emailNew").value = "";
            document.getElementById("passwordNew").value = "";
            document.getElementById("rolesNew").selectedIndex = -1;
        } else {
            alert("Не удалось добавить: " + res1.status);
        }
    })

})

function getUserById(id) {
    let t = null;
    allUsers.forEach(u => {
        if (u.id == id) {
            t = u;
        }
    })
    return t;
}

$('#editUserBtn').click(function () {
    let id = document.getElementById("idEditModal").value;
    let edit = {
        id: -1,
        name: "",
        age: "",
        email: "",
        password: "",
        roles: []
    };
    $('#editModal').modal('hide');
    edit.id = document.getElementById("idEditModal").value;
    edit.age = document.getElementById("ageEditModal").value;
    edit.name = document.getElementById("nameEditModal").value;
    edit.email = document.getElementById("emailEditModal").value;
    edit.password = document.getElementById("passwordEditModal").value;
    edit.roles = [];
    [].slice.call(document.getElementById("rolesEditModal")).forEach(op => {
        if (op.selected) {
            allRoles.forEach(r => {
                if (r.role == op.text) {
                    edit.roles.push(r);
                }
            })
        }
    })
    console.log(edit)
    fetch('/rest/users/' + id, {
        method: 'PUT',
        body: JSON.stringify(edit),
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => {
            if (res.ok) {
                allUsers.forEach(u => {
                    if (u.id == edit.id) {
                        u.name = edit.name;
                        u.age = edit.age;
                        u.email = edit.email;
                        if (edit.password !== "") {
                            u.password = edit.password;
                        }
                        u.roles = edit.roles;
                    }
                })
                createTable(allUsers);
            }
        });

})

$('#delUserBtn').click(function () {
    let id = document.getElementById("idDelModal").value;
    $('#deleteModal').modal('hide');

    fetch('/rest/users/' + id, {method: 'DELETE'})
        .then(res => {
            if (res.ok) {
                document.getElementById(id).remove();
                let u = getUserById(id);
                let i = allUsers.indexOf(u);
                delete allUsers[i];
            }
        });
})

function fEdit(el) {
    let idStr = el.id;
    let id = idStr.slice(7);
    allUsers.forEach(u => {
        if (u.id == id) {
            console.log(u);
            document.getElementById("idEditModal").value = u.id;
            document.getElementById("nameEditModal").value = u.name;
            document.getElementById("ageEditModal").value = u.age;
            document.getElementById("emailEditModal").value = u.email;
            document.getElementById("passwordEditModal").value = u.password;
            document.getElementById("rolesEditModal").size = allRoles.length;
            let temp = "";
            allRoles.forEach(r => {
                let select = "";
                u.roles.forEach(rUser => {
                    if (rUser.id == r.id) {
                        select = " selected";
                    }
                })
                temp += "<option" + select + ">" + r.role + "</option>";
            })
            document.getElementById("rolesEditModal").innerHTML = temp;
        }
    });
    $('#editModal').modal('show');
}

function fDel(el) {
    let idStr = el.id;
    let id = idStr.slice(9);
    allUsers.forEach(u => {
        if (u.id == id) {
            document.getElementById("idDelModal").value = u.id;
            document.getElementById("nameDelModal").value = u.name;
            document.getElementById("ageDelModal").value = u.age;
            document.getElementById("emailDelModal").value = u.email;
            document.getElementById("passwordDelModal").value = u.password;
            document.getElementById("rolesDelModal").size = u.roles.length.toString();
            let temp = "";
            u.roles.forEach(r => {
                temp += "<option>" + r.role.replaceAll("ROLE_", "") + "</option>";
            })
            document.getElementById("rolesDelModal").innerHTML = temp;
        }
    });
    $('#deleteModal').modal('show');
}