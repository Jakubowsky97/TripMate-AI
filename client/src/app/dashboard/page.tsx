import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  } 
  const user_firstName = data.user.user_metadata.full_name.split(' ')[0]

  return (
    <div>
      <h1>Good Morning, {user_firstName} 👋</h1>
    </div>
)
}