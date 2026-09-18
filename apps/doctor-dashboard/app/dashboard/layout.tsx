import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="watercolor-shell flex h-screen overflow-hidden">
      <svg className="mandala mandala-top" viewBox="0 0 240 240" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1"><circle cx="120" cy="120" r="88" /><circle cx="120" cy="120" r="58" /><path d="M120 32c14 30 14 56 0 88-14-32-14-58 0-88ZM208 120c-30 14-56 14-88 0 32-14 58-14 88 0ZM120 208c-14-30-14-56 0-88 14 32 14 58 0 88ZM32 120c30-14 56-14 88 0-32 14-58 14-88 0Z" /><path d="M66 66c38 8 60 30 54 54-24 6-46-16-54-54ZM174 66c-8 38-30 60-54 54-6-24 16-46 54-54ZM174 174c-38-8-60-30-54-54 24-6 46 16 54 54ZM66 174c8-38 30-60 54-54 6 24-16 46-54 54Z" /></g></svg>
      <svg className="mandala mandala-bottom" viewBox="0 0 360 360" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1"><circle cx="180" cy="180" r="130" /><circle cx="180" cy="180" r="94" /><circle cx="180" cy="180" r="54" /><path d="M180 50c30 43 30 84 0 130-30-46-30-87 0-130ZM310 180c-43 30-84 30-130 0 46-30 87-30 130 0ZM180 310c-30-43-30-84 0-130 30 46 30 87 0 130ZM50 180c43-30 84-30 130 0-46 30-87 30-130 0Z" /><path d="M88 88c58 10 92 44 92 92-48 0-82-34-92-92ZM272 88c-10 58-44 92-92 92 0-48 34-82 92-92ZM272 272c-58-10-92-44-92-92 48 0 82 34 92 92ZM88 272c10-58 44-92 92-92 0 48-34 82-92 92Z" /><path d="M180 126v108M126 180h108M142 142l76 76M218 142l-76 76" /></g></svg>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}
