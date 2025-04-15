
import Layout from "../components/Layout";
import { useState } from "react";

// Mock data for member cards
const initialMembers = [
  { id: 1, name: "Jane Doe", role: "President", image: "/placeholder.svg", email: "jane.doe@rosebank.edu", stNumber: "ST12345678", bio: "Computer Science major with a passion for AI and machine learning." },
  { id: 2, name: "John Smith", role: "Vice President", image: "/placeholder.svg", email: "john.smith@rosebank.edu", stNumber: "ST23456789", bio: "Software Engineering student focused on web development and UX design." },
  { id: 3, name: "Alex Johnson", role: "Secretary", image: "/placeholder.svg", email: "alex.j@rosebank.edu", stNumber: "ST34567890", bio: "Cybersecurity enthusiast with experience in ethical hacking." },
  { id: 4, name: "Sam Williams", role: "Treasurer", image: "/placeholder.svg", email: "sam.w@rosebank.edu", stNumber: "ST45678901", bio: "Data Science student with strong analytical skills." },
  { id: 5, name: "Taylor Brown", role: "Member", image: "/placeholder.svg", email: "taylor.b@rosebank.edu", stNumber: "ST56789012", bio: "Mobile app developer specializing in React Native." },
  { id: 6, name: "Casey Miller", role: "Member", image: "/placeholder.svg", email: "casey.m@rosebank.edu", stNumber: "ST67890123", bio: "Game development enthusiast with Unity experience." },
];

const Members = () => {
  const [members, setMembers] = useState(initialMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<null | typeof initialMembers[0]>(null);
  const [showModal, setShowModal] = useState(false);
  
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "President":
        return "bg-navy text-white";
      case "Vice President":
        return "bg-blue-600 text-white";
      case "Secretary":
        return "bg-purple-600 text-white";
      case "Treasurer":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };
  
  const handleMemberClick = (member: typeof initialMembers[0]) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-8 text-center">Member Directory</h1>
        
        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-search-input
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
        
        {/* Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <div 
              key={member.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => handleMemberClick(member)}
              data-user-id={member.id}
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 mr-4 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-navy">{member.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeClass(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Member Details Modal */}
        {showModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-navy">{selectedMember.name}</h2>
                <span className={`text-sm px-2 py-1 rounded-full my-2 ${getRoleBadgeClass(selectedMember.role)}`}>
                  {selectedMember.role}
                </span>
                
                <div className="w-full mt-4 space-y-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedMember.email.replace(/(\w{2})[\w.-]+@/, "$1****@")}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Student Number:</span>{" "}
                    {selectedMember.stNumber.substring(0, 4) + "****"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Bio:</span>{" "}
                    {selectedMember.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Members;
