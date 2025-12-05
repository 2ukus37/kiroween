import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WalletConnect } from './components/WalletConnect';
import { VideoUpload } from './components/VideoUpload';
import { VideoFeed } from './components/VideoFeed';
import { VideoPlayerPage } from './pages/VideoPlayerPage';
import { CreatorDashboard } from './components/CreatorDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-dark text-ghost">
        {/* Header */}
        <header className="border-b border-accent-purple/30 bg-bg-darker">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <h1 className="text-2xl font-bold animate-ghost-float">
                  👻 DeadTrendTracker
                </h1>
              </Link>

              <nav className="flex items-center gap-6">
                <Link to="/" className="hover:text-accent-purple transition-colors">
                  Feed
                </Link>
                <Link to="/upload" className="hover:text-accent-purple transition-colors">
                  Upload
                </Link>
                <Link to="/dashboard" className="hover:text-accent-purple transition-colors">
                  Dashboard
                </Link>
                <WalletConnect />
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                      Resurrecting Dead Social Media Platforms 🎃
                    </h2>
                    <p className="text-accent-purple">
                      Upload videos, earn tokens, mint NFTs
                    </p>
                  </div>
                  <VideoFeed />
                </div>
              }
            />
            <Route path="/upload" element={<VideoUpload />} />
            <Route path="/dashboard" element={<CreatorDashboard />} />
            <Route path="/video/:id" element={<VideoPlayerPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-accent-purple/30 bg-bg-darker mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
            <p>Built with 👻 for Kiroween Hackathon</p>
            <p className="mt-2">Powered by Polygon • IPFS • Firebase</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
