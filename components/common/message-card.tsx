import React from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Message } from '@/models'
import dayjs from 'dayjs';
import axios, { AxiosError } from 'axios'
import { Trash} from 'lucide-react'
import { ApiRepsonse } from '@/types/ApiResponse';
import { toast } from 'sonner';




const MessageCard = ({message,onMessageDelete}: any) => {

  const handleMessageDelete = async()=>{
    try {
        const response = await axios.delete(`/api/delete-messages/${message?._id}`)
        toast.success(response.data?.message)
        onMessageDelete(message?._id)
    } catch (error) {
      const axiosError = error as AxiosError<ApiRepsonse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to delete message')
    }
  }

  return (
    <Card className="card-bordered" >
      <CardHeader>
        <div className='flex justify-between items-center mb-4 '>
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog> 
            <AlertDialogTrigger asChild >
            <Trash className='w-5 h-5 cursor-pointer'  />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMessageDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className='text-sm ' >
          {dayjs(message.createdAt).format('MMM D YYYY h:mm A')}
        </div>
      </CardHeader>
    </Card>
  )
}

export default MessageCard