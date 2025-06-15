firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const rememberMe = localStorage.getItem("rememberMe") === "true";
        // Verifica se a URL atual NÃO termina com "index/pages/home.html"
        const isNotHomePage = !window.location.pathname.endsWith("index/pages/home.html") && !window.location.pathname.endsWith("home.html");

        if (!rememberMe && isNotHomePage) {
            firebase.auth().signOut().then(() => {
                console.log("Usuário deslogado porque rememberMe é falso e não está na home.");
                // window.location.href = "/index.html"; 
            }).catch(error => {
                console.error("Erro ao deslogar usuário:", error);
            });
        }
    } else {
        const nonAuthPages = ["/index.html", "/index/pages/register.html", "/index/pages/recuperation.html"];
        const isNonAuthPage = nonAuthPages.some(page => window.location.pathname.endsWith(page));
        
        const isHomePage = window.location.pathname.endsWith("index/pages/home.html") || window.location.pathname.endsWith("home.html");

        if (!isNonAuthPage && !isHomePage) {
             window.location.href = "/index.html";
        } else if (isHomePage) {
            window.location.href = "/index.html";
        }
    }
});

