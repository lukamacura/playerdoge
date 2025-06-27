'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'


const allGames: Game[] = [ 
  {
    name: 'Frost & Flame: King of Avalon',
    category: 'Strategy & War',
    image: '/images/games/frostandflame.webp',
    slug: 'frost-and-flame-king-of-avalon'
  },
  {
    name: 'Guns of Glory: Lost Island',
    category: 'Strategy & War',
    image: '/images/games/gunsofglory.webp',
    slug: 'guns-of-glory-lost-island'
  },
  {
    name: 'Sea of Conquest: Pirate War',
    category: 'Naval & Adventure',
    image: '/images/games/seaofconquest.webp',
    slug: 'sea-of-conquest-pirate-war'
  },
  {
    name: 'State of Survival: Zombie War',
    category: 'Survival & Zombie',
    image: '/images/games/stateofsurvival.webp',
    slug: 'state-of-survival-zombie-war'
  },
  {
    name: 'Whiteout Survival',
    category: 'Survival & Zombie',
    image: '/images/games/whiteout.webp',
    slug: 'whiteout-survival'
  },
  {
    name: 'Kingshot',
    category: 'Fantasy / RPG',
    image: '/images/games/kingshot.webp',
    slug: 'kingshot'
  },
  {
    name: 'Diablo Immortal',
    category: 'Fantasy / RPG',
    image: '/images/games/diablo.webp',
    slug: 'diablo-immortal'
  },
  {
    name: 'Last War: Survival Game',
    category: 'Survival & Zombie',
    image: '/images/games/lastwar.webp',
    slug: 'last-war-survival-game'
  },
  {
    name: 'Last Z: Survival Shooter',
    category: 'Survival & Zombie',
    image: '/images/games/lastz.webp',
    slug: 'last-z-survival-shooter'
  },
  {
    name: 'Misty Continent: Cursed Island',
    category: 'Naval & Adventure',
    image: '/images/games/cursedisland.webp',
    slug: 'misty-continent-cursed-island'
  },
  {
    name: 'The Grand Mafia',
    category: 'Strategy & War',
    image: '/images/games/grandmafia.webp',
    slug: 'the-grand-mafia'
  },
  {
    name: 'Mafia City',
    category: 'Strategy & War',
    image: '/images/games/mafiacity.webp',
    slug: 'mafia-city'
  },
  {
    name: 'Primitive Era: 10000BC',
    category: 'Survival & Zombie',
    image: '/images/games/primitiveera.webp',
    slug: 'primitive-era-10000bc'
  },
  {
    name: 'Evony: The Kings Return',
    category: 'Strategy & War',
    image: '/images/games/kingsreturn.webp',
    slug: 'evony-the-kings-return'
  },
  {
    name: 'Dark War Survival',
    category: 'Survival & Zombie',
    image: '/images/games/darkwar.webp',
    slug: 'dark-war-survival'
  },
  {
    name: 'Call of Dragons',
    category: 'Fantasy / RPG',
    image: '/images/games/callofdragons.webp',
    slug: 'call-of-dragons'
  },
  {
    name: 'Rise of the Kings',
    category: 'Strategy & War',
    image: '/images/games/riseofthekings.webp',
    slug: 'rise-of-the-kings'
  },
  {
    name: 'Total Battle: Strategy Games',
    category: 'Strategy & War',
    image: '/images/games/totalbattle.webp',
    slug: 'total-battle-strategy-games'
  },
  {
    name: 'Doomsday: Last Survivors',
    category: 'Survival & Zombie',
    image: '/images/games/doomsday.webp',
    slug: 'doomsday-last-survivors'
  },
  {
    name: 'DC: Dark Legion',
    category: 'Fantasy / RPG',
    image: '/images/games/darklegion.webp',
    slug: 'dc-dark-legion'
  },
  {
    name: 'Rise of Castles: Ice and Fire',
    category: 'Strategy & War',
    image: '/images/games/riseofcastles.webp',
    slug: 'rise-of-castles-ice-and-fire'
  },
  {
    name: 'Vikings Rise: Valhalla',
    category: 'Strategy & War',
    image: '/images/games/vikings.webp',
    slug: 'vikings-rise-valhalla'
  },
  {
    name: 'Age of Origins',
    category: 'Survival & Zombie',
    image: '/images/games/ageoforigins.webp',
    slug: 'age-of-origins'
  },
  {
    name: 'War and Order',
    category: 'Strategy & War',
    image: '/images/games/warandorder.webp',
    slug: 'war-and-order'
  },
  {
    name: 'Warpath: Ace Shooter',
    category: 'Shooter / Military',
    image: '/images/games/warpath.webp',
    slug: 'warpath-ace-shooter'
  },
  {
    name: 'Last Fortress: Underground',
    category: 'Survival & Zombie',
    image: '/images/games/lastfortress.webp',
    slug: 'last-fortress-underground'
  },
  {
    name: 'Top War: Battle Game',
    category: 'Strategy & War',
    image: '/images/games/topwar.webp',
    slug: 'top-war-battle-game'
  },
  {
    name: 'Age of Empires Mobile',
    category: 'Strategy & War',
    image: '/images/games/ageofempires.webp',
    slug: 'age-of-empires-mobile'
  },
  {
    name: 'Avatar: Realms Collide',
    category: 'Fantasy / RPG',
    image: '/images/games/avatar.webp',
    slug: 'avatar-realms-collide'
  },
  {
    name: 'Lands of Jail',
    category: 'Strategy & War',
    image: '/images/games/landsofjail.webp',
    slug: 'lands-of-jail'
  }
]

type Game = {
  name: string
  category: string
  image: string
  slug: string
}



const categories = [
'All',
  'Strategy & War',
  'Naval & Adventure',
  'Survival & Zombie',
  'Fantasy / RPG',
  'Shooter / Military'
]

const sortOptions = ['A-Z', 'Z-A']

export default function GamesPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('A-Z')

  const filtered = allGames
    .filter((game) =>
      game.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === 'All' || game.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === 'A-Z') return a.name.localeCompare(b.name)
      else return b.name.localeCompare(a.name)
    })

  return (
    <main className="bg-[#FEFFD2] mt-16 min-h-screen py-10 px-4 md:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold font-montserrat text-[#1D1D1D] mb-2">
            Games you love. Deals you deserve.
          </h1>
          <p className="text-[#4b4b4b] text-base font-inter md:text-lg">
            Get the best top-up offers and save more every time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10">
          <input
            type="text"
            placeholder="Search Games"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="w-full md:w-[250px] bg-transparent placeholder-[#4d4d4d] font-montserrat rounded-lg border border-black px-4 py-2 text-sm"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-[150px] bg-transparent font-montserrat border text-[#4d4d4d] border-black px-4 py-2 rounded-lg text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-[150px] bg-transparent font-montserrat border text-[#4d4d4d] border-black px-4 py-2 rounded-lg text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Game Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filtered.map((game, i) => (
    <Link href={`/games/${game.slug}`} key={i}>
      <div className="bg-transparent border border-[#1d1d1d] p-3 rounded-xl flex gap-4 items-center shadow-lg hover:shadow-2xl transition cursor-pointer">
        <div className="w-[120px] h-[80px] relative rounded-lg overflow-hidden">
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-md md:text-xl font-montserrat text-[#1d1d1d]">
            {game.name}
          </h3>
          <p className="text-sm mt-1 bg-[#FFEFC4] w-fit px-2 py-1 rounded font-inter font-medium">
            {game.category}
          </p>
        </div>
      </div>
    </Link>
  ))}
</div>


      </div>
    </main>
  )
}
