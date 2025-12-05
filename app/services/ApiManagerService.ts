import axios from 'axios'

export default class ApiManagerService {
  private baseUrlMagic = 'https://api.scryfall.com'
  private baseUrlYugioh = 'https://db.ygoprodeck.com/api/v7'

  private transformMagicCards(data: any) {
    if (!data.data || !Array.isArray(data.data)) {
      return []
    }
    return data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      image: card.image_uris ? card.image_uris.png : (card.card_faces && card.card_faces[0].image_uris ? card.card_faces[0].image_uris.png : null),
      oracle_text: card.oracle_text,
      rarity: card.rarity,
      set_name: card.set_name,
    }))
  }

  private transformYugiohCards(data: any, setCode: string = '') {
    const cardsArray = Array.isArray(data) ? data : (data.data || [])
    
    if (!Array.isArray(cardsArray)) {
      return []
    }
    
    return cardsArray.map((card: { card_sets: { set_name: any; set_code: any; set_rarity: any; set_price: any }[]; id: any; name: any; card_images: any[]; desc: any }) => {
      let cardSets = card.card_sets || []
      
      // Se um setCode específico foi fornecido, filtra apenas esse set
      if (setCode && cardSets.length > 0) {
        cardSets = cardSets.filter((set: any) => set.set_code === setCode)
      }
      
      return cardSets.map((set: { set_name: any; set_code: any; set_rarity: any; set_price: any }) => ({
        id: card.id + '_' + set.set_code,
        name: card.name,
        oracle_text: card.desc,
        image: card.card_images && card.card_images.length > 0 ? card.card_images[0].image_url : null,
        set_name: set.set_name,
        rarity: set.set_rarity,
      }));
    }).flat();
  }

  async searchCardByName(name: string, game: number) {

    let url = ''

    if (game == 3) {
      url = `${this.baseUrlYugioh}/cardinfo.php?fname=${encodeURIComponent(name)}`
    } else if (game == 2) {
      url = `${this.baseUrlMagic}/cards/search?q=${encodeURIComponent(name)}`
    } else {
      throw new Error('Jogo inválido')
    }


    const response = await axios.get(url)
    const data = response.data
    // Aqui pegamos apenas os atributos relevantes
    if (game == 2) {
      const cards = this.transformMagicCards(data)
      return { data: cards }
    } else if (game == 3) {
      const cards = this.transformYugiohCards(data)
      return { data: cards }
    }
  }
    
  async getCardById(id: string, game: number) {
    let url = ''
    let setCode = ''

    console.log('Buscando carta com ID:', id, 'para o jogo:', game);
    
    if (game == 3) {
      const parts = id.split('_')
      const cardId = parts[0]
      setCode = parts[1] || ''
      url = `${this.baseUrlYugioh}/cardinfo.php?id=${encodeURIComponent(cardId)}`
    } else if (game == 2) {
      url = `${this.baseUrlMagic}/cards/${encodeURIComponent(id)}`
    } else {
      throw new Error('Jogo inválido')
    }
    const response = await axios.get(url)
    const data = response.data

    if (game == 2) {
      // Para Magic, a resposta é um objeto individual, precisa estar em um array
      const cards = this.transformMagicCards({ data: [data] })
      return { data: cards[0] }
    } else if (game == 3) {
      // Para Yu-Gi-Oh, a resposta vem em um array
      const cardsArray = Array.isArray(data.data) ? data.data : [data.data]
      const cards = this.transformYugiohCards(cardsArray, setCode)[0]
      return { data: cards }
    }
  }
}
