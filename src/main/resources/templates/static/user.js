fetch('/api/user').then(
    res => {
        res.json().then(
            data => {
                console.log(data)
                let temp = "";
                temp += "<td>" + data.id + "</td>";
                temp += "<td>" + data.name + "</td>";
                temp += "<td>" + data.age + "</td>";
                temp += "<td>" + data.email + "</td>";
                let rolesStr = "";
                data.roles.forEach(r => {
                    rolesStr += r.role.replaceAll("ROLE_", "") + " ";
                })
                temp += rolesStr + "</td>" + "</tr>";
                document.getElementById("tableUserBody").innerHTML = temp;
            }
        )
    }
)