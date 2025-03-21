'use client'

import React, { useState } from 'react'
import { UploadDropzone } from "@/lib/uploadthing"
import { toast } from 'sonner'
import { FileIcon, Loader2, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface FileUploadFieldProps {
  onChange: (urls: string[]) => void
  value: string[]
  className?: string
}

export function FileUploadField({ onChange, value, className }: FileUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDeleteFile = (fileUrl: string) => {
    onChange(value.filter(url => url !== fileUrl))
    toast.success('File removed')
  }

  const onUploadComplete = (res: { url: string }[]) => {
    setIsUploading(false)
    const urls = res.map(file => file.url)
    onChange([...value, ...urls])
    toast.success(`${res.length} file${res.length === 1 ? '' : 's'} uploaded successfully`)
  }

  const onUploadError = (error: Error) => {
    setIsUploading(false)
    toast.error(`Upload failed: ${error.message}`)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Existing files */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((url) => (
            <div 
              key={url} 
              className="flex items-center gap-2 rounded-md border p-2 bg-background"
            >
              <FileIcon className="h-4 w-4 flex-shrink-0 text-primary" />
              <div className="flex-1 truncate text-xs">
                {url.split('/').pop()}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => onDeleteFile(url)}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <UploadDropzone
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => onUploadComplete(res)}
            onUploadError={onUploadError}
            onUploadBegin={() => setIsUploading(true)}
            className="w-full ut-allowed-content:text-primary ut-label:text-primary"
          />
        )}
      </div>
    </div>
  )
} 