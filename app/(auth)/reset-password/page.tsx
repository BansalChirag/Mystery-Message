import ResetPasswordForm from '@/components/forms/reset-password-form'
import React, { Suspense } from 'react'

const page = () => {
  return (
    // <div className='flex items-center justify-center h-screen p-4'>
    <Suspense>
      <ResetPasswordForm/>
    </Suspense>
    // </div>
  )
}

export default page
