// Seleciona o botão e o input na página
const button = document.querySelector('#buscar-palavra');
const input = document.querySelector('.input');
const resultadoDiv = document.querySelector('#resultado');
const tipoPalavra = document.querySelector('#tipo-palavra');
const significados = document.querySelector('#significados');
const etimologia = document.querySelector('#etimologia');
const favoritarButton = document.querySelector('.favoritar-button');
const removerButton = document.querySelector('.remover-button');
const palavrasFavoritasList = document.querySelector('#palavrasFavoritasList');

// Põe a primeira letra maiúscula
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Adiciona um evento de clique ao botão
button.addEventListener('click', () => {
  realizarBusca();
});

// Adiciona um evento de teclado ao input
input.addEventListener('keydown', event => {
  // Verifica se a tecla pressionada é Enter
  if (event.key === 'Enter') {
    realizarBusca();
  }
});

// Função para realizar a busca
function realizarBusca() {
  // Captura o valor do input
  const palavra = input.value;

  // Monta a URL da API com a palavra digitada
  const url = `https://dicio-api-ten.vercel.app/v2/${palavra}/`;

  // Faz a requisição à API
  fetch(url)
    .then(response => {
      if (response.status === 400) {
        alert(palavra + ' não encontrada');
        location.reload();
      }
      return response.json();
    })
    .then(data => {
      // Limpa o conteúdo anterior da div de resultado
      resultadoDiv.innerHTML = '';

      // Cria os elementos para exibir o resultado
      data.forEach(item => {
        const partOfSpeech = document.createElement('p');
        partOfSpeech.textContent = `Tipo de palavra: ${item.partOfSpeech}`;
        partOfSpeech.classList.add('text-secondary');

        const meanings = document.createElement('p');
        meanings.textContent = `Significados: ${item.meanings.join(', ')}`;
        meanings.classList.add('text-secondary');

        const etymology = document.createElement('p');
        etymology.textContent = `Etimologia: ${item.etymology}`;
        etymology.classList.add('text-secondary');

        // Adiciona os elementos à div de resultado
        resultadoDiv.appendChild(partOfSpeech);
        resultadoDiv.appendChild(meanings);
        resultadoDiv.appendChild(etymology);
      });

      // Verifica se a palavra já está nos favoritos
      const palavrasFavoritas = JSON.parse(localStorage.getItem('palavrasFavoritas')) || [];
      const isFavorita = palavrasFavoritas.includes(palavra);

      // Atualiza a exibição dos botões
      if (isFavorita) {
        favoritarButton.style.display = 'none';
        removerButton.style.display = 'block';
      } else {
        favoritarButton.style.display = 'block';
        removerButton.style.display = 'none';
      }
    })
    .catch(error => console.error(error));
}

// Adiciona um evento de clique ao botão "Favoritar"
favoritarButton.addEventListener('click', () => {
  const palavraFavoritada = input.value;
  const palavrasFavoritas = JSON.parse(localStorage.getItem('palavrasFavoritas')) || [];
  palavrasFavoritas.push(palavraFavoritada);
  localStorage.setItem('palavrasFavoritas', JSON.stringify(palavrasFavoritas));
  favoritarButton.style.display = 'none';
  removerButton.style.display = 'block';
  alert(capitalizeFirstLetter(palavraFavoritada) + ' favoritado!');
});

// Adiciona um evento de clique ao botão "Remover"
removerButton.addEventListener('click', () => {
  const palavraRemovida = input.value;
  const palavrasFavoritas = JSON.parse(localStorage.getItem('palavrasFavoritas')) || [];
  const index = palavrasFavoritas.indexOf(palavraRemovida);
  if (index > -1) {
    palavrasFavoritas.splice(index, 1);
    localStorage.setItem('palavrasFavoritas', JSON.stringify(palavrasFavoritas));
    favoritarButton.style.display = 'block';
    removerButton.style.display = 'none';
    alert(capitalizeFirstLetter(palavraRemovida) + ' removido dos favoritos!');
  }
});

// Exibe as palavras favoritas ao abrir o modal
$('#modalPalavrasFavoritas').on('show.bs.modal', function () {
  const palavrasFavoritas = JSON.parse(localStorage.getItem('palavrasFavoritas')) || [];
  palavrasFavoritasList.innerHTML = '';

  if (palavrasFavoritas.length === 0) {
    palavrasFavoritasList.textContent = 'Nenhuma palavra favoritada ainda.';
  } else {
    palavrasFavoritas.forEach(palavra => {
      const palavraElement = document.createElement('p');
      const linkElement = document.createElement('a'); // Creating link element
      linkElement.href = '#'; // Setting href attribute to #
      linkElement.textContent = capitalizeFirstLetter(palavra); // Setting link text
      linkElement.addEventListener('click', () => { // Adding click event listener to the link
        input.value = palavra; // Set input value to the clicked word
        realizarBusca(); // Perform search
        $('#modalPalavrasFavoritas').modal('hide'); // Hide the modal
      });
      palavraElement.appendChild(linkElement); // Appending the link element to the paragraph
      palavraElement.classList.add('text-secondary');
      palavrasFavoritasList.appendChild(palavraElement);
    });
  }
});