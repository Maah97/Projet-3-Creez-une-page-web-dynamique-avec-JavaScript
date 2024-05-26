const reponse = await fetch('http://localhost:5678/api/works');
const travaux = await reponse.json();
let galerie = document.querySelector(".gallery");
galerie.innerHTML = ""
for (let i = 0; i < travaux.length; i++) {
    galerie.innerHTML += `
        <figure>
            <img src="${travaux[i].imageUrl}" alt="${travaux[i].title}">
            <figcaption>${travaux[i].title}</figcaption>
        </figure>
    `
}
console.log(galerie);
console.log(travaux);