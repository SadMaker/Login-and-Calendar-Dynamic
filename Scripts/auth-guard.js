firebase.auth().onAuthStateChanged(user => {
    if(!user){
        window.location.href = "/index/pages/index.html";
    }
});