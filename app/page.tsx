'use client'

import React, { useState, useEffect, useRef } from 'react'
import EmailGate from './components/EmailGate'
import GlossaryTerm from './components/GlossaryTerm'
import SuperscriptNote from './components/SuperscriptNote'
import Tooltip from './components/Tooltip'

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'background', title: 'Background' },
]

const glossaryTerms = [
  { term: 'Polarized Training', definition: [
    'A training approach that emphasizes both high-intensity and low-intensity work while minimizing moderate-intensity training.',
    'This method is based on research showing that most endurance athletes spend about 80% of their training time at low intensity and 20% at high intensity, with very little time spent at moderate intensity.',
    'The rationale is that low-intensity training builds aerobic capacity and aids recovery, while high-intensity sessions drive specific adaptations for performance. By avoiding the "gray zone" of moderate intensity, athletes can maximize gains and minimize fatigue.',
    'Polarized training has been adopted by elite runners, cyclists, and rowers, and is supported by numerous scientific studies. It is especially effective for athletes training for long-distance events, but can be adapted for a variety of sports and fitness levels.',
    'To implement polarized training, athletes typically monitor their heart rate or perceived exertion, ensuring that easy sessions are truly easy and hard sessions are performed at a high effort. Recovery and consistency are key to success with this approach.'
  ] },
  { term: 'Threshold Training', definition: ['Training at the intensity where lactate begins to accumulate in the blood.'] },
  { term: 'Lactate Threshold', definition: ['The exercise intensity at which lactate begins to accumulate in the blood faster than it can be removed.'] },
  { term: 'VO2 Max', definition: ['The maximum amount of oxygen your body can utilize during exercise.'] },
  { term: 'Recovery Period', definition: ['A designated time for the body to adapt to training stress and rebuild stronger.'] },
  { term: 'Training Load', definition: ['The total amount of stress placed on the body during exercise.'] },
]

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [activeSection, setActiveSection] = useState('intro')
  const [openGlossaryTerm, setOpenGlossaryTerm] = useState<string | null>(null)
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false)
  const [showGlossaryTip, setShowGlossaryTip] = useState(false)
  const [tipDismissed, setTipDismissed] = useState(false)
  const [highlightFirstGlossary, setHighlightFirstGlossary] = useState(false)
  const [highlightedTerms, setHighlightedTerms] = useState<{ [term: string]: 'active' | 'fading' | undefined }>({})
  const firstGlossaryRef = useRef<HTMLSpanElement | null>(null)
  const glossaryInstanceIds = {
    'Threshold Training 1': useRef<HTMLSpanElement | null>(null), // first instance (tip logic)
    'Polarized Training 1': useRef<HTMLSpanElement | null>(null),
    'Threshold Training 2': useRef<HTMLSpanElement | null>(null), // second instance (observer logic)
    // Add more if needed
  }
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isKeyTermsOpen, setIsKeyTermsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute('id')

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId || '')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setScrollProgress(docHeight > 0 ? scrolled / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable body scroll when overlay is open
  useEffect(() => {
    if (openGlossaryTerm) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [openGlossaryTerm])

  // Intersection Observer for all glossary terms except the first Threshold Training
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id')
          if (!id) return
          if (entry.isIntersecting && !highlightedTerms[id]) {
            setHighlightedTerms((prev) => ({ ...prev, [id]: 'active' }))
            setTimeout(() => setHighlightedTerms((prev) => ({ ...prev, [id]: 'fading' })), 5000)
            setTimeout(() => setHighlightedTerms((prev) => ({ ...prev, [id]: undefined })), 5500)
          }
        })
      },
      { rootMargin: '-20% 0% -80% 0%' }
    )
    Object.entries(glossaryInstanceIds).forEach(([id, ref]) => {
      if (id === 'Threshold Training 1') return // skip first instance
      if (ref.current) observer.observe(ref.current)
    })
    return () => observer.disconnect()
  }, [highlightedTerms])

  // Intersection Observer for first glossary term (tip)
  useEffect(() => {
    if (tipDismissed) return
    const ref = firstGlossaryRef.current
    if (!ref) return
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          console.log('Threshold Training 1 observer: no entry')
          return
        }
        console.log('Threshold Training 1 observer entry:', entry)
        if (entry.isIntersecting) {
          setShowGlossaryTip(true)
          setHighlightFirstGlossary(true)
        }
      },
      { rootMargin: '-50% 0% -50% 0%' }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [tipDismissed])

  // Remove highlight from first term when tip is dismissed
  useEffect(() => {
    if (tipDismissed) {
      setTimeout(() => {
        setHighlightFirstGlossary(false)
        setHighlightedTerms((prev) => ({ ...prev, ['Threshold Training 1']: 'fading' }))
        setTimeout(() => setHighlightedTerms((prev) => ({ ...prev, ['Threshold Training 1']: undefined })), 500)
      }, 5000)
    }
  }, [tipDismissed])

  // Find glossary term data by term
  const getGlossaryTerm = (term: string) => glossaryTerms.find((t) => t.term === term)

  // Sidebar nav items
  const sidebarNav = () => {
    return (
      <ul id="sidebar-nav-list" className="space-y-0.5 text-right text-sm transition-all duration-300">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`block py-0.5 hover:text-[#111111]/70 font-bold ${activeSection === section.id ? 'text-[#111111]' : ''}`}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    )
  }

  // Overlay modal for glossary terms
  const glossaryOverlay = openGlossaryTerm ? (() => {
    const termData = getGlossaryTerm(openGlossaryTerm)
    if (!termData) return null
    const paragraphs = Array.isArray(termData.definition)
      ? termData.definition
      : [termData.definition]
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300 opacity-100 animate-fade-in">
        <div className="bg-[#FDFCF8] rounded-lg shadow-xl max-w-2xl w-full p-8 flex flex-col items-center">
          <h4 className="text-2xl font-bold mb-4">{termData.term}</h4>
          <div className="w-full max-h-[60vh] overflow-y-auto mb-6 pt-4">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="text-lg text-center max-w-2xl mb-4 first:mt-0">{para}</p>
            ))}
          </div>
          <button
            onClick={() => setOpenGlossaryTerm(null)}
            className="mt-2 px-6 py-2 bg-[#111111] text-white rounded-md hover:bg-[#111111]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  })() : null

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#111111] pb-32">
      {/* Large screens: fixed sidebar, main content centered, layout math preserved */}
      <div className="hidden lg:block w-full">
        <nav
          className="fixed top-0 bg-[#FDFCF8]/95 border-r border-divider z-10 pr-8"
          style={{ width: '256px', left: 'calc((100vw - 800px) / 2 - 256px + 64px)', height: '100vh', paddingTop: '9.5rem' }}
        >
          {sidebarNav()}
        </nav>
        <main
          className="w-[800px] px-4 sm:px-6 md:px-8"
          style={{ marginLeft: 'calc((100vw - 800px) / 2 + 64px)' }}
        >
          <section id="intro" className="section mb-24 pb-0 pt-16 scroll-mt-24">
            <h1 className="text-[40px] font-bold mb-6">The Norwegian Singles Method</h1>
            <div className="prose prose-lg prose-neutral max-w-none text-[20px] leading-[30px]">
              <p className="mb-6">
                It all started with the <a href="https://www.letsrun.com/forum/flat_read.php?thread=12130781" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">best ever thread</a> on the worst site on the internet.
              </p>

              <p className="mb-6">What began in July 2023 as a simple comment by Sirpoc, a then-anonymous amateur runner, has snowballed into a movement. One that promises PBs across distances from 5K to the marathon while offering a more sustainable way to train, with less fatigue and fewer injuries.</p>

              <p className="mb-6">Some claim Sirpoc has <a href="https://www.reddit.com/r/AdvancedRunning/comments/1k9zx83/has_the_sirpoc_method_solved_hobby_jogging/" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">solved hobbyjogging</a>. Whether or not that's true, there's a strong case that most amateur runners would benefit from understanding the Norwegian Singles Method.</p>

              <p className="mb-6">Trouble is, the good stuff is buried in a 5000+ comment thread. Half of the posts are trolls or, as one user put it, "some wizard claiming how inefficient this is". Even if you enjoy internet chaos, Let's Run might be the least navigable and most aesthetically cursed site you'll ever come across.</p>

              <p className="mb-6"><a href="https://sites.google.com/view/sub-threshold/home?authuser=0" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">Some attempts</a> have been made to consolidate what's known, but Let's Run and Reddit remain full of questions and confident misunderstanding. People keep asking for a book. This isn't it, but it might get close.</p>

              <p className="mb-6">If you want the TL;DR, this isn't for you. But if you're serious about understanding how the method works — and how it might transform your training - follow along as it's unpacked, step by step.</p>
            </div>
          </section>

          <section id="background" className="section mb-10 pt-0 scroll-mt-24" style={{ minHeight: '200px' }}>
            <h2 className="text-3xl font-bold mb-6 mt-0">Background</h2>
            <div className="prose prose-lg prose-neutral max-w-none text-[20px] leading-[30px]">
              <p className="mb-6">James Copeland, aka Sirpoc, is something of an iconoclast.</p>
              <p className="mb-6">He stands apart from other internet-famous runners - there's no YouTube channel, you won't find him on podcasts, and he doesn't offer a <a href="https://www.justalilbester.com/coaching" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">£115/month coaching package</a>.</p>
              <p className="mb-6">For someone with a 5K PB of 15:01, there's no sign on his Strava of the lung-busting hero workouts that are the staple of most sub-elite training. In fact, if you follow him on the platform you'll struggle to discern anything interesting - there's no <a href="https://www.instagram.com/reel/DGBW6tDNyi7/" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">trip to Kenya</a>, no hills, no x-factor sessions and even the easy runs are slower than most coaches would prescribe.</p>
              <p className="mb-6">If anything, his approach to training looks pretty boring, if not wrong-headed. But he's stuck with it for almost three years - eschewing conventional wisdom and the temptation to implement the latest fad workout.</p>
              <p className="mb-6">His results are anything but boring.</p>
              <p className="mb-6">At 41 years old, he ran his debut marathon in 2:24:08, having never completed the distance in training.</p>
              <p className="mb-6">He did this on a day when most runners blew up in the heat. After a night down the pub, three hours sleep and a Mars bar for breakfast.</p>
              <p className="mb-6">It's tempting to chalk this kind of performance up to prodigious natural talent, but that doesn't seem to be the case. He ran his first ever Parkrun in 21:34 and, after a year of following traditional running plans, plateaued at a respectable but unremarkable range of 18:30-19:00.</p>
              <p className="mb-6">He has some pedigree in cycling and competed in time trials at the sub-elite level. But, as we'll see, his performance on the bike and as a runner is not about having the right genes.</p>
              <p className="mb-6">It is his ability to perceive and develop insights into what really drives improvement - to isolate and focus on this relentlessly and consistently - that has underpinned his success.</p>
              <p className="mb-6">The good news? If it's not about natural talent, this is something anyone can replicate. But before we dive into <i>how</i> to implement The Norwegian Singles Method, it's helpful to understand <i>why</i> it works. To do that, we need to trace its roots back to two separate but related advances in endurance training...</p>
            </div>
            {!isUnlocked && (
              <div className="flex justify-center w-full items-center pb-16">
                <div className="w-[400px]">
                  <EmailGate onUnlock={() => setIsUnlocked(true)} />
                </div>
              </div>
            )}
            <div
              className={`transition-opacity duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div className="prose prose-lg prose-neutral max-w-none text-[20px] leading-[30px]">
                {/* Content will be added here */}
              </div>
            </div>
          </section>
        </main>
      </div>
      {/* Mobile and md screens: sidebar fixed, main content with margin */}
      <div className="lg:hidden">
        <nav className="fixed left-0 top-0 h-screen pr-8 border-r border-divider hidden md:block bg-[#FDFCF8]/95 backdrop-blur-sm z-10 w-40"
          style={{ paddingTop: '9.5rem' }}>
          {sidebarNav()}
        </nav>
        <main className="w-full md:ml-40">
          <div className="section mx-auto md:mx-0 md:[max-width:calc(100vw-160px)] lg:max-w-[800px]">
            <section id="intro" className="section mb-24 pb-0 pt-16 scroll-mt-24">
              <h1 className="text-[40px] font-bold mb-6">The Norwegian Singles Method</h1>
              <div className="prose prose-lg prose-neutral max-w-none text-[20px] leading-[30px]">
                <p className="mb-6">
                  It all started with the <a href="https://www.letsrun.com/forum/flat_read.php?thread=12130781" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">best ever thread</a> on the worst site on the internet.
                </p>

                <p className="mb-6">What began in July 2023 as a simple comment by Sirpoc, a then-anonymous amateur runner, has snowballed into a movement. One that promises PBs across distances from 5K to the marathon while offering a more sustainable way to train, with less fatigue and fewer injuries.</p>

                <p className="mb-6">Some claim Sirpoc has <a href="https://www.reddit.com/r/AdvancedRunning/comments/1k9zx83/has_the_sirpoc_method_solved_hobby_jogging/" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">solved hobbyjogging</a>. Whether or not that's true, there's a strong case that most amateur runners would benefit from understanding the Norwegian Singles Method.</p>

                <p className="mb-6">Trouble is, the good stuff is buried in a 5000+ comment thread. Half of the posts are trolls or, as one user put it, "some wizard claiming how inefficient this is". Even if you enjoy internet chaos, Let's Run might be the least navigable and most aesthetically cursed site you'll ever come across.</p>

                <p className="mb-6"><a href="https://sites.google.com/view/sub-threshold/home?authuser=0" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">Some attempts</a> have been made to consolidate what's known, but Let's Run and Reddit remain full of questions and confident misunderstanding. People keep asking for a book. This isn't it, but it might get close.</p>

                <p className="mb-6">If you want the TL;DR, this isn't for you. But if you're serious about understanding how the method works — and how it might transform your training - follow along as it's unpacked, step by step.</p>
              </div>
            </section>

            <section id="background" className="section mb-10 pt-0 scroll-mt-24" style={{ minHeight: '200px' }}>
              <h2 className="text-3xl font-bold mb-6 mt-0">Background</h2>
              <div className="prose prose-lg prose-neutral max-w-none text-[20px] leading-[30px]">
                <p className="mb-6">James Copeland, aka Sirpoc, is something of an iconoclast.</p>
                <p className="mb-6">He stands apart from other internet-famous runners - there's no YouTube channel, you won't find him on podcasts, and he doesn't offer a <a href="https://www.justalilbester.com/coaching" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">£115/month coaching package</a>.</p>
                <p className="mb-6">For someone with a 5K PB of 15:01, there's no sign on his Strava of the lung-busting hero workouts that are the staple of most sub-elite training. In fact, if you follow him on the platform you'll struggle to discern anything interesting - there's no <a href="https://www.instagram.com/reel/DGBW6tDNyi7/" target="_blank" rel="noopener noreferrer" className="text-[#111111] border-b border-[#111111] border-opacity-50">trip to Kenya</a>, no hills, no x-factor sessions and even the easy runs are slower than most coaches would prescribe.</p>
                <p className="mb-6">If anything, his approach to training looks pretty boring, if not wrong-headed. But he's stuck with it for almost three years - eschewing conventional wisdom and the temptation to implement the latest fad workout.</p>
                <p className="mb-6">His results are anything but boring.</p>
                <p className="mb-6">At 41 years old, he ran his debut marathon in 2:24:08, having never completed the distance in training.</p>
                <p className="mb-6">He did this on a day when most runners blew up in the heat. After a night down the pub, three hours sleep and a Mars bar for breakfast.</p>
                <p className="mb-6">It's tempting to chalk this kind of performance up to prodigious natural talent, but that doesn't seem to be the case. He ran his first ever Parkrun in 21:34 and, after a year of following traditional running plans, plateaued at a respectable but unremarkable range of 18:30-19:00.</p>
                <p className="mb-6">He has some pedigree in cycling and competed in time trials at the sub-elite level. But, as we'll see, his performance on the bike and as a runner is not about having the right genes.</p>
                <p className="mb-6">It is his ability to perceive and develop insights into what really drives improvement - to isolate and focus on this relentlessly and consistently - that has underpinned his success.</p>
                <p className="mb-6">The good news? If it's not about natural talent, this is something anyone can replicate. But before we dive into <i>how</i> to implement The Norwegian Singles Method, it's helpful to understand <i>why</i> it works. To do that, we need to trace its roots back to two separate but related advances in endurance training...</p>
              </div>
              {!isUnlocked && (
                <div className="flex justify-center w-full items-center pb-16">
                  <div className="w-[400px]">
                    <EmailGate onUnlock={() => setIsUnlocked(true)} />
                  </div>
                </div>
              )}
              <div
                className={`transition-opacity duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                <div className="prose prose-lg prose-neutral max-w-none text-[20px] leading-[30px]">
                  {/* Content will be added here */}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      {glossaryOverlay}
      {/* Glossary Tip (desktop only) */}
      {showGlossaryTip && !tipDismissed && (
        <div className="hidden md:block fixed top-40 right-12 z-40 bg-[#FDFCF8] border border-[#e5e7eb] shadow-lg rounded-lg px-6 py-4 max-w-xs animate-fade-in">
          <div className="font-semibold mb-2">Tip</div>
          <div className="mb-3 text-sm">Click on glossary terms to see more information.</div>
          <button
            className="px-4 py-1.5 bg-[#a5bea3] text-[#111111] border border-[#a5bea3] rounded hover:bg-[#8fa88d] text-sm transition-colors"
            onClick={() => setTipDismissed(true)}
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  )
} 