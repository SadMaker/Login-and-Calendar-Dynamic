// Limpa cookies se rememberMe for false e não estiver na home.html
(function() {
    const rememberMe = localStorage.getItem("rememberMe");
    const isHome = window.location.pathname.endsWith("/home.html");
    if (rememberMe === "false" && !isHome) {
        // Apaga todos os cookies
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
        });
    }
})();

firebase.auth().onAuthStateChanged(user => {
    if(!user){
        window.location.href = "/index.html";
    }
});
