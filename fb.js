// Login
var provider = new firebase.auth.GoogleAuthProvider();
provider = new firebase.auth.TwitterAuthProvider();
provider = new firebase.auth.FaceBookAuthProvider();
[{
    Google: "fa fa-google-plus-official",
    Twitter: "fa-twitter-square",
    FaceBook: "	fa fa-facebook-official"
}]
TwitterAuthProvider

FacebookAuthProvider

	
	instagram
	telegram
	github

    $("#login").click(() => {
        firebase.auth()
            .signInWithPopup(provider)
            .then(function(result) {
                console.log(result.user);
                $("#login").hide;
                
                guardaDatos(result.user);
                
                $("#root").append("<img src='"+result.user.photoURL+"'/>")
            });
    });
    
function guardaDatos(user) {
    var usuario = {
        uId:    user.uid,
        nombre: user.displayName,
        email:  user.email,
        foto:   user.photoURL
    }
    firebase.database().ref("telmex/"+ user.uId).set(usuario);
}

// Ecrire au BD
$('#guardar').click(() =>{
   firebase.database().ref("telmex").set({nombre: "Rafa", fNac: "1958-11-10", genero: "M"})
});

function opcAuth(opciones) {
    return opciones.map(x => "<span class=" +).join("")
}

// Leyendo de la BD
firebase.database().ref("telmex").on("child_added", (s) => {
    var user = s.val();
    $("#root").append("<img src='"+user.foto+"'/>");
});

/* Hosting
firebase init y él va preguntando
firebase deploy
firebase open
*/

function debutFireBase() {
// Initialize Firebase
    var config = {
        apiKey: "AIzaSyCyNHTDb2zCM1z2i0UQ16njBkOykEUDfDg",
        authDomain: "pruebas-8b7cb.firebaseapp.com",
        databaseURL: "https://pruebas-8b7cb.firebaseio.com",
        projectId: "pruebas-8b7cb",
        storageBucket: "pruebas-8b7cb.appspot.com",
        messagingSenderId: "704432871648"
    };
    firebase.initializeApp(config);
}