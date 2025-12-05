function togglePasswordVisibility(inputId, show) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = show ? "text" : "password";
    }
}

// Quando o email for igual ao placeholder, limpar o campo ao tirar o foco
document.getElementById('email').addEventListener('blur', function() {
    if (this.value === this.placeholder) {
        this.value = '';
    }
});