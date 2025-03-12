const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem ("logged");
const session = localStorage.getItem ("session");
let data = {
    transactions: []
};

checkLogged();


//LOGAR NO SISTEMA
document.getElementById("login-form").addEventListener("submit", function(e){
    e.preventDefault();
    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const checkSession = document.getElementById("session-check").checked;

// Faz uma requisição a um usuarío com um ID expecifico
axios.post('http://localhost:3333/login', {
    login: email,
    password: password
    })
  .then(function (response) {
    // manipula o sucesso da requisição
    console.log(response);
    saveSession({email, password}, checkSession)
    window.location.href = "home.html";
    })
  .catch(function (error) {
    alert(error.response.data.msg);
  })
});
//CRIAR CONTA
document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("email-create-input").value;
    const password = document.getElementById("password-create-input").value;

    console.log (email, password);

    if (email.length<5) {
        alert("Informe um e-mail válido")
        return;
    }
    if (password.length<4) {
        alert("Preencha a senha com no mínimo 4 dígitos")
        return;
    }

    axios.post('http://localhost:3333/users', {
        login: email,
        password: password
        })
      .then(function (response) {
        // manipula o sucesso da requisição
        console.log(response);
        myModal.hide();

        alert(response.data.msg);
        })
        
      .catch(function (error) {
        alert(error.response.data.msg);

      })
})

function checkLogged() {
    if(session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }
    if (logged) {
        saveSession (logged, session);
        window.location.href = "home.html";
    
    }
}

function saveAccount(data){
    localStorage.setItem(data.login, JSON.stringify(data));
}

function saveSession(data, saveSession){
    if(saveSession) {
        localStorage.setItem("session", JSON.stringify(data));
    }
    sessionStorage.setItem("logged", JSON.stringify(data))
}
   
