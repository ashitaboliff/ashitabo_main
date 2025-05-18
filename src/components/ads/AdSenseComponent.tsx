'use client'

import React, { useEffect, useRef } from 'react'
import Script from 'next/script'

interface AdSenseComponentProps {
  adSlot: string
  adClient: string
  className?: string
  style?: React.CSSProperties
  onAdClick?: () => void
  fallback?: React.ReactNode // Fallback UI for development or if ad fails to load
  adFormat?: string // e.g., 'auto', 'rectangle', 'vertical', 'horizontal'
  responsive?: boolean // For responsive ad units
}

const AdSenseComponent: React.FC<AdSenseComponentProps> = ({
  adSlot,
  adClient,
  className,
  style,
  onAdClick,
  fallback,
  adFormat = 'auto',
  responsive = true,
}) => {
  const adRef = useRef<HTMLDivElement | null>(null)
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (isDevelopment || !adRef.current) {
      return
    }

    try {
      // Initialize the ad
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense initialization error:', e)
    }
  }, [adSlot, adClient, isDevelopment])

  const handleAdClick = () => {
    if (onAdClick) {
      onAdClick()
    }
  }

  if (isDevelopment) {
    return (
      fallback ?? (
        <div
          className={`bg-gray-200 border border-gray-300 text-gray-500 flex items-center justify-center ${className ?? ''}`}
          style={{ minHeight: '90px', width: '100%', ...(style ?? {}) }}
        >
          Ad Placeholder (Development Mode) - Slot: {adSlot}
        </div>
      )
    )
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
        strategy="afterInteractive" // Load after page becomes interactive
        onError={(e) => {
          console.error('AdSense script loading error:', e)
        }}
      />
      <div
        ref={adRef}
        onClick={handleAdClick}
        className={`adsbygoogle-container ${className ?? ''}`}
        style={style}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', ...style }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive.toString()}
        ></ins>
      </div>
    </>
  )
}

export default AdSenseComponent
