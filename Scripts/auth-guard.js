// Limpa cookies se rememberMe for false e não estiver na home.html ou index.html
(function() {
    const rememberMe = localStorage.getItem("rememberMe");
    const path = window.location.pathname;
    const isHome = path.endsWith("/home.html");
    const isIndex = path.endsWith("/index.html") || path === "/";
    if (rememberMe === "false") {
        if (isHome) {
            // Se estiver na home e rememberMe for false, desloga e redireciona
            firebase.auth().signOut().then(() => {
                window.location.href = "/index.html";
            });
            return;
        } else if (!isIndex && document.cookie) {
            // Apaga todos os cookies
            document.cookie.split(";").forEach(function(c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
            });
            // Redireciona para login após limpar cookies
            window.location.href = "/index.html";
            return;
        }
    }
})();

firebase.auth().onAuthStateChanged(user => {
    if(!user){
        window.location.href = "/index.html";
    }
});
