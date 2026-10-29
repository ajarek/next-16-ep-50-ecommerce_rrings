import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center'>
      <Loader2 className='h-10 w-10 animate-spin text-sky-400' />
      <p className='text-sky-400 text-sm mt-3 tracking-wide'>Wczytywanie...</p>
    </div>
  )
}

export default Loading
