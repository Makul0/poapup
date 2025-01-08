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
      { 
        id: 'ongoing' as const, 
        label: 'Ongoing', 
        count: counts.ongoing,
        description: 'Currently active events'
      },
      { 
        id: 'upcoming' as const, 
        label: 'Upcoming', 
        count: counts.upcoming,
        description: 'Future events you can register for'
      },
      { 
        id: 'past' as const, 
        label: 'Past', 
        count: counts.past,
        description: 'Previously held events'
      }
    ]
  
    return (
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8" aria-label="Event filters">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                group relative min-w-0 flex-1 overflow-hidden py-4 px-1 
                text-center text-sm font-medium hover:text-gray-700 
                focus:z-10 focus:outline-none
                ${activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              aria-label={`${tab.label} events - ${tab.description}`}
            >
              <span>{tab.label}</span>
              <span
                className={`
                  ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-900'
                  }
                `}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    )
  }