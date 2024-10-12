// recuperation du token d'authentifaction obtenu de la page de connexion
let tokenAuthentification = localStorage.getItem("token");
console.log(tokenAuthentification);

// Appels à l'API et recuperation des données
let reponseWorks = await fetch('http://localhost:5678/api/works');
let reponseCategories = await fetch('http://localhost:5678/api/categories');
let travaux = await reponseWorks.json();
console.log(travaux);
let categoriesAPI = await reponseCategories.json();
let categoriesAPImapName = categoriesAPI.map(categorieAPI => categorieAPI.name);
let categoriesAPImapId = categoriesAPI.map(categorieAPI => categorieAPI.id);
let categories = [...new Set(categoriesAPImapName)];
let categoriesId = [...new Set(categoriesAPImapId)];

// recuperation de la div categorie et de la div galellery du html
const galerie = document.querySelector(".gallery");
const divCategorie = document.querySelector(".categories");

// creation fonction affichage de la galerie
function Afficher(projets) {
    galerie.innerHTML = "";
    for (let i = 0; i < projets.length; i++) {
        galerie.innerHTML += `
            <figure>
                <img id="img-${projets[i].id}" src="${projets[i].imageUrl}" alt="${projets[i].title}">
                <figcaption>${projets[i].title}</figcaption>
            </figure>
        `
    }
}

// chargement des travaux de l'api et suppression des travaux du html 
Afficher(travaux);

// PARTIE EDITION SI TENTATIVE DE CONNEXION REUSSIE
 if ((tokenAuthentification === undefined)||(tokenAuthentification === false)||(tokenAuthentification === null)) {
     // PARTIE filtre par categories
     
     // Declaration de la variable pour la selection du bouton toutes les catgories
     const btnTousLesCategories = document.querySelector(".btn-tous-les-Categories");
     document.body.addEventListener("onload", () => {
        btnTousLesCategories.focus();
     });

     // Affichage de tous les categories
     btnTousLesCategories.addEventListener("click", () => {
        Afficher(travaux);
    });
     
    // Creation des boutons des categories et Ecoute des evenements click des boutons des categories
    for (let i = 0; i < categories.length; i++) {
         let btnCategorie = document.createElement("button");
         btnCategorie.textContent = categories[i];
         divCategorie.appendChild(btnCategorie);
         btnCategorie.addEventListener("click", () => {
             const filtreTravaux = travaux.filter(function (travaux){
                 return travaux.categoryId === categoriesId[i];
            })
            Afficher([...new Set(filtreTravaux)]);
         })
    }
 } else { // Changement en mode d'edition de la page d'accueil si l'authentification est vrai

    // Recuperation des elements du DOM
    const container = document.querySelector(".main-container");
    const navBarEdit = document.getElementById("nav-bar-edit");
    const lienlogout = document.getElementById("login-logout");
    const btnModifier = document.querySelector(".btn-modifier");

    // Application et suppression des classes pour changer l'apparence du site
    navBarEdit.classList.remove("masquer");
    lienlogout.textContent = "logout"
    container.classList.add("main-container-page-edit");
    btnModifier.classList.remove("invisible");
    divCategorie.classList.add("btn-inactive");
    lienlogout.addEventListener("click", () => {
        localStorage.removeItem("token");
    })
 }

 
 // GESTION DES MODALS

 // 1. Déclaration des variables

 let modal = null; // initialisation du container de la modal
 let formData = new FormData(); // declaration de la variable formData pour l'envoie du formulaire de la modal

 // 2. Gestion ouverture et fermeture des modals
 const lienOuvertureModal = document.getElementById("lien-modal");

