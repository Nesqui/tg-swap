export function useTg() {
  const tg = window.Telegram.WebApp

  const popup = (title = 'debug', message: any) => {
    if (typeof message === 'string') {
      tg.showPopup({ title, message })
    } else {
      tg.showPopup({ title, message: JSON.stringify(message) })
    }
  }

  return {
    tg,
    popup,
  }
}
