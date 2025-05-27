import { Suspense } from 'react'

export default function PerfilLayout({ children }) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      {children}
    </Suspense>
  )
} 