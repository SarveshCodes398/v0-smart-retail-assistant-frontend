// Simulate API delays
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const simulateDelay = async () => {
  await delay(Math.random() * 600 + 200) // 200-800ms
}
