'use client'
import { useParams } from 'next/navigation'


const page = () => {
  const { username } = useParams()
  return (
    <div>
      User Page for {username}
    </div>
  )
}

export default page
