import './App.css'
import { useEffect, useRef, useState } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  const audioRef = useRef(null)
  const scratchCanvasRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [scratching, setScratching] = useState(false)
  const [guestName, setGuestName] = useState('')
  const contactNumber = '+919014153103'
  const displayName = guestName.trim() || 'Guest'
  const audioSrc = `${import.meta.env.BASE_URL}assets/invitation-melody.mp3`

  useEffect(() => {
    const canvas = scratchCanvasRef.current
    if (!canvas || revealed) return

    const context = canvas.getContext('2d')
    const { width, height } = canvas.getBoundingClientRect()
    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    context.scale(pixelRatio, pixelRatio)

    const gradient = context.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#d9d4c7')
    gradient.addColorStop(0.48, '#9b9589')
    gradient.addColorStop(1, '#eee7d8')

    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)

    context.save()
    context.rotate(-0.68)
    context.fillStyle = 'rgba(255, 255, 255, 0.22)'
    for (let x = -height; x < width * 2; x += 24) {
      context.fillRect(x, 0, 8, height * 2)
    }
    context.restore()

    context.fillStyle = '#6b2034'
    context.font = '700 17px Inter, sans-serif'
    context.textAlign = 'center'
    context.fillText('SCRATCH HERE', width / 2, height / 2 - 4)
    context.font = '500 13px Inter, sans-serif'
    context.fillText('reveal the wedding date', width / 2, height / 2 + 24)
  }, [revealed])

  const openCurtain = async (event) => {
    event?.preventDefault()

    const trimmedName = guestName.trim()
    if (!trimmedName) return

    setOpen(true)

    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.5
        await audioRef.current.play()
      } catch (err) {
        console.log('Audio play blocked:', err)
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted
    }
    setMuted(!muted)
  }

  const scratchCard = (event, forceScratch = false) => {
    if ((!scratching && !forceScratch) || revealed) return

    const canvas = scratchCanvasRef.current
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const pointer = event.touches ? event.touches[0] : event
    const x = pointer.clientX - rect.left
    const y = pointer.clientY - rect.top

    context.globalCompositeOperation = 'destination-out'
    context.beginPath()
    context.arc(x, y, 22, 0, Math.PI * 2)
    context.fill()

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    let transparentPixels = 0

    for (let index = 3; index < imageData.data.length; index += 4) {
      if (imageData.data[index] === 0) transparentPixels += 1
    }

    if (transparentPixels / (imageData.data.length / 4) > 0.36) {
      setRevealed(true)
    }
  }

  const startScratching = (event) => {
    setScratching(true)
    scratchCard(event, true)
  }

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" muted={muted} />

      <div className={`curtain ${open ? 'open' : ''}`}>
        <div className="curtain-left"></div>
        <div className="curtain-right"></div>
        {!open && (
          <form className="guest-unlock" onSubmit={openCurtain}>
            <span className="unlock-label">Welcome</span>
            <input
              type="text"
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              placeholder="Enter your name"
              aria-label="Enter your name"
            />
            <button type="submit">Enter Name to Unlock Invite</button>
            <p className="invited-by">
              Invited by <strong>Shaik Mahammad Ali</strong>
            </p>
          </form>
        )}
      </div>

      <main className={`invite-page ${open ? 'show' : 'hide'}`}>
        <div className="ambient-motion" aria-hidden="true">
          <span className="float-piece heart-piece"></span>
          <span className="float-piece leaf-piece"></span>
          <span className="float-piece heart-piece"></span>
          <span className="float-piece leaf-piece"></span>
          <span className="float-piece heart-piece"></span>
          <span className="float-piece leaf-piece"></span>
        </div>

        <button className="music-toggle" onClick={toggleMute} aria-label="Toggle music">
          <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
        </button>

        <a className="call-toggle" href={`tel:${contactNumber}`} aria-label="Call us">
          <i className="fa-solid fa-phone"></i>
        </a>

        <section className="hero-section">
          <div className="hero-image-overlay"></div>

          <div className="hero-content">
            <img
              className="bismillah-image"
              src={`${import.meta.env.BASE_URL}bismillah.svg`}
              alt="Bismillah"
            />

            <h1 className="hero-title" aria-label="Mahammad Ali loves Roshini">
              <span className="hero-name-line">MAHAMMAD ALI</span>
              <span className="hero-love-symbol" aria-hidden="true">
                <i className="fa-solid fa-heart"></i>
              </span>
              <span className="hero-name-line">ROSHINI</span>
            </h1>

            <div className="hero-divider"></div>
            <p className="hero-top-text">We are getting married</p>
          </div>
        </section>

        <section className="scratch-section">
          <h2 className="scratch-main-title">A Little Secret</h2>

          <p className="scratch-main-sub">Scratch the card to reveal our wedding date</p>

          <div className={`scratch-card ${revealed ? 'revealed' : ''}`}>
            <div className="scratch-result">
              <span className="scratch-month">MAY</span>

              <h1>31</h1>

              <span className="scratch-day">SUNDAY</span>
            </div>

            {!revealed && (
              <canvas
                ref={scratchCanvasRef}
                className="scratch-canvas"
                aria-label="Scratch card cover"
                onMouseDown={startScratching}
                onMouseMove={scratchCard}
                onMouseUp={() => setScratching(false)}
                onMouseLeave={() => setScratching(false)}
                onTouchStart={startScratching}
                onTouchMove={scratchCard}
                onTouchEnd={() => setScratching(false)}
              />
            )}
          </div>

          <div className={`love-balloons ${revealed ? 'show' : ''}`}>
            <span className="heart-balloon"></span>
            <span className="heart-balloon"></span>
            <span className="heart-balloon"></span>
            <span className="heart-balloon"></span>
            <span className="heart-balloon"></span>
            <span className="heart-balloon"></span>
          </div>
        </section>

        {revealed && (
          <section className="date-calendar-section animate-card">
            <h2 className="section-title">Save The Date</h2>
            <div className="ornament-line"><span></span></div>
            <p className="section-intro">
              <strong>{displayName}</strong>, please keep this day close to your heart as we begin a new chapter together.
            </p>

            <div className="calendar-card">
              <div className="calendar-head">
                <span className="calendar-kicker">Wedding Day</span>
                <div className="calendar-month-title">
                  <span>May</span>
                  <strong>2026</strong>
                </div>
                <p>Sunday, 31 May</p>
              </div>

              <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <span className="calendar-day-name" key={day}>{day}</span>
                ))}

                {Array.from({ length: 5 }).map((_, index) => (
                  <span className="calendar-empty" key={`empty-${index}`}></span>
                ))}

                {Array.from({ length: 31 }).map((_, index) => {
                  const date = index + 1
                  return (
                    <span className={date === 31 ? 'calendar-date selected' : 'calendar-date'} key={date}>
                      {date === 31 ? (
                        <span className="date-heart">
                          <span>{date}</span>
                        </span>
                      ) : (
                        date
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
            <p className="hero-guest-name">
              Dear <strong>{displayName}</strong>, your presence will make our celebration complete.
            </p>
          </section>
        )}

        <section className="event-details-section animate-card animate-card-delay">
          <h2 className="section-title">Event Details</h2>
          <div className="ornament-line"><span></span></div>
          <p className="section-intro">
            We would be honoured to welcome <strong>{displayName}</strong> for the ceremony and blessings.
          </p>

          <div className="event-details-card">
            <div className="event-detail-block">
              <span className="event-label">When</span>
              <h3>Sunday, May 31, 2026</h3>
              <p>11:00 AM onwards</p>
            </div>

            <div className="detail-divider"><span></span></div>

            <div className="event-detail-block">
              <span className="event-label">Where</span>
              <h3>AHC Convention Centre</h3>
              <p>Kalikiri, Andhra Pradesh</p>
              <a href="https://maps.app.goo.gl/1bgD4QzQXm2JuqKe6" className="map-link" target="_blank" rel="noreferrer">
                <i className="fa-solid fa-location-dot"></i>
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        <section className="quote-block animate-card">
          <div className="quote-content">
            <span className="quote-label">With Gratitude</span>
            <h2><strong>{displayName}</strong>, your presence is the greatest gift we could ask for.</h2>
            <div className="quote-ornament"><span></span></div>
            <p className="quote-author">- Mahammad Ali &amp; Roshini</p>
            <span className="blessing-line">Barakallahu Lakuma</span>
            <div className="quote-invitation-note">
              <span>A warm invitation</span>
              <p>
                <strong>{displayName}</strong>, we look forward to celebrating this beautiful moment with you. Thank you for being part of our story.
              </p>
            </div>
          </div>
          <div className="invited-by-tag">
            Invited by<strong> Shaik Mahammad Ali & Family</strong>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