// Création fonction ouverture modal
const openModal = async function (e) {
    e.preventDefault();
    // Déclaration des variables
    const target = e.target.parentElement.getAttribute("href");
    modal = await loadModal(target);
    const modalGaleriePhoto = modal.querySelector("#modal-galerie-photo");
    const modalAjoutPhoto = modal.querySelector("#modal-ajout-photo")
    const btnAjoutPhoto = modal.querySelector(".btn-ajout-photo");
    const retourAuModalGalerie = modal.querySelector("#retour")
    const btnFermetureModal = modal.querySelectorAll("#btn-fermeture-modal");
    const containerModals = modal.querySelectorAll(".container");

    // affichage de la modal de galerie de photo en jouant sur les valeurs des display des modals et avec des classes CSS
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modalGaleriePhoto.classList.remove("galerie-photo");
    modalAjoutPhoto.classList.add("ajout-photo");
    AfficherTravauxDansLeModal();

    // Gestion d'ajout de travai dans l'API et dans la galerie

    // declaration du bouton d'ajout de travail et de l'ensemble des elements qui entrent dans le cadre de l'ajout de travail
    const formAjoutWork = modal.querySelector(".titre-categorie-image"); // recuperation de l'element form du DOM
    const labelCategorie = modal.querySelector(".categorie"); // recuperation de l'element label categorie
    const btnAjoutPhotoTravail = modal.querySelector("#ajout-photo-work"); // recuperation de l'element bouton pour charger une nouvelle image
    let titreWork = modal.querySelector("#titre"); // recuperation de l'element input du titre

    // creation de l'element select de la categorie s'il n'existe pas
    let hr = modal.querySelector(".hr"); // recuperation de l'element bar horizontal 
    if (!modal.querySelector("#categorie")){
        let sel = document.createElement("select"); // creation de l'element select
        sel.setAttribute("name", "categorie");
        sel.setAttribute("id", "categorie");
        sel.setAttribute("class", "border");
        sel.classList.add("style-no-error")
        sel.setAttribute("required", true);
        formAjoutWork.insertBefore(sel, hr); // insertion avant la barre horizontal
        let optVide = document.createElement("option"); // creation d'un element option vide
        optVide.setAttribute("value", "");
        sel.appendChild(optVide);
        for (let i = 0; i < categories.length; i++) { // creation des options de selection de categorie presents dans l'API
            let opt = document.createElement("option");
            opt.setAttribute("value", `${categoriesId[i]}`);
            opt.textContent = `${categories[i]}`;
            sel.appendChild(opt);
        }
    }
    let categorieWork = modal.querySelector("#categorie"); // recuperation de l'element select de la categorie
    titreWork.value = "";
    categorieWork.value = "";
    // Creation dans le DOM de l'element paragraphe pour afficher le msg d'avertissement en cas d'un mauvais saisi
    if (modal.querySelectorAll(".msg-erreur").length === 0) {
        let p0 = document.createElement("p"); // creation dans le DOM de l'element paragraphe pour afficher le msg en cas de mauvaise selection du fichier image
        p0.classList.add("msg-erreur");
        p0.setAttribute("id", "msg-erreur-image");
        modal.querySelector(".fichier-photo").appendChild(p0);
        let p1 = document.createElement("p"); // Creation dans le DOM de l'element paragraphe pour afficher le msg d'avertissement en cas d'un mauvais saisi du titre
        p1.classList.add("msg-erreur");
        p1.setAttribute("id", "msg-erreur-titre");
        formAjoutWork.insertBefore(p1, labelCategorie); 
        let p2 = document.createElement("p"); // Creation dans le DOM de l'element paragraphe pour afficher le msg d'avertissement en cas d'un mauvais saisi de la categorie
        p2.classList.add("msg-erreur");
        p2.setAttribute("id", "msg-erreur-catgeorie");
        formAjoutWork.insertBefore(p2, hr);
    }
    let msgErreurImage = document.querySelector("#msg-erreur-image"); // message en cas d'une mauvaise selection du fichier image
    let msgErreurTitre = modal.querySelector("#msg-erreur-titre"); // message erreur en cas d'un mauvais saisi du titre
    let msgErreurCategorie = modal.querySelector("#msg-erreur-catgeorie"); // message erreur en cas de categorie vide
    let regexTitreValue = new RegExp("^[a-z0-9A-Z_\\&-]+$"); // creation de regex pour verifier l'expression du titre
    let cat = null; 
    let tit = null;
    
    // ajout de la photo du fichier selectionné
    btnAjoutPhotoTravail.addEventListener("change", chargementImageSelectionne);

    // reception dynamique des donnees du formulaire puis gestion d'activation du bouton valider

    // recuperation du DOM du bouton valider
    const btnValider = modal.querySelector(".btn-valider-ajout-image");

    // reception du titre du projet et verification de son expression
    titreWork.addEventListener("input", (inputevent) => {
        msgErreurTitre.style.display = "none";
        tit = inputevent.target.value;
        verificationTitre(inputevent.target.value, msgErreurTitre, titreWork);
        if((regexTitreValue.test(tit) && tit !== null && tit !== undefined && tit !== "") && (cat !== "" && cat !== undefined && cat !== null) && (modal.querySelector("#ajout-photo-work").files.length === 1)){
            btnValider.removeAttribute("disabled");
        } else {
            btnValider.setAttribute("disabled", true);
        }
    });

    // reception de la categorie du projet et verification de son expression
    categorieWork.addEventListener("change", (inputevent) => {
        msgErreurCategorie.style.display = "none";
        cat = inputevent.target.value;
        tit = titreWork.value;
        console.log(inputevent.target.value);
        console.log(tit);
        verificationCategorie(inputevent.target.value, msgErreurCategorie, categorieWork);
        if((cat !== "" && cat !== undefined && cat !== null) && (regexTitreValue.test(tit) && tit !== null && tit !== undefined && tit !== "") && (modal.querySelector("#ajout-photo-work").files.length === 1)){
            btnValider.removeAttribute("disabled");
        } else {
            btnValider.setAttribute("disabled", true);
        }
    });

    if((regexTitreValue.test(tit) && tit !== null && tit !== undefined && tit !== "") && (cat !== "" && cat !== undefined && cat !== null) && (modal.querySelector("#ajout-photo-work").files.length === 1)){
        btnValider.removeAttribute("disabled");
    } else {
        btnValider.setAttribute("disabled", true);
    }

    // affichage de la modal ajouter photo au clique du bouton ajouter photo dans la modal galerie photo
    btnAjoutPhoto.addEventListener("click", () => {
        modalGaleriePhoto.classList.add("galerie-photo");
        modalAjoutPhoto.classList.remove("ajout-photo");
        modal.querySelector(".icone-image").style.display = null;
        modal.querySelector(".upload-file").style.display = null;
        modal.querySelector(".txt-type-fichier-taille-max").style.display = null;
        msgErreurImage.style.display = "none";
        msgErreurCategorie.style.display = "none";
        msgErreurTitre.style.display = "none";
        titreWork.classList.remove("style-erreur");
        categorieWork.classList.remove("style-erreur");
        modal.querySelector("#ajout-photo-work");
        titreWork.value = "";
        categorieWork.value = "";
        tit = null;
        cat = null;
        formAjoutWork.reset();
        btnValider.setAttribute("disabled", true);
        if(modal.querySelector(".img-selectionne")){
            modal.querySelector(".img-selectionne").remove();
        };
    });

    // Re-affichage de la modal galerie photo au click sur la fleche de retour presente dans la modal ajouter photo 
    retourAuModalGalerie.addEventListener("click", () => {
        modalGaleriePhoto.classList.remove("galerie-photo");
        modalAjoutPhoto.classList.add("ajout-photo");
    });

    // Fermeture entier de tous les modals au clique sur la croix de fermeture
    for (let i = 0; i < btnFermetureModal.length; i++) {
        btnFermetureModal[i].addEventListener("click", closeModal);
        containerModals[i].addEventListener("click", stopPropagation);
    }

    // fermeture de la modal au clique en dehors des modals focus
    modal.addEventListener("click", closeModal);

    // Envoie des donnees du formulaire pour l'ajout à l'API et creation d'un nouveau projet dans le DOM
    formAjoutWork.addEventListener("submit", (event) => {
        event.preventDefault();
        formData.append("title", titreWork.value);
        formData.append("category", categorieWork.value);
        formData.append("image", modal.querySelector("#ajout-photo-work").files[0], modal.querySelector("#ajout-photo-work").files[0].name);
        postForm(formData).then(async (value) => {
            if ((value === undefined)||(value === false)) {
                console.error("L'ajout de travail n'a pas été effectué");
            } else {
                console.log(value);
                reponseWorks = await fetch('http://localhost:5678/api/works');
                travaux = await reponseWorks.json();
                Afficher(travaux);
                AfficherTravauxDansLeModal();
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");
                modal.removeAttribute("aria-modal");
                modal.querySelector("#valider").setAttribute("disabled", true);
                for (let i = 0; i < modal.querySelectorAll("#btn-fermeture-modal").length; i++) {
                    modal.querySelectorAll("#btn-fermeture-modal")[i].removeEventListener("click", closeModal);
                    modal.querySelectorAll(".container")[i].removeEventListener("click", stopPropagation);
                }
                modal.removeEventListener("click", closeModal);
                modal = null;
                const navBarEdit = document.getElementById("nav-bar-edit");
                navBarEdit.style.cursor = "pointer"
                navBarEdit.addEventListener("click", () => {
                    localStorage.removeItem("token");
                    window.location.href = "index.html"
                })
                formData.delete("title");
                formData.delete("category");
                formData.delete("image");
                formAjoutWork.reset();
                formAjoutWork.removeEventListener("submit", (event));
            }
        })
    });
}

