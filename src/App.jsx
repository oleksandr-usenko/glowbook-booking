import './App.css'

function App() {
  return (
    <div className="booking-page">
      <header className="booking-header">
        <h1>Master Booking</h1>
      </header>

      <main className="booking-content">
        <section className="master-info">
          <div className="master-info-placeholder">
            {/* Master information will go here */}
          </div>
        </section>

        <section className="services-list">
          <h2>Services</h2>
          <div className="services-placeholder">
            {/* Services list will go here */}
          </div>
        </section>

        <section className="booking-calendar">
          <h2>Schedule</h2>
          <div className="calendar-placeholder">
            {/* Calendar and time slots will go here */}
          </div>
        </section>
      </main>

      <footer className="booking-footer">
        {/* Footer content */}
      </footer>
    </div>
  )
}

export default App
