const myModal = new bootstrap.Modal("#transactions-modal");
let logged = sessionStorage.getItem ("logged");
const session = localStorage.getItem ("session");
let cashIn = [];
let cashOut = [];
let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);

function userHeader() {
    let userHeader = null;
    if(logged) {
        const user = JSON.parse(logged);
        userHeader = {'user': user.email, 'password': user.password};
    } else {
        const user = JSON.parse(session);
        userHeader = {'user': user.email, 'password': user.password};
    }
    return userHeader;
};

function logout () {
    sessionStorage.removeItem("logged");

    localStorage.removeItem("session");

    window.location.href = "index.html"
}

//ADICIONAR LANÇAMENTO
document.getElementById("transactions-modal").addEventListener("submit", function(e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;



    axios.post('http://localhost:3333/transactions', {
        value: value,
        description: description,
        date: date,
        type: Number(type)
    }, {
        headers:userHeader(),
    })
  .then(function (response) {
    // manipula o sucesso da requisição
    console.log(response);
    e.target.reset();
    myModal.hide();

    alert(response.data.msg);

    getTransactions();
  })
  .catch(function (error) {
    // manipula erros da requisição
    alert(error.response.data.msg);
  })
});

function getTransactions() {
    axios.get('http://localhost:3333/transactions', {
        headers:userHeader(),
    })
  .then(function (response) {
    // manipula o sucesso da requisição
    console.log(response);

    data.transactions = response.data.data;

    let transactionsHtml = ``;

    if (data.transactions.length) {
        data.transactions.forEach((item) => {
            let type = "Entrada";

            if(item.type === 2) {
                type = "Saída"
            }

            transactionsHtml += `
            <tr>
                <th scope="row">${item.date}</th>
                <td>R$ ${item.value}</td>
                <td>${type}</td>
                <td>${item.description}</td>
            </tr>
            `
        })
    }
    document.getElementById("transactions-list").innerHTML = transactionsHtml;
})
  .catch(function (error) {
    // manipula erros da requisição
    alert(error.response.data.msg);
    })
}




checkLogged();

function checkLogged() {
    if(session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }
    if (!logged) {
        window.location.href = "index.html";
        return;
    }
    const dataUser = localStorage.getItem(logged);
    if(dataUser) {
        data = JSON.parse(dataUser);
    }
    getTransactions();
}

