interface CoinStats {
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  circulating_supply: number
  current_price: number
  fully_diluted_valuation: null
  high_24h: number
  id: string
  image: string
  last_updated: string
  low_24h: number
  market_cap: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  market_cap_rank: number
  // max_supply: null,
  name: string
  price_change_24h: number
  price_change_percentage_24h: number
  price_change_percentage_24h_in_currency: number
  // roi: null,
  symbol: string
  total_supply: number
  total_volume: number
}

export async function getTokenPrice(ids = 'solana', vs_currencies = 'usd') {
  return new Promise<CoinStats>((resolve, reject) => {
    fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vs_currencies}&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
    )
      .then(res => res.json())
      .then(
        (res) => {
          if (res.length > 0) {
            resolve(res[0])
          } else {
            reject(Error('Promise rejected'))
          }
        },
        (error) => {
          console.error(error)
        },
      )
  })
}