// Creation de la fonction qui permet d'afficher et de supprimer les photos dans la modal galerie photo
async function AfficherTravauxDansLeModal() {
    const galerieModal = modal.querySelector(".galerie-modal");
    galerieModal.innerHTML = ""
    for (let i = 0; i < travaux.length; i++) {
        let figure = document.createElement("figure");
        let img = document.createElement("img");
        img.setAttribute("src", travaux[i].imageUrl);
        let div = document.createElement("div");
        div.setAttribute("class", "icone-supprimer-photo");
        let icone = document.createElement("i");
        icone.setAttribute("class", "fa-solid fa-trash-can fa-2xs");
        icone.setAttribute("id", `icone-${travaux[i].id}`)
        figure.setAttribute("id", `figure-${travaux[i].id}`)
        div.appendChild(icone);
        figure.appendChild(img);
        figure.appendChild(div);
        galerieModal.appendChild(figure);
        icone.addEventListener("click", () => {
            supprimerPhoto(travaux[i].id);
        })
    }
}

// creation de la fonction permettant d'afficher l'image selectionné
const chargementImageSelectionne = function (e) {
    e.preventDefault();
    let fichierSelectionne = modal.querySelector("#ajout-photo-work").files;
    if (fichierSelectionne.length === 0) {
        let msgNonSelectionDeFichier = document.createElement("p");
        msgNonSelectionDeFichier.textContent = "Pas de fichier selectionné pour le chargement";
        modal.querySelector(".fichier-photo").appendChild(msgNonSelectionDeFichier);
        return false
    } else {
            if (verificationTypeFichier(fichierSelectionne[0]) && verificationTailleImage(fichierSelectionne[0])) {
                modal.querySelector(".icone-image").style.display = "none";
                modal.querySelector(".upload-file").style.display = "none";
                modal.querySelector("#msg-erreur-image").style.display = "none";
                modal.querySelector(".txt-type-fichier-taille-max").style.display = "none";
                modal.querySelector("#titre").value = fichierSelectionne[0].name.split(".")[0];
                let imgSelectionne = document.createElement("img");
                imgSelectionne.src = window.URL.createObjectURL(fichierSelectionne[0]);
                imgSelectionne.classList.add("img-selectionne");
                modal.querySelector(".fichier-photo").appendChild(imgSelectionne);
                modal.querySelector(".fichier-photo").style.justifyContent = "center";
                let regexTitreValue = new RegExp("^[a-z0-9A-Z_\\&-]+$");
                let cat = modal.querySelector("#categorie").value;
                let tit = modal.querySelector("#titre").value;
                let btnValider = modal.querySelector(".btn-valider-ajout-image");
                if((regexTitreValue.test(tit) && tit !== null && tit !== undefined && tit !== "") && (cat !== "" && cat !== undefined && cat !== null) && (modal.querySelector("#ajout-photo-work").files.length === 1)){
                    btnValider.removeAttribute("disabled");
                } else {
                    btnValider.setAttribute("disabled", true);
                }
                return true
            }  else if (!verificationTypeFichier(fichierSelectionne[0]) || !verificationTailleImage(fichierSelectionne[0])) {
                modal.querySelector("#msg-erreur-image").textContent = "La taille ou le type d'image n'est pas correct";
                modal.querySelector("#msg-erreur-image").style.display = null;
                return false
            }
    }
}

