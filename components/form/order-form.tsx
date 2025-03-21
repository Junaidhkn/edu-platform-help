'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { orderFormSchema, type OrderFormValues } from '@/validators/order-form-schema'
import { calculatePriceFromFormValues } from '@/lib/order-price-calculator'
import { FileUploadField } from './file-upload-field'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { addDays, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OrderFormProps {
  onSubmit: (values: OrderFormValues) => void
  isSubmitting?: boolean
}

export function OrderForm({ onSubmit, isSubmitting = false }: OrderFormProps) {
  const [pricePreview, setPricePreview] = useState(0)
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      wordCount: 500,
      subject: 'arts',
      typeCategory: 'coursework',
      academicLevel: 'undergraduate',
      deadline: addDays(new Date(), 7),
      description: '',
      fileUrls: [],
      price: 0,
      totalPrice: 0
    }
  })
  
  const watchedValues = form.watch()
  
  useEffect(() => {
    const price = calculatePriceFromFormValues(watchedValues)
    form.setValue('price', price)
    form.setValue('totalPrice', price)
    setPricePreview(price)
  }, [
    watchedValues.wordCount, 
    watchedValues.subject, 
    watchedValues.typeCategory, 
    watchedValues.academicLevel, 
    watchedValues.deadline,
    form
  ])
  
  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Word Count */}
        <FormField
          control={form.control}
          name="wordCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word Count</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={250} 
                  step={250} 
                  placeholder="500" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Minimum word count is 250 (1 page)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="arts">Arts & Humanities</SelectItem>
                  <SelectItem value="business">Business & Economics</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="em">Engineering & Mathematics</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Type Category */}
        <FormField
          control={form.control}
          name="typeCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="coursework">Coursework</SelectItem>
                  <SelectItem value="bookreport">Book Report</SelectItem>
                  <SelectItem value="researchpaper">Research Paper</SelectItem>
                  <SelectItem value="thesis">Thesis/Dissertation</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Academic Level */}
        <FormField
          control={form.control}
          name="academicLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Deadline */}
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the deadline for your assignment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your assignment requirements in detail" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* File Upload */}
        <FormField
          control={form.control}
          name="fileUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Files (Optional)</FormLabel>
              <FormControl>
                <FileUploadField
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Upload any relevant files for your assignment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Price Display */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Price:</span>
            <span>${pricePreview.toFixed(2)}</span>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Continue to Payment'}
        </Button>
      </form>
    </Form>
  )
} 