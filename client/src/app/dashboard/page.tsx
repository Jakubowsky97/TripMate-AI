"use client";
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { FaChartPie, FaMap, FaPlane } from 'react-icons/fa'
import { useDarkMode } from '@/components/ui/DarkModeContext';

export default async function Dashboard() {
  const { darkMode } = useDarkMode();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  } 
  const user_firstName = data.user.user_metadata.full_name.split(' ')[0]

  return (
    <div>
      <h1 className={`font-bold text-2xl`}>Good Morning, {user_firstName} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center">
          <FaMap className="text-blue-500 text-3xl mr-4" />
          <div> 
            <p className="text-lg font-semibold">Countries Visited</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center">
          <FaPlane className="text-green-500 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Upcoming Trips</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center">
          <FaChartPie className="text-purple-500 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">AI Travel Score</p>
            <p className="text-2xl font-bold">85%</p>
          </div>
        </div>
      </div>

      {/* Recent Trips & AI Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Recent Trips */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Trips</h2>
          <ul className="space-y-3">
            <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              ✈️ Paris, France <span className="text-gray-500 text-sm">- Jan 2025</span>
            </li>
            <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              🏝️ Bali, Indonesia <span className="text-gray-500 text-sm">- Dec 2024</span>
            </li>
            <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              🏔️ Swiss Alps <span className="text-gray-500 text-sm">- Nov 2024</span>
            </li>
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Travel Recommendations</h2>
          <ul className="space-y-3">
            <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              🚀 Japan - Perfect for culture & tech lovers
            </li>
            <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              🌴 Maldives - Best for relaxation & beaches
            </li>
            <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
              🎢 Orlando, USA - Adventure & theme parks
            </li>
          </ul>
        </div>
      </div>
    </div>
)
}