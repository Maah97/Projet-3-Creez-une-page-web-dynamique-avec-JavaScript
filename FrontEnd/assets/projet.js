// Appels à l'API et recuperation des données
const reponseWorks = await fetch('http://localhost:5678/api/works');
const travaux = await reponseWorks.json();

// recuperation de la div galellery du html
let galerie = document.querySelector(".gallery");

// creation fonction affichage de la galerie
function Afficher(projets) {
    galerie.innerHTML = "";
    for (let i = 0; i < projets.length; i++) {
        galerie.innerHTML += `
            <figure>
                <img src="${projets[i].imageUrl}" alt="${projets[i].title}">
                <figcaption>${projets[i].title}</figcaption>
            </figure>
        `
    }
}

// chargement des travaux de l'api et suppression des travaux du html 
Afficher([...new Set(travaux)]);

// PARTIE filtre par categories

// Declaration des variables pour la selection des boutons
const btnTousLesCategories = document.querySelector(".btn-tous-les-Categories");
const btnObjets = document.querySelector(".btn-Objets");
const btnAppartements = document.querySelector(".btn-appartements");
const btnHotelsEtRestaurant = document.querySelector(".btn-hotels-et-restaurant");

// Ecoute des evenements click des boutons des categories

// Filtre de tous les categories
btnTousLesCategories.addEventListener("click", () => {
    Afficher([...new Set(travaux)]);
});

// Filtre des objets
btnObjets.addEventListener("click", () => {
    const travauxObjets = travaux.filter(function (travaux){
        return travaux.categoryId === 1;
    })
    
    Afficher([...new Set(travauxObjets)]);
});

// Filtre des appartements
btnAppartements.addEventListener("click", () => {
    const travauxAppartements = travaux.filter(function (objet){
        return objet.categoryId === 2;
    })
    
    Afficher([...new Set(travauxAppartements)]);
});

// Filtre des Hotels et restaurant
btnHotelsEtRestaurant.addEventListener("click", () => {
    const travauxHotelsEtRestaurant = travaux.filter(function (travaux){
        return travaux.categoryId === 3;
    })
    
    Afficher([...new Set(travauxHotelsEtRestaurant)]);
});
