'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderForm } from '@/components/form/order-form'
import { OrderFormValues } from '@/validators/order-form-schema'
import { toast } from 'sonner'

export default function PlaceOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (data: OrderFormValues) => {
    try {
      setIsSubmitting(true)
      
      // Format deadline for API
      const formattedData = {
        ...data,
        deadline: data.deadline.toISOString(),
      }
      
      // Calculate pages from word count (1 page = 250 words)
      const pages = Math.ceil(data.wordCount / 250)
      
      // Call API to create order
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formattedData,
          pages,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }
      
      const result = await response.json()
      
      toast.success('Order created successfully')
      
      // Redirect to checkout
      router.push(`/api/checkout?orderId=${result.orderId}`)
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-2">Place New Order</h1>
      <p className="text-muted-foreground mb-8">Fill out the form below to place a new academic assignment order.</p>
      
      <OrderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
} 