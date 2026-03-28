'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'

export function CheckboxTest() {
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const items = [
    { id: 'item1', name: 'Item 1' },
    { id: 'item2', name: 'Item 2' },
    { id: 'item3', name: 'Item 3' }
  ]

  const handleToggle = (itemId: string) => {
    console.log('Toggle called for:', itemId)
    setSelected(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  return (
    <div className="p-4 space-y-4">
      <h3>Checkbox Test</h3>
      <div className="text-sm text-gray-500">
        Selected: {Object.entries(selected).filter(([_, isSelected]) => isSelected).map(([id]) => id).join(', ') || 'None'}
      </div>
      
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2 p-2 border rounded">
          <Checkbox
            id={`test-${item.id}-${index}`}
            checked={selected[item.id] || false}
            onCheckedChange={() => handleToggle(item.id)}
          />
          <label htmlFor={`test-${item.id}-${index}`} className="cursor-pointer">
            {item.name}
          </label>
        </div>
      ))}
      
      <Button onClick={() => setSelected({})}>Clear All</Button>
    </div>
  )
}