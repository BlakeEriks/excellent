import { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

type SheetUrlDialogProps = {
  open?: boolean
  setOpen: (open: boolean) => void
  setUrl: (url: string) => void
}

export function SheetUrlDialog({ open = false, setOpen, setUrl }: SheetUrlDialogProps) {
  const [input, setInput] = useState('')
  const handleSubmit = () => {
    setUrl(input)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant='outline'>Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Sheet URL</DialogTitle>
          <DialogDescription>
            Use this button for easy access to your habits sheet.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='url' className='text-right'>
              URL
            </Label>
            <Input
              id='url'
              className='col-span-3'
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
