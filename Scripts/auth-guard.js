firebase.auth().onAuthStateChanged(user => {
    const nonAuthPages = ["/index.html", "/index/pages/register.html", "/index/pages/recuperation.html"];
    
    const isCurrentlyOnNonAuthPage = nonAuthPages.some(pagePath => {
        if (pagePath === "/index.html") {
            return window.location.pathname === "/" || window.location.pathname.endsWith("/index.html") || window.location.pathname.endsWith("index.html");
        }
        return window.location.pathname.endsWith(pagePath);
    });

    const isCurrentlyOnHomePage = window.location.pathname.endsWith("/index/pages/home.html") || window.location.pathname.endsWith("/home.html");

    if (user) {
        const rememberMe = localStorage.getItem("rememberMe") === "true";

        if (isCurrentlyOnNonAuthPage && !isCurrentlyOnHomePage) {
            window.location.href = "/index/pages/home.html";
        } else if (!rememberMe && !isCurrentlyOnHomePage && !isCurrentlyOnNonAuthPage) {
            firebase.auth().signOut().then(() => {
                console.log("Usuário deslogado: rememberMe é falso, não está na home e não está em página de não-autenticação.");
            }).catch(error => {
                console.error("Erro ao deslogar usuário:", error);
            });
        }

    } else {
        if (!isCurrentlyOnNonAuthPage) {
             window.location.href = "/index.html";
        }
    }
});

