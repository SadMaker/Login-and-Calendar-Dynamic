firebase.auth().onAuthStateChanged(user => {
    const nonAuthPages = [
        "/index.html",
        "/index/pages/register.html",
        "/index/pages/recuperation.html"
    ];
    const path = window.location.pathname;

    const isNonAuthPage = nonAuthPages.some(page => path.endsWith(page) || (path === "/" && page === "/index.html"));
    const isHomePage = path.endsWith("/index/pages/home.html") || path.endsWith("/home.html");

    if (user) {
        const rememberMe = localStorage.getItem("rememberMe") === "true";
        // Se está em página de login/registro/recuperação, mas está logado, vai para home
        if (isNonAuthPage && !isHomePage) {
            window.location.href = "/index/pages/home.html";
            return;
        }
        // Se não marcou lembrar-me e não está na home, desloga
        if (!rememberMe && !isHomePage && !isNonAuthPage) {
            firebase.auth().signOut();
            return;
        }
        // Se está na home, não faz nada (permite acesso)
    } else {
        // Se não está logado e não está em página pública, redireciona para login
        if (!isNonAuthPage) {
            window.location.href = "/index.html";
        }
    }
});