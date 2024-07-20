const AuthLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className="flex items-center justify-center h-screen p-4
      bg-gray-800">
        <div className="max-w-md w-full mx-auto rounded-lg ">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout