function registrar(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm-password").value;

    if (password !== confirm_password) {
        showError("As senhas não coincidem!");
        return;
    }

    if (password.length < 6) {
        showError("A senha deve ter pelo menos 6 dígitos!");
        return;
    }

    
    loading(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = "/super-duper-octo-rotary-phone/index/pages/home.html";
            })
            .catch(error => {
                console.log(error);
                showError("Ocorreu algum erro no servidor");
            });
    });
}