import FileConverter from './components/FileConverter'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold dark:text-white">
        File Converter
      </h1>
      <FileConverter />
    </main>
  )
}
