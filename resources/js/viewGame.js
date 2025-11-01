
//evento para confimmar deleção de jogo
document.getElementsByName('delete_game').forEach(function(element) {
    element.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link

    // Exibe uma caixa de confirmação
    const userConfirmed = confirm('Você tem certeza que deseja deletar este jogo? Esta ação não pode ser desfeita.');

    // Se o usuário confirmar, redireciona para o link de deleção
    if (userConfirmed) {
        window.location.href = this.href;
    }
});
});