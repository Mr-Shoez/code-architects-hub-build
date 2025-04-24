import Layout from "../components/Layout";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

const initialEvents = [
  {
    id: 1,
    title: "Web Development Workshop",
    date: "2023-05-15T14:00:00",
    location: "Computer Lab 101",
    description: "Learn the basics of HTML, CSS, and JavaScript in this hands-on workshop. Bring your laptops!",
    attendees: ["Jane Doe", "John Smith", "Alex Johnson"],
    rsvpCount: 15
  },
  {
    id: 2,
    title: "Python Programming Contest",
    date: "2023-05-20T13:00:00",
    location: "Auditorium",
    description: "Test your Python skills in this competitive programming contest with prizes for the top performers!",
    attendees: ["Sam Williams", "Taylor Brown", "Casey Miller"],
    rsvpCount: 28
  },
  {
    id: 3,
    title: "Mobile App Development Talk",
    date: "2023-05-25T15:30:00",
    location: "Online",
    description: "Join us for a virtual session about mobile app development using React Native and Flutter.",
    attendees: ["Jane Doe", "Casey Miller"],
    rsvpCount: 42
  },
  {
    id: 4,
    title: "Data Science and Machine Learning Seminar",
    date: "2023-06-05T14:00:00",
    location: "Room 204",
    description: "Introduction to data science concepts and practical machine learning applications in industry.",
    attendees: ["John Smith", "Sam Williams"],
    rsvpCount: 20
  }
];

const Events = () => {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<null | typeof initialEvents[0]>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleRSVP = (eventId: number, status: 'going' | 'notGoing') => {
    console.log(`RSVP ${status} for event ${eventId}`);
    // This would update the database in a real app
  };
  
  const handleCreateEvent = () => {
    console.log("Create new event");
    setShowCreateModal(true);
  };
  
  const handleViewDetails = (event: typeof initialEvents[0]) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const filteredEvents = selectedDate 
    ? events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      })
    : events;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy">Upcoming Events</h1>
          <button 
            className="bg-lime text-navy font-medium py-2 px-4 rounded-md hover:bg-lime/90 transition flex items-center"
            onClick={handleCreateEvent}
            data-create-event
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Create Event
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-lime text-navy hover:bg-lime/90",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-white rounded-lg shadow-md">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">No events scheduled for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'this date'}</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  data-event-id={event.id}
                >
                  <div className="bg-navy text-white p-4">
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <i className="fas fa-calendar-day text-lime mr-2"></i>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt text-lime mr-2"></i>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-medium">
                        <i className="fas fa-users text-gray-500 mr-1"></i> {event.rsvpCount} people attending
                      </p>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button 
                        className="bg-lime text-navy font-medium py-2 px-4 rounded-md hover:bg-lime/90 transition w-full"
                        onClick={() => handleRSVP(event.id, 'going')}
                      >
                        <i className="fas fa-check mr-1"></i> Going
                      </button>
                      <button 
                        className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition w-full"
                        onClick={() => handleRSVP(event.id, 'notGoing')}
                      >
                        <i className="fas fa-times mr-1"></i> Not Going
                      </button>
                      <button 
                        className="text-navy font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition w-full text-center"
                        onClick={() => handleViewDetails(event)}
                      >
                        <i className="fas fa-info-circle mr-1"></i> View Details
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => console.log(`Edit event ${event.id}`)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => console.log(`Delete event ${event.id}`)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {showDetailsModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowDetailsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <h2 className="text-2xl font-bold text-navy mb-4">{selectedEvent.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-2">
                    <i className="fas fa-calendar-day text-lime mr-2"></i>
                    <span className="font-medium">Date & Time:</span> {formatDate(selectedEvent.date)}
                  </p>
                  <p className="mb-4">
                    <i className="fas fa-map-marker-alt text-lime mr-2"></i>
                    <span className="font-medium">Location:</span> {selectedEvent.location}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Description:</h4>
                    <p className="text-gray-700">{selectedEvent.description}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Attendees ({selectedEvent.attendees.length}):</h4>
                    <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                      {selectedEvent.attendees.length > 0 ? (
                        <ul className="space-y-1">
                          {selectedEvent.attendees.map((attendee, index) => (
                            <li key={index} className="text-sm">
                              <i className="fas fa-user text-gray-400 mr-2"></i> {attendee}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No attendees yet</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 mt-4">
                    <button 
                      className="bg-lime text-navy font-medium py-2 px-4 rounded-md hover:bg-lime/90 transition w-full"
                      onClick={() => {
                        handleRSVP(selectedEvent.id, 'going');
                        setShowDetailsModal(false);
                      }}
                    >
                      <i className="fas fa-check mr-1"></i> I'm Going
                    </button>
                    <button 
                      className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition w-full"
                      onClick={() => {
                        handleRSVP(selectedEvent.id, 'notGoing');
                        setShowDetailsModal(false);
                      }}
                    >
                      <i className="fas fa-times mr-1"></i> Not Going
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <h2 className="text-2xl font-bold text-navy mb-6">Create New Event</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                    placeholder="Enter location or 'Online'"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                    placeholder="Enter event description"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    className="bg-lime text-navy font-medium py-2 px-4 rounded-md hover:bg-lime/90 transition"
                    onClick={() => {
                      console.log("Event created");
                      setShowCreateModal(false);
                    }}
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;
