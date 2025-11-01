
//evento para confimmar deleção de carta
document.getElementById('delete_card').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o comportamento padrão do link

    // Exibe uma caixa de confirmação
    const userConfirmed = confirm('Você tem certeza que deseja deletar esta Carta? Esta ação não pode ser desfeita.');

    // Se o usuário confirmar, redireciona para o link de deleção
    if (userConfirmed) {
        window.location.href = this.href;
    }
});