// creation fonction pour la verification du type de fichier image
function verificationTypeFichier(file) {
    let fileTypesImage = ["image/jpg", "image/png"];
    for (let i = 0; i < fileTypesImage.length; i++) {
        if (file.type === fileTypesImage[i]) {
          return true;
        }
    }
    
    return false;
}

// creation fonction pour la verification de la taille de l'image
function verificationTailleImage(file) {
    if (file.size <= 4000000) {
        return true
    }    

    return false
}

// creation fonction verification titre
function verificationTitre(titre, msg, inputTitre) {
    let title = new RegExp("^[a-z0-9A-Z.\\&_-]+$");
    if (title.test(titre)) {
        msg.style.display = "none";
        inputTitre.classList.remove("style-erreur");
        return true
        
    } else if (titre==="") {
        inputTitre.classList.add("style-erreur");
        msg.style.display = null;
        msg.textContent = "Ce champ est obligatoire";
        return false
    }
    else {
        inputTitre.classList.add("style-erreur");
        msg.style.display = null;
        msg.textContent = "Le titre ne doit pas contenir de caractere spécial";
        return false
    }
}

// creation fonction verification categorie
function verificationCategorie(categorie, msg, selectCategorie) {
    if (categorie === "") {
        selectCategorie.classList.add("style-erreur");
        msg.style.display = null;
        msg.textContent = "Ce champ est obligatoire";
        return true
    } else {
        msg.style.display = "none";
        selectCategorie.classList.remove("style-erreur");
        return false
    }
}

