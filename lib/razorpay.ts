declare global {
  interface Window {
    Razorpay: any
  }
}

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

export const initiateRazorpayPayment = async (options: {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  handler: (response: any) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color?: string
  }
}) => {
  const res = await loadRazorpay()

  if (!res) {
    alert("Razorpay SDK failed to load. Please check your internet connection.")
    return
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}
