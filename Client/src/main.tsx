import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './Context/UserContext.tsx'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/Theme/theme-provider.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider>
          <App />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
