import axios from 'axios'

export default class ScryfallService {
  private baseUrl = 'https://api.scryfall.com'

  async searchCardByName(name: string) {
    const url = `${this.baseUrl}/cards/search?q=${encodeURIComponent(name)}`
    const response = await axios.get(url)
    const data = response.data
    // Aqui pegamos apenas os atributos relevantes
    
    // Verifica se quais imagens estão disponíveis e escolhe uma
    // Exemplo: se image_uris estiver disponível, use-a; caso contrário, use outra propriedade

    let cards = data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      image: card.image_uris ? card.image_uris.png : (card.card_faces && card.card_faces[0].image_uris ? card.card_faces[0].image_uris.png : null),
      oracle_text: card.oracle_text,
      rarity: card.rarity,
      set_name: card.set_name,
    }))
    return { data: cards }

  }

  async getCardById(id: string) {
    const url = `${this.baseUrl}/cards/${id}`
    const response = await axios.get(url)
    const data = response.data

      let card = {
      id: data.id,
      name: data.name,
      image: data.image_uris ? data.image_uris.png : (data.card_faces && data.card_faces[0].image_uris ? data.card_faces[0].image_uris.png : null),
      oracle_text: data.oracle_text,
      rarity: data.rarity,
      set_name: data.set_name,
    }
    return { data: card }

  }
}
