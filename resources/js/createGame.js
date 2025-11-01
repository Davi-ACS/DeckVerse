
//select raridade do jogo
const rarityGame = document.getElementById('rarity_game');

// input hidden para armazenar todas as raridades criadas 
const rarityGameInput = document.getElementById('rarity_game_id');

//evento de adicionar raridade
document.getElementById('add_rarity').addEventListener('click', function() {
    // prompt para o usuário inserir uma nova raridade
    const newRarity = prompt('Digite a nova raridade do jogo:');
    if (newRarity) {
        const option = document.createElement('option');
        option.value = newRarity;
        option.text = (rarityGame.options.length) + ": " + newRarity;
        rarityGame.add(option);

        alert("Raridade adicionada: " + newRarity);
    }
});

//evento de remover raridade
document.getElementById('remove_rarity').addEventListener('click', function() {
    const selectedRarity = rarityGame.value;
    if (selectedRarity) {
        rarityGame.remove(rarityGame.selectedIndex);

        //atualizar os textos das opções para refletir a nova ordem
        Array.from(rarityGame.options).forEach((opt, index) => {
            if (opt.value !== "")
                opt.text = index + ": " + opt.value;
        });


        // atualizar o input hidden removendo a raridade selecionada
        const rarities = rarityGameInput.value.split(" ").filter(rarity => rarity !== selectedRarity && rarity !== "");
        rarityGameInput.value = rarities.join(" ") + " ";

        alert("Raridade removida: " + selectedRarity);
    }
});

//evento para diminuir a prioridade da raridade
document.getElementById('add_priority_rarity').addEventListener('click', function() {
    const selectedIndex = rarityGame.selectedIndex;
    if (selectedIndex > 0) {
        const option = rarityGame.options[selectedIndex];
        rarityGame.remove(selectedIndex);
        rarityGame.add(option, selectedIndex - 1);

        //atualizar os textos das opções para refletir a nova ordem
        Array.from(rarityGame.options).forEach((opt, index) => {
            if (opt.value !== "")
                opt.text = index + ": " + opt.value;
        });

        // atualizar o input hidden refletindo a nova ordem das raridades
        const rarities = Array.from(rarityGame.options).map(option => option.value);
        rarityGameInput.value = rarities.join(" ") + " ";

        alert("Prioridade da raridade diminuída: " + option.value);
    }
});

// Fim do código para gerenciar raridades do jogo

//select idioma do jogo
const languageGame = document.getElementById('language_game');

// input hidden para armazenar todas os idiomas criados 
const languageGameInput = document.getElementById('language_game_id');

//evento de adicionar idioma
document.getElementById('add_language').addEventListener('click', function() {
    // prompt para o usuário inserir um novo idioma
    const newLanguage = prompt('Digite o novo idioma do jogo:');
    if (newLanguage) {
        const option = document.createElement('option');
        option.value = newLanguage;
        option.text = newLanguage;
        languageGame.add(option);

        alert("Idioma adicionado: " + newLanguage);
    }
});

//evento de remover idioma
document.getElementById('remove_language').addEventListener('click', function() {
    const selectedLanguage = languageGame.value;
    if (selectedLanguage) {
        languageGame.remove(languageGame.selectedIndex);

        // atualizar o input hidden removendo o idioma selecionado
        const languages = languageGameInput.value.split(" ").filter(language => language !== selectedLanguage && language !== "");
        languageGameInput.value = languages.join(" ") + " ";
        
        alert("Idioma removido: " + selectedLanguage);
    }
});

// evento antes de enviar o formulário para garantir que os inputs hidden estejam atualizados
document.getElementById('save_game').addEventListener('click', function(event) {
    // atualizar o input hidden de raridades
    const rarities = Array.from(rarityGame.options).map(option => option.value);
    rarityGameInput.value = rarities.join(" ") + " ";

    // atualizar o input hidden de idiomas
    const languages = Array.from(languageGame.options).map(option => option.value);
    languageGameInput.value = languages.join(" ") + " ";
});