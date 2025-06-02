function logout(event) {
    event.preventDefault();

    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem("rememberMe");
            window.location.href = "/Login-and-Calendar-dynamic/index.html"; // ajuste aqui
        })
        .catch(error => {
            console.error("Erro ao deslogar:", error);
        });
}

