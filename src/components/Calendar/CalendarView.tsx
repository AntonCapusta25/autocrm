import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarAppointment } from '../../types';
import { 
  Calendar as CalendarIcon, Clock, Plus, Video, MapPin, 
  User, CheckCircle2, ChevronLeft, ChevronRight, X
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, contacts, currentUser } = useApp();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Form State
  const [title, setTitle] = useState('');
  const [contactId, setContactId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('14:45');
  const [locationType, setLocationType] = useState<any>('google_meet');
  const [notes, setNotes] = useState('');

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const contact = contacts.find(c => c.id === contactId);

    addAppointment({
      title: title.trim(),
      contact_id: contactId || undefined,
      contact_name: contact ? `${contact.first_name} ${contact.last_name}` : undefined,
      assigned_to: currentUser.user_id,
      assigned_to_name: currentUser.name,
      date,
      start_time: startTime,
      end_time: endTime,
      location_type: locationType,
      meeting_link: locationType === 'google_meet' ? `https://meet.google.com/autoflow-${Date.now().toString().slice(-4)}` : undefined,
      notes: notes.trim() || undefined,
      status: 'confirmed'
    });

    setTitle('');
    setContactId('');
    setNotes('');
    setBookingModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/assets/clay/calendar.png" 
              alt="Appointments" 
              style={{ width: '32px', height: '32px', objectFit: 'contain' }} 
            />
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Smart Appointments & Calendar
            </h1>
            <span className="notion-badge lilac">Smart Scheduling</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Round-robin availability, video meeting links, and real-time CRM calendar sync.
          </p>
        </div>

        <button 
          className="btn btn-lilac"
          onClick={() => setBookingModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} /> Book Appointment
        </button>
      </div>

      {/* Appointments List / Grid */}
      {appointments.length === 0 ? (
        <div className="notion-card" style={{ minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem' }}>📅</div>
          <div style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-main)' }}>No appointments scheduled yet</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
            Book your first client meeting or discovery call to sync it with your workspace calendar.
          </div>
          <button className="btn btn-lilac btn-sm" onClick={() => setBookingModalOpen(true)}>
            <Plus size={14} /> Book First Appointment
          </button>
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {appointments.map(appt => (
          <div 
            key={appt.id} 
            className="notion-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '180px',
              borderLeft: '4px solid var(--lilac-400)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="notion-tag lilac" style={{ textTransform: 'uppercase', fontSize: '0.68rem' }}>
                  {appt.location_type.replace('_', ' ')}
                </span>
                <span className="notion-tag emerald" style={{ fontSize: '0.68rem' }}>
                  {appt.status}
                </span>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '10px' }}>
                {appt.title}
              </div>

              {appt.contact_name && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  <User size={13} style={{ color: 'var(--lilac-300)' }} />
                  <span>With <strong>{appt.contact_name}</strong></span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                <Clock size={13} />
                <span className="tabular-nums">{appt.date} • {appt.start_time} - {appt.end_time}</span>
              </div>

              {appt.notes && (
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                  "{appt.notes}"
                </div>
              )}
            </div>

            {appt.meeting_link && (
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--notion-border)' }}>
                <a 
                  href={appt.meeting_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', color: 'var(--lilac-300)', fontSize: '0.76rem' }}
                >
                  <Video size={13} /> Join Video Meeting
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {/* Book Appointment Modal */}
      {bookingModalOpen && (
        <div className="modal-backdrop" onClick={() => setBookingModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Book Client Appointment</h3>
              <button 
                type="button" 
                onClick={() => setBookingModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleBook}>
              <div className="modal-body">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Discovery Call with CEO"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Attendee Contact
                  </label>
                  <select
                    className="select"
                    value={contactId}
                    onChange={e => setContactId(e.target.value)}
                  >
                    <option value="">-- Internal / No Specific Contact --</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.first_name} {c.last_name} ({c.company_name || c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      className="input"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      Start
                    </label>
                    <input
                      type="time"
                      className="input"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      End
                    </label>
                    <input
                      type="time"
                      className="input"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Meeting Platform
                  </label>
                  <select
                    className="select"
                    value={locationType}
                    onChange={e => setLocationType(e.target.value)}
                  >
                    <option value="google_meet">Google Meet (Auto-generated Link)</option>
                    <option value="zoom">Zoom Video</option>
                    <option value="phone">Direct Phone Call</option>
                    <option value="in_person">In-Person Office Meeting</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Meeting Notes / Agenda
                  </label>
                  <textarea
                    className="textarea"
                    rows={2}
                    placeholder="Objectives, topics, links..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setBookingModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-lilac">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

