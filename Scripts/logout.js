function logout(event) {
    event.preventDefault();
    firebase.auth().signOut()
        .then(() => {
            localStorage.removeItem("rememberMe");
            window.location.href = "/index.html";
        })
        .catch(error => {
            console.error("Erro ao deslogar:", error);
        });
}

