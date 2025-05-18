import { useState } from 'preact/hooks'

const ProfileSearch = () => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = (e: Event) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    window.location.href = `/profile/${username.trim()}`
  }

  return (
    <form onSubmit={handleSearch} class="max-w-md mx-auto">
      <div class="relative">
        <input
          type="text"
          value={username}
          onInput={(e) => setUsername(e.currentTarget.value)}
          placeholder="Buscar usuario de GitHub..."
          class="text-text-primary w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
        >
          {isLoading ? <span class="animate-spin">↻</span> : 'Buscar'}
        </button>
      </div>
      {error && <p class="text-red-500 mt-2">{error}</p>}
    </form>
  )
}
export default ProfileSearch
