
import Layout from "../components/Layout";
import { useState } from "react";

// Mock data for announcements
const initialAnnouncements = [
  {
    id: 1,
    author: "Jane Doe",
    role: "President",
    content: "Welcome to the new codeArchitects platform! We're excited to launch this new hub for our coding club. Please take some time to explore the features and let us know what you think.",
    timestamp: "2023-05-01T10:00:00",
    likes: 15,
    isPinned: true,
    comments: [
      { id: 1, author: "John Smith", content: "This looks fantastic! Great job on the new platform.", timestamp: "2023-05-01T10:30:00" },
      { id: 2, author: "Alex Johnson", content: "Excited to see all the new features. When is the next meeting?", timestamp: "2023-05-01T11:15:00" }
    ]
  },
  {
    id: 2,
    author: "John Smith",
    role: "Vice President",
    content: "Reminder: Our next workshop on 'Introduction to React' is scheduled for this Friday at 3 PM in Computer Lab 101. Don't forget to bring your laptops!",
    timestamp: "2023-05-02T14:30:00",
    likes: 8,
    isPinned: false,
    comments: []
  },
  {
    id: 3,
    author: "Alex Johnson",
    role: "Secretary",
    content: "We're looking for volunteers to help with the upcoming hackathon. If you're interested, please fill out the form linked below by next Monday.\n\nhttps://example.com/volunteer-form",
    timestamp: "2023-05-03T09:45:00",
    likes: 5,
    isPinned: false,
    comments: [
      { id: 3, author: "Sam Williams", content: "I'd love to help out! Just submitted the form.", timestamp: "2023-05-03T10:20:00" }
    ]
  }
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [newComment, setNewComment] = useState("");
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleLike = (id: number) => {
    console.log(`Liked announcement ${id}`);
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, likes: announcement.id === id ? announcement.likes + 1 : announcement.likes }
        : announcement
    ));
  };
  
  const handleToggleComment = (id: number) => {
    setActiveCommentId(activeCommentId === id ? null : id);
    setNewComment("");
  };
  
  const handlePostComment = (announcementId: number) => {
    if (!newComment.trim()) return;
    
    console.log(`Posted comment on announcement ${announcementId}: ${newComment}`);
    
    const newCommentObj = {
      id: Math.floor(Math.random() * 1000),
      author: "Current User", // In a real app, this would be the current user
      content: newComment,
      timestamp: new Date().toISOString()
    };
    
    setAnnouncements(announcements.map(announcement => 
      announcement.id === announcementId 
        ? { 
            ...announcement, 
            comments: [...announcement.comments, newCommentObj]
          }
        : announcement
    ));
    
    setNewComment("");
  };
  
  const handleCreateAnnouncement = () => {
    console.log("Create new announcement");
    setShowCreateModal(true);
  };
  
  const handlePinUnpin = (id: number) => {
    console.log(`${announcements.find(a => a.id === id)?.isPinned ? 'Unpinned' : 'Pinned'} announcement ${id}`);
    setAnnouncements(announcements.map(announcement => 
      announcement.id === id 
        ? { ...announcement, isPinned: !announcement.isPinned }
        : announcement
    ));
  };
  
  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const regularAnnouncements = announcements.filter(a => !a.isPinned);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-navy">Club Announcements</h1>
          <button 
            className="bg-lime text-navy font-medium py-2 px-4 rounded-md hover:bg-lime/90 transition flex items-center"
            onClick={handleCreateAnnouncement}
            data-create-announcement
          >
            <i className="fas fa-plus mr-2"></i> Create Announcement
          </button>
        </div>
        
        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-navy mb-4 flex items-center">
              <i className="fas fa-thumbtack text-lime mr-2"></i> Pinned Announcements
            </h2>
            <div className="space-y-6">
              {pinnedAnnouncements.map(announcement => (
                <div 
                  key={announcement.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-lime"
                  data-announcement-id={announcement.id}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center mr-3">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy">{announcement.author}</h3>
                          <p className="text-xs text-gray-500">{announcement.role} • {formatDate(announcement.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button 
                          className="text-yellow-500 hover:text-yellow-700 mr-2"
                          onClick={() => handlePinUnpin(announcement.id)}
                          title="Unpin"
                        >
                          <i className="fas fa-thumbtack"></i>
                        </button>
                        <button 
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => console.log(`Edit announcement ${announcement.id}`)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => console.log(`Delete announcement ${announcement.id}`)}
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4 whitespace-pre-wrap">
                      {announcement.content}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button 
                        className="flex items-center text-gray-600 hover:text-navy"
                        onClick={() => handleLike(announcement.id)}
                      >
                        <i className="fas fa-heart text-red-500 mr-1"></i>
                        <span>{announcement.likes}</span>
                      </button>
                      <button 
                        className="flex items-center text-gray-600 hover:text-navy"
                        onClick={() => handleToggleComment(announcement.id)}
                      >
                        <i className="fas fa-comment mr-1"></i>
                        <span>{announcement.comments.length}</span>
                      </button>
                    </div>
                    
                    {/* Comments Section */}
                    {activeCommentId === announcement.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-sm mb-2">Comments</h4>
                        
                        {announcement.comments.length > 0 ? (
                          <div className="space-y-3 mb-4">
                            {announcement.comments.map(comment => (
                              <div key={comment.id} className="bg-gray-50 rounded-md p-3">
                                <div className="flex justify-between">
                                  <h5 className="font-medium text-sm">{comment.author}</h5>
                                  <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                                </div>
                                <p className="text-sm mt-1">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mb-4">No comments yet</p>
                        )}
                        
                        <div className="flex">
                          <input 
                            type="text" 
                            className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <button 
                            className="bg-navy text-white font-medium py-2 px-4 rounded-r-lg hover:bg-navy/90 transition"
                            onClick={() => handlePostComment(announcement.id)}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Regular Announcements */}
        <div className="space-y-6">
          {regularAnnouncements.map(announcement => (
            <div 
              key={announcement.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              data-announcement-id={announcement.id}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center mr-3">
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">{announcement.author}</h3>
                      <p className="text-xs text-gray-500">{announcement.role} • {formatDate(announcement.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="text-gray-400 hover:text-yellow-500 mr-2"
                      onClick={() => handlePinUnpin(announcement.id)}
                      title="Pin"
                    >
                      <i className="fas fa-thumbtack"></i>
                    </button>
                    <button 
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => console.log(`Edit announcement ${announcement.id}`)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => console.log(`Delete announcement ${announcement.id}`)}
                      title="Delete"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                
                <div className="mb-4 whitespace-pre-wrap">
                  {announcement.content}
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    className="flex items-center text-gray-600 hover:text-navy"
                    onClick={() => handleLike(announcement.id)}
                  >
                    <i className="fas fa-heart text-red-500 mr-1"></i>
                    <span>{announcement.likes}</span>
                  </button>
                  <button 
                    className="flex items-center text-gray-600 hover:text-navy"
                    onClick={() => handleToggleComment(announcement.id)}
                  >
                    <i className="fas fa-comment mr-1"></i>
                    <span>{announcement.comments.length}</span>
                  </button>
                </div>
                
                {/* Comments Section */}
                {activeCommentId === announcement.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-sm mb-2">Comments</h4>
                    
                    {announcement.comments.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {announcement.comments.map(comment => (
                          <div key={comment.id} className="bg-gray-50 rounded-md p-3">
                            <div className="flex justify-between">
                              <h5 className="font-medium text-sm">{comment.author}</h5>
                              <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">No comments yet</p>
                    )}
                    
                    <div className="flex">
                      <input 
                        type="text" 
                        className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <button 
                        className="bg-navy text-white font-medium py-2 px-4 rounded-r-lg hover:bg-navy/90 transition"
                        onClick={() => handlePostComment(announcement.id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Create Announcement Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCreateModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <h2 className="text-2xl font-bold text-navy mb-6">Create Announcement</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Content</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
                    placeholder="What would you like to announce?"
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="pin-announcement" 
                    className="rounded text-lime focus:ring-lime mr-2"
                  />
                  <label htmlFor="pin-announcement" className="text-sm text-gray-700">
                    Pin this announcement
                  </label>
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
                      console.log("Announcement created");
                      setShowCreateModal(false);
                    }}
                  >
                    Post Announcement
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

export default Announcements;
