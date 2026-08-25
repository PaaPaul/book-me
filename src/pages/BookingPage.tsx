import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { Link, useSearchParams } from 'react-router-dom'
import availability from '../constants/availability.json'
import { fireEmojiConfetti } from '../utils/confetti'
import 'react-day-picker/style.css'

const blockedDates = new Set<string>(availability.blockedDates)
const createBookingUrl =
  import.meta.env.VITE_CREATE_BOOKING_URL ??
  'http://127.0.0.1:54321/functions/v1/create-booking'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

interface TimeSlot {
  value: string
  label: string
  durationMinutes: number
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function minutesToTime(totalMinutes: number) {
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(
    totalMinutes % 60,
  ).padStart(2, '0')}`
}

function isWeekend(date: Date) {
  const day = date.getDay()

  return day === 0 || day === 6
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name)

  return typeof value === 'string' ? value : ''
}

function formatInputDate(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function getWeekendTimeSlots(): TimeSlot[] {
  return Array.from(
    {
      length:
        Math.floor(
          (timeToMinutes(availability.weekendEndTime) -
            timeToMinutes(availability.weekendStartTime)) /
            availability.weekendSlotIntervalMinutes,
        ) + 1,
    },
    (_, index) =>
      minutesToTime(
        timeToMinutes(availability.weekendStartTime) +
          index * availability.weekendSlotIntervalMinutes,
      ),
  )
    .filter((time) => timeToMinutes(time) <= timeToMinutes(availability.weekendEndTime))
    .map((time) => ({
      value: time,
      label: time,
      durationMinutes: availability.weekendEventDurationMinutes,
    }))
}

function getAvailableTimeSlots(date: Date) {
  const dateKey = formatInputDate(date)
  const blockedTimes =
    availability.blockedTimes[dateKey as keyof typeof availability.blockedTimes] ?? []
  const slots = isWeekend(date)
    ? getWeekendTimeSlots()
    : [
        {
          value: availability.weekdayRange.startTime,
          label: availability.weekdayRange.label,
          durationMinutes: availability.weekdayRange.durationMinutes,
        },
      ]

  return slots.filter((slot) => !blockedTimes.includes(slot.value))
}

function withRomanticValidity<T extends HTMLInputElement | HTMLSelectElement>(message: string) {
  return (event: React.FormEvent<T>) => {
    event.currentTarget.setCustomValidity(message)
  }
}

function clearValidity<T extends HTMLInputElement | HTMLSelectElement>(event: React.FormEvent<T>) {
  event.currentTarget.setCustomValidity('')
}

function BookingPage() {
  const [searchParams] = useSearchParams()
  const queryString = searchParams.toString()
  const queryName = searchParams.get('name')?.trim() ?? ''
  const withQuery = (path: string) => (queryString ? `${path}?${queryString}` : path)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successName, setSuccessName] = useState('')
  const selectedDateTimeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : []
  const selectedSlot = selectedDateTimeSlots.find((slot) => slot.value === selectedTime)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    if (!selectedDate || !selectedTime || !selectedSlot) {
      window.alert('Pick a date and time, even Cupid needs a schedule to work with.')
      return
    }

    const form = event.currentTarget
    const formData = new FormData(event.currentTarget)
    const name = getFormValue(formData, 'name')
    const plan = getFormValue(formData, 'plan')
    const goal = getFormValue(formData, 'goal')
    const location = getFormValue(formData, 'location')
    const date = formatInputDate(selectedDate)
    const contact = getFormValue(formData, 'contact')
    const note = getFormValue(formData, 'note')

    setIsSubmitting(true)

    try {
      const response = await fetch(createBookingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(supabaseAnonKey
            ? {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
              }
            : {}),
        },
        body: JSON.stringify({
          name,
          plan,
          goal,
          location,
          bookingDate: date,
          bookingTime: selectedSlot.label,
          contact,
          specialRequest: note,
        }),
      })

      if (!response.ok) {
        const message = await response.text()
        setSubmitError(
          message || 'The date committee fumbled the paperwork mid-swoon. Try again in a minute.',
        )
        return
      }
    } catch {
      setSubmitError('The date committee fumbled the paperwork mid-swoon. Try again in a minute.')
      return
    } finally {
      setIsSubmitting(false)
    }

    setSuccessName(name)
    form.reset()
    setSelectedDate(undefined)
    setSelectedTime('')
    fireEmojiConfetti()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4efe4] px-4 py-10 sm:px-6 sm:py-16">
      <section className="w-full max-w-2xl rounded-3xl border-2 border-stone-950 bg-[#faf7f0] p-5 sm:p-10">
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-stone-950 sm:text-4xl">
          Choose your romantic nonsense here.
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Fill this out so our very serious date committee can review your application.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium text-stone-950">
          <span className="rounded-full border border-stone-950 px-4 py-2">Cute plans only</span>
          <span className="rounded-full border border-stone-950 px-4 py-2">No ghosting clause</span>
          <span className="rounded-full border border-stone-950 px-4 py-2">Snacks improve approval odds</span>
        </div>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Your name
            <input
              required
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={queryName}
              placeholder="The cute applicant"
              onInvalid={withRomanticValidity(
                'We cannot set up a rendezvous with a mystery person, name yourself.',
              )}
              onChange={clearValidity}
              className="w-full min-w-0 rounded-2xl border border-stone-400 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-950"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Date plan
            <select
              required
              name="plan"
              defaultValue=""
              onInvalid={withRomanticValidity(
                'Do not leave us hanging like a bad first date, pick a plan.',
              )}
              onChange={clearValidity}
              className="w-full min-w-0 rounded-2xl border border-stone-400 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-950"
            >
              <option value="" disabled>
                Pick your chaos
              </option>
              <option>Coffee and unnecessary eye contact</option>
              <option>Walk and talk like we are in a movie</option>
              <option>Picnic like with snacks and awkward compliments</option>
              <option>Spontaneous us</option>
              <option>Other (please specify in special request)</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-700">
            What is the goal?
            <select
              required
              name="goal"
              defaultValue=""
              onInvalid={withRomanticValidity(
                'Every good romance needs a mission statement, pick one.',
              )}
              onChange={clearValidity}
              className="w-full min-w-0 rounded-2xl border border-stone-400 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-950"
            >
              <option value="" disabled>
                Declare your mission
              </option>
              <option>Friend vibes, but make it cute</option>
              <option>Business, allegedly</option>
              <option>Dating with intentional eye contact</option>
              <option>Long-term potential, no pressure but also pressure</option>
              <option>Short and sweet, like a good compliment</option>
              <option>Wherever the wind blows us</option>
              <option>Plot twist, I will explain later</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Location/City
            <input
              required
              name="location"
              type="text"
              placeholder="Cafe, park, moonlit bench, or surprise coordinates"
              onInvalid={withRomanticValidity(
                'Even secret admirers need a location to show up to.',
              )}
              onChange={clearValidity}
              className="w-full min-w-0 rounded-2xl border border-stone-400 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-950"
            />
          </label>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.75fr)] lg:items-start">
            <div className="grid gap-2 text-sm font-medium text-stone-700">
              Pick a day
              <div className="overflow-x-auto rounded-3xl border border-stone-400 bg-white p-2 sm:p-3 lg:min-h-[344px]">
                <DayPicker
                  className="mx-auto max-w-full [--rdp-day-height:2.25rem] [--rdp-day-width:2.25rem] [--rdp-day_button-height:2.25rem] [--rdp-day_button-width:2.25rem] sm:[--rdp-day-height:2.75rem] sm:[--rdp-day-width:2.75rem] sm:[--rdp-day_button-height:2.75rem] sm:[--rdp-day_button-width:2.75rem]"
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date)
                    setSelectedTime('')
                  }}
                  disabled={[
                    { before: new Date() },
                    (date) => blockedDates.has(formatInputDate(date)),
                    (date) => getAvailableTimeSlots(date).length === 0,
                  ]}
                  classNames={{
                    selected: 'bg-stone-950 text-stone-50 rounded-full',
                    today: 'font-bold text-stone-950',
                    chevron: 'fill-stone-950',
                  }}
                />
              </div>
            </div>

            {selectedDate ? (
              <div className="grid gap-2 text-sm font-medium text-stone-700">
                Available time
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {selectedDateTimeSlots.map((timeSlot) => (
                    <button
                      key={timeSlot.value}
                      type="button"
                      onClick={() => setSelectedTime(timeSlot.value)}
                      className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                        selectedTime === timeSlot.value
                          ? 'border-stone-950 bg-stone-950 text-stone-50'
                          : 'border-stone-400 bg-white text-stone-700 hover:border-stone-950'
                      }`}
                    >
                      {timeSlot.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="rounded-2xl bg-stone-200 px-4 py-3 text-sm font-medium text-stone-600 lg:mt-7">
                Pick a day first, then the time options will reveal themselves like a
                romantic plot twist.
              </p>
            )}
          </div>

          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Contact
            <input
              required
              name="contact"
              type="text"
              placeholder="WhatsApp, phone, or secret pigeon"
              onInvalid={withRomanticValidity(
                'Carrier pigeons are unreliable, leave us a real way to reach you.',
              )}
              onChange={clearValidity}
              className="w-full min-w-0 rounded-2xl border border-stone-400 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-950"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-stone-700">
            Special request
            <textarea
              name="note"
              rows={4}
              placeholder="Food cravings, outfit hints, or compliments accepted here"
              className="w-full min-w-0 resize-none rounded-2xl border border-stone-400 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-950"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-stone-950 px-6 py-3.5 text-sm font-semibold text-stone-50 transition hover:-translate-y-0.5 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            {isSubmitting ? 'Sending to the date committee...' : 'Submit date request'}
          </button>
          {submitError ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </p>
          ) : null}
        </form>

        <Link
          to={withQuery('/')}
          className="mt-5 inline-flex items-center justify-center rounded-xl border border-stone-400 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-900"
        >
          Back to the charm
        </Link>
      </section>

      {successName ? (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-stone-950/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-stone-400 bg-stone-50 p-6 text-center shadow-xl sm:p-8">
            <span className="inline-flex rounded-full border border-stone-950 px-4 py-2 text-sm font-semibold text-stone-950">
              Date committee approved
            </span>
            <h2
              id="booking-success-title"
              className="mt-5 text-4xl font-extrabold tracking-tight text-stone-950"
            >
              Congratulations, {successName}!
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Your request is saved. Please prepare your best smile; suspiciously cute
              activities may be scheduled soon.
            </p>
            <button
              type="button"
              onClick={() => setSuccessName('')}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-6 py-3.5 text-sm font-semibold text-stone-50 transition hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
            >
              Sounds good
            </button>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default BookingPage
