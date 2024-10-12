// Recuperation du DOM de nos elements form, input email, password, submit connexion et label
const formConnexion = document.querySelector(".login");
const Password = document.getElementById("password");
const btnConnexion = document.getElementById("btn-connexion");
const Email = document.getElementById("email");
let msgErreurEmail = document.createElement("div");
let msgErreurPassword = document.createElement("div");
const labelPassword = document.getElementById("label-password");
let SauvegardeEmail = Email.value;
let SauvegardePassword = Password.value;

// VERIFICATION SAISIE AU CLAVIER DE L'Email ET DU Mot De Passe

// 1. Verification saisie Email

// Creation fonction pour la verication du mail lors de la saisie
function verificationEmail(inputMail, elementMail, elementMsgErreurEmail, label) {
    let emailregExp = new RegExp("[a-z0-9._-]+@[a-z]+\\.[a-z]+");
    if (emailregExp.test(inputMail)) {
        elementMail.classList.remove("email");
        elementMsgErreurEmail.remove();
    } else if ((inputMail==="")||(inputMail===" ")) {
        elementMail.classList.remove("email");
        elementMsgErreurEmail.remove();
    }
    else {
        elementMail.classList.add("email");
        elementMsgErreurEmail.textContent = "Veuillez Entrer une addresse mail valide EX : devweb@projet.com";
        elementMsgErreurEmail.setAttribute("id", "msg-erreur-saisi-email");
        formConnexion.insertBefore(elementMsgErreurEmail, label);
    }
}

// Ecoute evenements lors de la saisie de l'email et verification en meme temps
Email.addEventListener("input", (inputevent) => {
    Email.classList.remove("email");
    msgErreurEmail.remove();
    verificationEmail(inputevent.target.value, Email, msgErreurEmail, labelPassword);
})

// Verification email lors du focus de l'imput email
Email.addEventListener("focusin", () => {
    verificationEmail(Email.value, Email, msgErreurEmail, labelPassword);
})

// Suppression du style de l'input email en dehors du focus
Email.addEventListener("focusout", () => {
    Email.classList.remove("email");
    msgErreurEmail.remove();
})

// 2. Verification saisie Mot de passe

// // Creation fonction pour la verication du mot de passe lors de la saisie
function verificationPassword(motDepasse, elementPassword, elementmsgErreurPassword, btn) {
    let passwordPresenceChiffre = new RegExp("[0-9]{1}");
    let passwordPresenceMinuscule = new RegExp("[a-z]{1}");
    let passwordPresenceMajuscule = new RegExp("[A-Z]{1}");
    let passwordAbsenceCaractereSpeciaux = new RegExp("[\\ \\+\\\\\%\\*\\#\\~\\&\\)\\(\\ù\\=\\.\\;\\§\\£\\$\\µ\\²\\ç\\/\\°\\@\\!\\_\\-\\<\\>\\`\\'\\\"\\^\\¨\\||\\{\\}\\\[\\\]\\?\\!\\:\\,\\à\\è\\é\\ù]");
    if ((motDepasse==="")) {
        elementPassword.classList.remove("password");
        elementmsgErreurPassword.remove();
    } else if (motDepasse.length < 5) { // verification du nombre de caracteres saisie pour le mot de passe
            elementPassword.classList.add("password");
            elementmsgErreurPassword.textContent = "Le mot de passe doit contenir au moins 5 caractères";
            elementmsgErreurPassword.setAttribute("id", "msg-erreur-saisi-password");
            formConnexion.insertBefore(elementmsgErreurPassword, btn);
    } else {
        if (passwordPresenceChiffre.test(motDepasse) && passwordPresenceMinuscule.test(motDepasse) && passwordPresenceMajuscule.test(motDepasse) && !(passwordAbsenceCaractereSpeciaux.test(motDepasse))) {
            elementPassword.classList.remove("password");
            elementmsgErreurPassword.remove();
            return false
        } else if (!(passwordPresenceChiffre.test(motDepasse))) { // verfification de la presence d'au moins un chiffre
            elementPassword.classList.add("password");
            elementmsgErreurPassword.textContent = "Le mot de passe doit contenir au moins un chiffre";
            elementmsgErreurPassword.setAttribute("id", "msg-erreur-saisi-password");
            formConnexion.insertBefore(elementmsgErreurPassword, btn);
            return false
        } else if (!(passwordPresenceMinuscule.test(motDepasse))) {  // verfification de la presence d'au moins d'une minuscule
            elementPassword.classList.add("password");
            elementmsgErreurPassword.textContent = "Le mot de passe doit contenir au moins une lettre minuscle";
            elementmsgErreurPassword.setAttribute("id", "msg-erreur-saisi-password");
            formConnexion.insertBefore(elementmsgErreurPassword, btn);
            return false
        } else if (!(passwordPresenceMajuscule.test(motDepasse))) {  // verfification de la presence d'au moins d'une majuscule
            elementPassword.classList.add("password");
            elementmsgErreurPassword.textContent = "Le mot de passe doit contenir au moins une lettre majuscule";
            elementmsgErreurPassword.setAttribute("id", "msg-erreur-saisi-password");
            formConnexion.insertBefore(elementmsgErreurPassword, btn);
            return false
        } else if (passwordAbsenceCaractereSpeciaux.test(motDepasse)) {   // verfification de l'absence des caracteres speciaux
            elementPassword.classList.add("password");
            elementmsgErreurPassword.textContent = "Le mot de passe ne doit pas contenir un caractere spécial ou des lettres avec accents";
            elementmsgErreurPassword.setAttribute("id", "msg-erreur-saisi-password");
            formConnexion.insertBefore(elementmsgErreurPassword, btn);
            return true
        }
    }
}

