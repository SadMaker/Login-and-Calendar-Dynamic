function logout(event) {
    event.preventDefault();

    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem("rememberMe");
            window.location.href = "/super-duper-octo-rotary-phone/index.html";
        })
        .catch(error => {
            console.error("Erro ao deslogar:", error);
        });
}

