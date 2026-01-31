'use client'

// Sticky banner disabled for now - uncomment to enable
export default function StickyAdBanner() {
  return null

  /* Commented out - enable when ad image is ready
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const closed = sessionStorage.getItem('ad-banner-closed')
    setShowBanner(!closed)
  }, [])

  const closeBanner = () => {
    sessionStorage.setItem('ad-banner-closed', 'true')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black">
      <div className="relative">
        <button
          onClick={closeBanner}
          className="absolute top-1 right-2 z-10 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition"
          aria-label="Закрыть рекламу"
        >
          <X className="w-4 h-4" />
        </button>
        <a href="https://example.com" target="_blank" rel="noopener noreferrer">
          <Image
            src="/uploads/banner.png"
            alt="Advertisement"
            width={1200}
            height={100}
            className="w-full h-[100px] object-cover"
            priority
          />
        </a>
      </div>
    </div>
  )
  */
}
