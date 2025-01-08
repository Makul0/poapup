// src/components/events/EventTabs.tsx
interface EventTabsProps {
    activeTab: 'ongoing' | 'upcoming' | 'past'
    onTabChange: (tab: 'ongoing' | 'upcoming' | 'past') => void
    counts: {
      ongoing: number
      upcoming: number
      past: number
    }
  }
  
  export function EventTabs({ activeTab, onTabChange, counts }: EventTabsProps) {
    const tabs = [
      { id: 'ongoing', label: 'Ongoing', count: counts.ongoing },
      { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
      { id: 'past', label: 'Past', count: counts.past }
    ]
  
    return (
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as 'ongoing' | 'upcoming' | 'past')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              <span className={`
                ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                ${activeTab === tab.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-900'
                }
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    )
  }