// Création de la fonction pour l'envoie de demande de suppression dans l'API
async function deleteJSON(dataId) {
    try {
        const actionDelete = await fetch(`http://localhost:5678/api/works/${dataId}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${tokenAuthentification}`
         },
        });
        return actionDelete.ok
      } catch (erreur) {
        console.error("Erreur :", erreur);
        return false
    }
}

// creation de la fonction pour l'ajout de travail dans l'API en utilisant la méthode POST 
async function postForm(data) {
    try {
      const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${tokenAuthentification}`
        },
        body: data,
      });
      const resultat = await reponse.json();
      return resultat
    } catch (erreur) {
      console.error("Erreur la requete n'a pas été envoyé");
      return false
    }
  } 

// Création de la fonction de suppression des photos dans la modal galerie photo
async function supprimerPhoto(id) {
    if (id) {
        deleteJSON(id).then(async (value) => {
            console.log(value);
            if (value === true) {
                const elementToDelete = modal.querySelector(`#figure-${id}`);
                elementToDelete.remove();
                reponseWorks = await fetch('http://localhost:5678/api/works');
                travaux = await reponseWorks.json();
                Afficher(travaux);
                AfficherTravauxDansLeModal();
            } else{
                console.error("Erreur : suppression non effectué car l'API a renvoyé la valeur", value);
            }
        });
    }
}

// création fonction de fermeture des modals
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.querySelector("#valider").setAttribute("disabled", true);
    modal.querySelector("#ajout-photo-work");
    modal.querySelector("#titre").value = "";
    modal.querySelector("#categorie").value = "";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.querySelector(".titre-categorie-image").reset();
    modal.querySelector(".titre-categorie-image").removeEventListener("submit",(e));
    for (let i = 0; i < modal.querySelectorAll("#btn-fermeture-modal").length; i++) {
        modal.querySelectorAll("#btn-fermeture-modal")[i].removeEventListener("click", closeModal);
        modal.querySelectorAll(".container")[i].removeEventListener("click", stopPropagation);
    }
    modal.removeEventListener("click", closeModal);
    modal = null;
}

// fonction stop propagation
const stopPropagation = function (e) {
    e.stopPropagation();
}

// Extraction du code html du modal dans la page modal.html et son ajout dans la page principale
const loadModal = async function (url) {
    const target = "#" + url.split("#")[1];
    const existingModal = document.querySelector(target);
    if (existingModal !== null) return existingModal
    const html = await fetch(url).then(reponse => reponse.text());
    const element = document.createRange().createContextualFragment(html).querySelector(target);
    if (element === null) throw `l'élement ${target} n'a pas été trouvé dans la page ${url}`
    document.body.append(element);
    return element
}
 
// Execution ouverture modal au clique sur le bouton modifier
lienOuvertureModal.addEventListener("click", openModal);