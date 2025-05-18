'use client' // This component needs access to pathname, so it's a client component

import React, { Children, isValidElement, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import AdSenseComponent from './AdSenseComponent'
import { getAdConfigForPath, AdPathConfig } from '@/components/ads/config/ads.config'

interface AutoAdInjectorProps {
  children: React.ReactNode
  // Optional: pass a specific config if you don't want to rely on pathname matching
  overrideConfig?: AdPathConfig 
  // Optional: callback for when an ad is clicked within the injector
  onAdClick?: () => void; 
}

const AutoAdInjector: React.FC<AutoAdInjectorProps> = ({
  children,
  overrideConfig,
  onAdClick,
}) => {
  const pathname = usePathname()
  const adConfig = useMemo(() => overrideConfig || getAdConfigForPath(pathname), [pathname, overrideConfig])

  if (!adConfig || !adConfig.insertionEnabled) {
    return <>{children}</>
  }

  const { insertEveryN, adSlotId, adClient, targetSelector } = adConfig

  const childrenArray = Children.toArray(children)
  const newChildren: React.ReactNode[] = []
  let elementCount = 0

  childrenArray.forEach((child, index) => {
    newChildren.push(child)

    // Check if the child is a valid React element and matches the targetSelector if provided
    let isTargetElement = isValidElement(child)
    if (isTargetElement && targetSelector) {
        // Basic selector matching for className. For more complex selectors, a library might be needed.
        // This example assumes targetSelector is a simple class name like '.my-div' or tag name 'div'.
        const childElement = child as React.ReactElement
        if (targetSelector.startsWith('.')) { // Class selector
            const expectedClassName = targetSelector.substring(1)
            const childClassNames = childElement.props.className?.split(' ') || []
            isTargetElement = childClassNames.includes(expectedClassName)
        } else { // Tag selector
            isTargetElement = childElement.type === targetSelector
        }
    }


    if (isTargetElement) {
      elementCount++
      if (elementCount % insertEveryN === 0 && index < childrenArray.length -1) { // Don't add ad after the very last item
        newChildren.push(
          <AdSenseComponent
            key={`ad-${index}`}
            adSlot={adSlotId}
            adClient={adClient}
            className="my-4" // Default styling, can be overridden
            onAdClick={onAdClick}
            fallback={
              <div className="my-4 p-4 bg-yellow-100 text-yellow-700 text-center">
                Auto-injected Ad Placeholder (Slot: {adSlotId})
              </div>
            }
          />
        )
      }
    }
  })

  return <>{newChildren}</>
}

export default AutoAdInjector
