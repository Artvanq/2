export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: 'black', color: 'white' }}>
        {children}
      </body>
    </html>
  )
}