// Ecoute evenements lors de la saisie du mot de passe et verification en meme temps
Password.addEventListener("input", (inputevent) => {
    Password.classList.remove("password");
    msgErreurPassword.remove();
    verificationPassword(inputevent.target.value, Password, msgErreurPassword, btnConnexion);
})

// Verification mot de passe lors du focus de l'imput password
Password.addEventListener("focusin", () => {
    verificationPassword(Password.value, Password, msgErreurPassword, btnConnexion);
})

// Suppression du style de l'input password en dehors du focus
Password.addEventListener("focusout", () => {
    Password.classList.remove("password");
    msgErreurPassword.remove();
})

// RECUPERATION DE L'EMAIL ET DU MOT DE PASSE ET ENVOIE VERS L'API PAR LA METHODE POST POUR VERIFCATION

// Creation de la fonction POST pour la communication avec l'API
async function postJSON(data) {
    try {
      const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const resultat = await reponse.json();
      return resultat.token
    } catch (erreur) {
      console.error("Erreur :", erreur);
      return false
    }
  }

  // Recuperation de l'evenement submit lors de la soumission du formulaire sur le click du bouton se connecter
  formConnexion.addEventListener("submit", (event) => {
    event.preventDefault();
    // recuperation de l'email et du mot de passe
    const donnees = {
                email: event.target.querySelector("[name=email]").value,
                password: event.target.querySelector("[name=password").value
            };

        // envoie de l'email et du mot de passe vers l'API
        postJSON(donnees).then((value)=>{
            let tokenAuthentification = value; // recuperation du token de connexion
            console.log(value);
            const Email = document.getElementById("email");
            const Password = document.getElementById("password");
            const inputEmail = Email.value;
            const inputPassword = Password.value;
            // verification si le mail et le mot de passe sont bons
            if ((value === undefined)||(value === false))  {
                formConnexion.innerHTML = `
                    <label for="email">E-mail</label>
                    <input type="email" name="email" id="email" value="${inputEmail}">
                    <label id="label-password" for="password">Mot de passe</label>
                     <input type="password" name="password" id="password" value="${inputPassword}">
                    <input id="btn-connexion" type="submit" value="Se connecter">
                    <a href="#">Mot de passe oublié</a>
                 `
                const Email2 = document.getElementById("email");
                const Password2 = document.getElementById("password");
                const btnConnexion2 = document.getElementById("btn-connexion");
                const labelPassword2 = document.getElementById("label-password");
                let msgErreur2 = document.createElement("p");
                let msgErreurPassword2 = document.createElement("div");
                let msgErreurEmail2 = document.createElement("div");
                Email2.classList.add("email");
                Password2.classList.add("password");
                msgErreur2.textContent = "Adresse mail ou mot de passe incorrect";
                formConnexion.insertBefore(msgErreur2, btnConnexion2);

                document.body.addEventListener("click", () => {
                    Email2.classList.remove("email");
                    Password2.classList.remove("password");
                    msgErreur2.remove();
                })

                Password2.addEventListener("focusin", () => {
                    verificationPassword(Password2.value, Password2, msgErreurPassword2, btnConnexion2);
                })

                Password2.addEventListener("input", (inputevent) => {
                    verificationPassword(inputevent.target.value, Password2, msgErreurPassword2, btnConnexion2);
                })

                Password2.addEventListener("focusout", () => {
                    Password2.classList.remove("password");
                    msgErreurPassword2.remove();
                })

                Email2.addEventListener("focusin", () => {
                    verificationEmail(Email2.value, Email2, msgErreurEmail2, labelPassword2);
                })

                Email2.addEventListener("input", (inputevent) => {
                    verificationEmail(inputevent.target.value, Email2, msgErreurEmail2, labelPassword2);
                })

                Email2.addEventListener("focusout", () => {
                    Email2.classList.remove("email");
                    msgErreurEmail2.remove();
                })
            }

            else {
                localStorage.setItem("token", tokenAuthentification) // Enregistrement du token de connexion
                window.location.href = "index.html"; // redirection vers la page de modification
            }
        })
  })
  