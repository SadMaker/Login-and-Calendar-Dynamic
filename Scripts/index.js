firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);


function login(event) {
    event.preventDefault();
    localStorage.setItem("rememberMe", document.getElementById("remember-me").checked);


    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then((response) =>{
        loading(() =>{
            console.log("sucesso", response);
            window.location.href = "/Login-and-Calendar-dynamic/index.html";
        })
    }).catch(error =>{
        loading(() =>{
            console.log("erro", error);
            showError("Email ou senha inválidos!");
        })
     });
      
};

function forget(event){
    event.preventDefault();

    let email = document.getElementById('email').value;
    if(email == '' || email == ' '){
        showError("O email não pode estar vazio.")
    }
    else{
        loading(() => {
            firebase.auth().sendPasswordResetEmail(email).then(() =>{
            showNotification("Enviamos um email para recuperação de senha.", "/index/pages/index.html");
            
        }).catch(error => {
                console.log("erro", error);
                showError("Usuário não encontrado!");
        })
    });
 }
}

firebase.auth().onAuthStateChanged(user => {
    const remember = localStorage.getItem("rememberMe") === "true";
    if (user && remember) {
        window.location.href = "/index/pages/home.html";
    }
});
