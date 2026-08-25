import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fireConfetti } from '../utils/confetti'

function HomePage() {
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name')?.trim()
  const displayName = name?.toUpperCase()
  const queryString = searchParams.toString()
  const withQuery = (path: string) => (queryString ? `${path}?${queryString}` : path)

  useEffect(() => {
    fireConfetti()
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4efe4] text-stone-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
        <Link
          to={withQuery('/')}
          className="text-xl font-black uppercase tracking-widest text-stone-950"
        >
          Paa
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-8 lg:pb-24 lg:pt-10">
        <section className="grid min-w-0 gap-8 rounded-3xl border-2 border-stone-950 bg-[#faf7f0] p-5 sm:p-8 lg:p-14">
          <div className="min-w-0 space-y-6">
            <span className="inline-flex rounded-full border border-stone-950 px-4 py-1.5 text-sm font-medium uppercase tracking-wide text-stone-950">
              Paa tiny date party
            </span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-wrap text-4xl font-extrabold leading-tight tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
                Congratulation{' '}
                {displayName ? (
                  <span className="underline decoration-4 underline-offset-8">
                    {displayName}
                  </span>
                ) : null}{' '}
                for making it this far,{' '}
                <svg
                  viewBox="0 0 200 180"
                  className="inline-block h-10 w-10 align-middle sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                  role="img"
                  aria-label="Smiling animated face"
                >
                  <path
                    d="M14 96C22 50 56 22 100 22s78 28 86 74c-20-12-54-19-86-19s-66 7-86 19Z"
                    fill="#0c0a09"
                  />
                  <circle cx="100" cy="112" r="76" fill="#f4efe4" stroke="#0c0a09" strokeWidth="4" />
                  <g className="mario-eye">
                    <ellipse cx="72" cy="102" rx="16" ry="20" fill="#fff" stroke="#0c0a09" strokeWidth="2" />
                    <circle cx="76" cy="106" r="7.5" fill="#0c0a09" />
                  </g>
                  <g className="mario-eye">
                    <ellipse cx="128" cy="102" rx="16" ry="20" fill="#fff" stroke="#0c0a09" strokeWidth="2" />
                    <circle cx="124" cy="106" r="7.5" fill="#0c0a09" />
                  </g>
                  <path
                    d="M50 128c14-8 32-6 50 2 18-8 36-10 50-2-14 12-34 8-50-2-16 10-36 14-50 2Z"
                    fill="#0c0a09"
                  />
                  <path
                    d="M62 138c14 26 62 26 76 0"
                    stroke="#0c0a09"
                    strokeWidth="9"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </h1>
              <p className="max-w-3xl text-base leading-7 text-stone-600 sm:text-lg">
                Pick your poison, claim a time, and let us bring the charm, snacks, and
                questionable jokes together.
              </p>
            </div>
            <div className="flex min-w-0 flex-wrap gap-2 text-sm font-medium text-stone-950">
              <span className="rounded-full border border-stone-950 px-4 py-2">
                No awkward planning committee
              </span>
              <span className="rounded-full border border-stone-950 px-4 py-2">
                Snacks are legally encouraged
              </span>
              <span className="rounded-full border border-stone-950 px-4 py-2">
                Good vibes only
              </span>
            </div>
            <div className="pt-2">
              <Link
                to={withQuery('/booking')}
                className="inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-6 py-4 text-base font-semibold text-stone-50 transition hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950 sm:w-auto sm:min-w-56"
              >
                Save me a date
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
