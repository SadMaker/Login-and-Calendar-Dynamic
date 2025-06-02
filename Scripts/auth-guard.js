firebase.auth().onAuthStateChanged(user => {
    if(!user){
        window.location.href = "/Login-and-Calendar-dynamic/index.html"; // ajuste aqui
    }
});