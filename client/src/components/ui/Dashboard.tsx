"use client";
import { redirect } from 'next/navigation'
import { FaChartPie, FaMap, FaPlane, FaTrophy } from 'react-icons/fa'
import { useDarkMode } from '@/components/ui/DarkModeContext';

export default function Dashboard({ user }: { user: any }) {
  const { darkMode } = useDarkMode();
  if (!user) {
    redirect("/auth/login");
    return null;
  } 
  const user_firstName = user.user_metadata.full_name.split(' ')[0]

  return (
    <div>
      <h1 className="font-bold text-2xl mb-4">Good Morning, {user_firstName} 👋</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 ${darkMode ? "bg-[#1a1e1f]" : "bg-[#142F32]"} text-[#f8f8f8] rounded-lg shadow-md flex items-center`}>
          <FaMap className="text-blue-500 text-3xl mr-4" />
          <div> 
            <p className="text-lg font-semibold">Countries Visited</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
        <div className={`p-6 ${darkMode ? "bg-[#1a1e1f]" : "bg-[#142F32]"} text-[#f8f8f8] rounded-lg shadow-md flex items-center`}>
          <FaTrophy className="text-amber-300 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Top Travel Companion</p>
            <p className="text-xl">You've traveled the most with: <span className='font-bold'>Alex</span></p>
          </div>
        </div>
        <div className={`p-6 ${darkMode ? "bg-[#1a1e1f]" : "bg-[#142F32]"} text-[#f8f8f8] rounded-lg shadow-md flex items-center`}>
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
        <div className={`${darkMode ? "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200" : "bg-[#142F32]"} text-[#f8f8f8] p-6 rounded-lg shadow-md`}>
          <h2 className="text-xl font-semibold mb-4">Recent Trips</h2>
          <ul className={`space-y-3 ${!darkMode && "text-[#070e0e]"}`}>
            <li className={`p-4 ${darkMode ? "bg-gray-700 hover:bg-[#475569]" : "bg-[#DCEFE5]"} rounded-md`}>
              ✈️ Paris, France <span className="text-gray-500 text-sm">- Jan 2025</span>
            </li>
            <li className={`p-4 ${darkMode ? "bg-gray-700 hover:bg-[#475569]" : "bg-[#DCEFE5]"} rounded-md`}>
              🏝️ Bali, Indonesia <span className="text-gray-500 text-sm">- Dec 2024</span>
            </li>
            <li className={`p-4 ${darkMode ? "bg-gray-700 hover:bg-[#475569]" : "bg-[#DCEFE5]"} rounded-md`}>
              🏔️ Swiss Alps <span className="text-gray-500 text-sm">- Nov 2024</span>
            </li>
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className={`${darkMode ? "bg-[#1a1e1f] shadow-lg shadow-white/10 transition duration-200" : "bg-[#142F32]"} text-[#f8f8f8] p-6 rounded-lg shadow-md`}>
          <h2 className="text-xl font-semibold mb-4">AI Travel Recommendations</h2>
          <ul className={`space-y-3  ${!darkMode && "text-[#070e0e]"}`}>
            <li className={`p-4 ${darkMode ? "bg-gray-700" : "bg-[#DCEFE5]"} rounded-md`}>
              🚀 Japan - Perfect for culture & tech lovers
            </li>
            <li className={`p-4 ${darkMode ? "bg-gray-700" : "bg-[#DCEFE5]"} rounded-md`}>
              🌴 Maldives - Best for relaxation & beaches
            </li>
            <li className={`p-4 ${darkMode ? "bg-gray-700" : "bg-[#DCEFE5]"} rounded-md`}>
              🎢 Orlando, USA - Adventure & theme parks
            </li>
          </ul>
        </div>
      </div>
    </div>
)
}