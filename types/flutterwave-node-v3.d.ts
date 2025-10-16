declare module 'flutterwave-node-v3' {
  interface PaymentLinkData {
    tx_ref: string
    amount: number
    currency: string
    redirect_url?: string
    customer: {
      email: string
      name: string
    }
    customizations?: {
      title?: string
      description?: string
      logo?: string
    }
    meta?: Record<string, any>
  }

  interface PaymentLinkResponse {
    status: string
    message: string
    data: {
      link: string
    }
  }

  interface TransactionResponse {
    status: string
    message: string
    data: {
      id: number
      tx_ref: string
      flw_ref: string
      device_fingerprint: string
      amount: number
      currency: string
      charged_amount: number
      app_fee: number
      merchant_fee: number
      processor_response: string
      auth_model: string
      card: {
        first_6digits: string
        last_4digits: string
        issuer: string
        country: string
        type: string
        token: string
        expiry: string
      }
      created_at: string
      status: string
      payment_type: string
      created_at: string
      account_id: number
      customer: {
        id: number
        phone_number: string
        name: string
        email: string
        created_at: string
      }
    }
  }

  class Flutterwave {
    constructor(publicKey: string, secretKey: string)
    
    PaymentLink: {
      create(data: PaymentLinkData): Promise<PaymentLinkResponse>
    }
    
    Transaction: {
      verify(data: { id: string }): Promise<TransactionResponse>
    }
  }

  export = Flutterwave
}
