function teste(){
    firebase.firestore()
    .collection('usuarios')
    .get()
    .then(snapshot => {
        const eventos = console.log(snapshot.docs.map(doc => doc.data()));
    })
}

teste()