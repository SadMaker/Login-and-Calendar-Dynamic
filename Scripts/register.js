function registrar(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm-password").value;

    if (password !== confirm_password) {
        showError("As senhas não coincidem!");
        return;
    }

    loading(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                window.location.href = "../home.html";
            })
            .catch(error => {
                console.log(error);
                showError("Ocorreu algum erro no servidor");
            });
    });
}