import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': '{{ field }} é obrigatório (a)',
  'string': 'O valor do campo {{ field }} deve ser uma string.',
  'number': '{{ field }} deve ser um número.',
  'email': 'Atente, esse campo deve ser um email válido.',
  'database.unique': '{{ field }} já está em uso. Por favor, escolha outro.',
  'minLength': '{{ field }} precisa ter pelo menos {{ min }} caracteres.',
  'maxLength': '{{ field }} não pode ter mais de {{ max }} caracteres.',
  'date': '{{ field }} deve ser uma data válida.',
  'confirmed': '{{ field }} não esta igual nos dois campos',
  'regex': '{{ field }} está em um formato inválido.'
})
