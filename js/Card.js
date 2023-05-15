class Card {

  constructor(nombre, edad, numCel, texCel, numCed, texCed, tipo, contenedor ){
    this.nombre = nombre;
    this.edad = edad;
    this.numCel = numCel;
    this.texCel = texCel;
    this.numCed = numCed;
    this.texCed = texCed;
    this.tipo = tipo;
    this.contenedor = contenedor;

  }


  crearCard(){

    const card = document.createElement('div');
    card.className = 'card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card__header';

    const img = document.createElement('img');
    img.className = 'card__img';


    const cardNameContainer = document.createElement('div');
    cardNameContainer.className = 'card__name-container';

    const cardName = document.createElement('p');
    cardName.className = 'card__name';
    cardName.textContent = this.nombre;

    const cardData = document.createElement('p');
    cardData.className = 'card__data';
    cardData.textContent = this.edad;


    const cardBody = document.createElement('div');
    cardBody.className = 'card__body';

    const cardFirstContainer = document.createElement('div');
    cardFirstContainer.className = 'card__first-container';

    const cardFirst = document.createElement('p');
    cardFirst.className = 'card__first';
    cardFirst.textContent = this.numCel

    const cardFirstText = document.createElement('p');
    cardFirstText.className = 'card__first-text';
    cardFirstText.textContent = this.texCel

    const cardSecondContainer = document.createElement('div');
    cardSecondContainer.className = 'card__second-container';

    const cardSecondLeft = document.createElement('div');
    cardSecondLeft.className = 'card__second-left';

    const cardSecond = document.createElement('p');
    cardSecond.className = 'card__second';
    cardSecond.textContent = this.numCed;


    const cardSecondText = document.createElement('p');
    cardSecondText.className = 'card__second-text';
    cardSecondText.textContent = this.texCed;


    const cardTipeContainer = document.createElement('div');
    cardTipeContainer.className = 'card__tipe-container';

    const cardTipeText = document.createElement('p');
    cardTipeText.className = 'card__tipe-text';
    cardTipeText.textContent = this.tipo


    // añadiendo los divs dendro de otros

    this.contenedor.appendChild(card)
    
    card.appendChild(cardHeader)
    card.appendChild(cardBody)

    cardHeader.appendChild(img)
    cardHeader.appendChild(cardNameContainer)
    cardNameContainer.appendChild(cardName)
    cardNameContainer.appendChild(cardData)


    cardBody.appendChild(cardFirstContainer)
    cardBody.appendChild(cardSecondContainer)


    cardFirstContainer.appendChild(cardFirst)
    cardFirstContainer.appendChild(cardFirstText)


    cardSecondContainer.appendChild(cardSecondLeft)
    cardSecondLeft.appendChild(cardSecond)
    cardSecondLeft.appendChild(cardSecondText)
    cardSecondContainer.appendChild(cardTipeContainer)
    cardTipeContainer.appendChild(cardTipeText)


  }

}

export default Card