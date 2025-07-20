import './Team.css'
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'

const Team = () => {
  // Sample team data - in a real app this would come from an API
  const facultyAdvisors = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      position: 'Faculty Advisor',
      department: 'Computer Science & Engineering',
      image: '/images/team/faculty-1.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'rajesh@example.com'
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      position: 'Faculty Co-Advisor',
      department: 'Business Administration',
      image: '/images/team/faculty-2.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'priya@example.com'
    }
  ]
  
  const coreTeam = [
    {
      id: 1,
      name: 'Amit Patel',
      position: 'President',
      department: 'Computer Science, Final Year',
      image: '/images/team/core-1.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'amit@example.com'
    },
    {
      id: 2,
      name: 'Neha Singh',
      position: 'Vice President',
      department: 'Electronics Engineering, Final Year',
      image: '/images/team/core-2.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'neha@example.com'
    },
    {
      id: 3,
      name: 'Rahul Verma',
      position: 'Technical Lead',
      department: 'Computer Science, Final Year',
      image: '/images/team/core-3.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'rahul@example.com'
    },
    {
      id: 4,
      name: 'Anika Gupta',
      position: 'Events Manager',
      department: 'Business Administration, 3rd Year',
      image: '/images/team/core-4.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'anika@example.com'
    },
    {
      id: 5,
      name: 'Vivek Sharma',
      position: 'Marketing Head',
      department: 'Mass Communication, Final Year',
      image: '/images/team/core-5.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'vivek@example.com'
    },
    {
      id: 6,
      name: 'Riya Patel',
      position: 'Outreach Coordinator',
      department: 'Electronics Engineering, 3rd Year',
      image: '/images/team/core-6.jpg',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'riya@example.com'
    }
  ]
  
  const teamMembers = [
    {
      id: 1,
      name: 'Sanjay Kumar',
      position: 'Technical Team',
      department: 'Computer Science, 3rd Year',
      image: '/images/team/team-1.jpg'
    },
    {
      id: 2,
      name: 'Anushka Sharma',
      position: 'Events Team',
      department: 'Civil Engineering, 2nd Year',
      image: '/images/team/team-2.jpg'
    },
    {
      id: 3,
      name: 'Varun Singh',
      position: 'Marketing Team',
      department: 'Mechanical Engineering, 3rd Year',
      image: '/images/team/team-3.jpg'
    },
    {
      id: 4,
      name: 'Pooja Reddy',
      position: 'Content Team',
      department: 'English Literature, 2nd Year',
      image: '/images/team/team-4.jpg'
    },
    {
      id: 5,
      name: 'Arjun Nair',
      position: 'Design Team',
      department: 'Architecture, 3rd Year',
      image: '/images/team/team-5.jpg'
    },
    {
      id: 6,
      name: 'Kritika Jain',
      position: 'Public Relations',
      department: 'Media Studies, 2nd Year',
      image: '/images/team/team-6.jpg'
    },
    {
      id: 7,
      name: 'Rohit Kumar',
      position: 'Events Team',
      department: 'Electrical Engineering, 2nd Year',
      image: '/images/team/team-7.jpg'
    },
    {
      id: 8,
      name: 'Shreya Mehta',
      position: 'Marketing Team',
      department: 'Business Administration, 2nd Year',
      image: '/images/team/team-8.jpg'
    }
  ]

  return (
    <div className="team-page">
      <div className="page-banner">
        <div className="container">
          <h1 className="page-title">Our Team</h1>
          <p className="page-subtitle">Meet the passionate individuals behind E-Cell</p>
        </div>
      </div>
      
      <div className="container">
        <section className="team-section">
          <h2 className="section-title">Faculty Advisors</h2>
          <div className="faculty-grid">
            {facultyAdvisors.map(member => (
              <div className="faculty-card" key={member.id}>
                <div className="faculty-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="faculty-content">
                  <h3 className="faculty-name">{member.name}</h3>
                  <p className="faculty-position">{member.position}</p>
                  <p className="faculty-department">{member.department}</p>
                  <div className="faculty-social">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin />
                    </a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter />
                    </a>
                    <a href={`mailto:${member.email}`}>
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="team-section">
          <h2 className="section-title">Core Team</h2>
          <div className="core-grid">
            {coreTeam.map(member => (
              <div className="core-card" key={member.id}>
                <div className="core-image">
                  <img src={member.image} alt={member.name} />
                  <div className="core-social">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin />
                    </a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter />
                    </a>
                    <a href={`mailto:${member.email}`}>
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
                <div className="core-content">
                  <h3 className="core-name">{member.name}</h3>
                  <p className="core-position">{member.position}</p>
                  <p className="core-department">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="team-section">
          <h2 className="section-title">Team Members</h2>
          <div className="team-grid">
            {teamMembers.map(member => (
              <div className="team-card" key={member.id}>
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-content">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-position">{member.position}</p>
                  <p className="team-department">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Team
