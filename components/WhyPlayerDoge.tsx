'use client'

export default function WhyPlayerDoge() {
  return (
    <section className="bg-[#FEFFD2] text-[#1D1D1D] py-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Left text content */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">
            Why PlayerDoge?
          </h2>
          <p className="mt-4 text-lg leading-relaxed font-inter">
            PlayerDoge is a <strong className="font-semibold">fully legit</strong> top-up service focused on safety and savings — no bans, no shortcuts. <br />
            With years of experience and thousands of happy users, we’re the trusted way to get cheaper <strong className="font-semibold">game packs</strong>, backed by real people and real results.
          </p>
        </div>

        {/* Right stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '30min', label: 'Fast delivery' },
            { value: '50+', label: 'Supported games' },
            { value: '200+', label: 'Satisfied users' },
            { value: '100%', label: 'Payment security' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-[#FFEFC4] rounded-lg text-center py-6 px-4 shadow-sm"
            >
              <div className="text-2xl md:text-3xl font-bold text-[#FF7D29] font-montserrat">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-[#1D1D1D] font-inter">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
