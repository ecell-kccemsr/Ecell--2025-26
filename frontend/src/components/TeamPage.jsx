import React from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaEnvelope,
  FaUserPlus,
  FaInfoCircle,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import Header from "./Header";

const MemberCard = ({ member, index }) => {
  return (
    <motion.div
      className="member-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.05 }}
    >
      <div className="member-image-container">
        <img
          src={member.image || "/default-avatar.jpg"}
          alt={member.name}
          className="member-image"
        />
        <div className="member-overlay">
          <div className="member-social">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
              >
                <FaTwitter />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <FaGithub />
              </a>
            )}
            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} title="Email">
                <FaEnvelope />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="member-info">
        <h3 className="member-name">{member.name}</h3>
        <p className="member-position">{member.position}</p>
        <p className="member-department">{member.department}</p>
        {member.bio && <p className="member-bio">{member.bio}</p>}

        {member.skills && (
          <div className="member-skills">
            {member.skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TeamPage = () => {
  // Core Leadership Team
  const coreTeam = [
    {
      id: 1,
      name: "Vivek Pawar",
      position: "President",
      department: "Computer Engineering",
      image: "/team/president.jpg",
      bio: "Game developer and entrepreneur with a passion for building innovative solutions with resengal studio",
      skills: ["Leadership", "Strategy", "Game Development"],
      linkedin: "https://www.linkedin.com/in/vivekapawar-/",
      instagram: "https://instagram.com/vivekpawar",
      github: "https://github.com/vivekpawar",
      email: "ce23.vivek.pawar@kccemsr.edu.in",
    },
    {
      id: 2,
      name: "Samrath Singh",
      position: "Vice President",
      department: "Computer Engineering",
      image: "/team/Vp.jpeg",
      bio: "Passionate about AI & ML, leading initiatives to foster innovation and entrepreneurship.",
      skills: ["Operations", "Artificial Intelligence", "Machine Learning"],
      linkedin: "https://linkedin.com/in/samrathsingh",
      instagram: "https://instagram.com/samrathsingh",
      email: "vp@ecell.com",
    },
    {
      id: 3,
      name: "Daman Randhawa",
      position: "Secretary",
      department: "Administration",
      image: "/team/secretary.jpg",
      bio: "Managing organizational operations and ensuring smooth coordination across all departments.",
      skills: ["Administration", "Documentation", "Coordination"],
      linkedin: "https://linkedin.com/in/damanrandhawa",
      instagram: "https://instagram.com/damanrandhawa",
      email: "secretary@ecell.com",
    },
    {
      id: 4,
      name: "Vinay Vishwakarma",
      position: "Treasurer",
      department: "Finance",
      image: "/team/treasurer.jpg",
      bio: "Managing financial operations and budget planning for all E-Cell initiatives.",
      skills: ["Financial Management", "Budget Planning", "Analytics"],
      linkedin: "https://linkedin.com/in/vinayvishwakarma",
      email: "treasurer@ecell.com",
    },
  ];

  // Web Development Team
  const webDevTeam = [
    {
      id: 5,
      name: "Raaj Patkar",
      position: "Web Development Head",
      department: "Technical",
      image: "/team/webdev-head.jpg",
      bio: "Full-stack developer leading web development initiatives and building digital solutions.",
      skills: ["React", "Node.js", "Full Stack", "Leadership"],
      linkedin: "https://linkedin.com/in/raajpatkar",
      github: "https://github.com/raajpatkar",
      instagram: "https://instagram.com/raajpatkar",
      email: "raaj@ecell.com",
    },
    {
      id: 6,
      name: "Daivik Pawar",
      position: "Web Development Co-Head",
      department: "Technical",
      image: "/team/webdev-cohead.jpg",
      bio: "Passionate web developer specializing in modern frameworks and user experience design.",
      skills: ["Frontend", "UI/UX", "JavaScript", "React"],
      linkedin: "https://linkedin.com/in/daivikpawar",
      github: "https://github.com/daivikpawar",
      email: "daivik@ecell.com",
    },
  ];

  // Game Development Team
  const gameDevTeam = [
    {
      id: 7,
      name: "Aryan Yadav",
      position: "Game Development Head",
      department: "Technical",
      image: "/team/gamedev-head.jpg",
      bio: "Game development enthusiast creating immersive experiences and leading game dev initiatives.",
      skills: ["Unity", "Game Design", "C#", "3D Modeling"],
      linkedin: "https://linkedin.com/in/aryanyadav",
      github: "https://github.com/aryanyadav",
      email: "aryan.yadav@ecell.com",
    },
    {
      id: 8,
      name: "Aryan Wesavkar",
      position: "Game Development Co-Head",
      department: "Technical",
      image: "/team/gamedev-cohead.jpg",
      bio: "Creative game developer focusing on gameplay mechanics and interactive storytelling.",
      skills: ["Unreal Engine", "Game Programming", "Animation", "VR/AR"],
      linkedin: "https://linkedin.com/in/aryanwesavkar",
      github: "https://github.com/aryanwesavkar",
      email: "aryan.wesavkar@ecell.com",
    },
  ];

  // Event Management Team
  const eventTeam = [
    {
      id: 9,
      name: "Medhali B",
      position: "Event Head",
      department: "Events",
      image: "/team/event-head.jpg",
      bio: "Organizing impactful events that bring together entrepreneurs, investors, and innovators.",
      skills: [
        "Event Planning",
        "Project Management",
        "Coordination",
        "Leadership",
      ],
      linkedin: "https://linkedin.com/in/medhalib",
      instagram: "https://instagram.com/medhalib",
      email: "medhali@ecell.com",
    },
    {
      id: 10,
      name: "Gurlin Kaur Saini",
      position: "Event Co-Head",
      department: "Events",
      image: "/team/event-cohead.jpg",
      bio: "Creative event coordinator specializing in workshops and networking sessions.",
      skills: [
        "Event Coordination",
        "Public Relations",
        "Communication",
        "Logistics",
      ],
      linkedin: "https://linkedin.com/in/gurlinkaursaini",
      instagram: "https://instagram.com/gurlinkaursaini",
      email: "gurlin@ecell.com",
    },
  ];

  // Digital Marketing Team
  const marketingTeam = [
    {
      id: 11,
      name: "Tanushree Satish Karwatkar",
      position: "Digital Marketing Head",
      department: "Marketing",
      image: "/team/marketing-head.jpg",
      bio: "Digital marketing strategist building brand presence and community engagement.",
      skills: [
        "Digital Strategy",
        "Content Marketing",
        "Social Media",
        "Analytics",
      ],
      linkedin: "https://linkedin.com/in/tanushreekarwatkar",
      instagram: "https://instagram.com/tanushreekarwatkar",
      email: "tanushree@ecell.com",
    },
    {
      id: 12,
      name: "Om Telagade",
      position: "Digital Marketing Co-Head",
      department: "Marketing",
      image: "/team/marketing-cohead.jpg",
      bio: "Creative content creator and social media specialist driving digital growth.",
      skills: ["Content Creation", "SEO", "Social Media", "Graphic Design"],
      linkedin: "https://linkedin.com/in/omtelagade",
      instagram: "https://instagram.com/omtelagade",
      email: "om@ecell.com",
    },
  ];

  // IoT Team
  const iotTeam = [
    {
      id: 13,
      name: "Ayush Kashid",
      position: "IoT Head",
      department: "Technical",
      image: "/team/iot-head.jpg",
      bio: "IoT specialist developing smart solutions and leading hardware innovation projects.",
      skills: ["IoT", "Arduino", "Raspberry Pi", "Sensors", "Hardware"],
      linkedin: "https://linkedin.com/in/ayushkashid",
      github: "https://github.com/ayushkashid",
      email: "ayush@ecell.com",
    },
    {
      id: 14,
      name: "Prathamesh Ghude",
      position: "IoT Co-Head",
      department: "Technical",
      image: "/team/iot-cohead.jpg",
      bio: "Hardware enthusiast focusing on embedded systems and smart device development.",
      skills: [
        "Embedded Systems",
        "Microcontrollers",
        "Circuit Design",
        "Programming",
      ],
      linkedin: "https://linkedin.com/in/prathameshghude",
      github: "https://github.com/prathameshghude",
      email: "prathamesh@ecell.com",
    },
  ];

  // Content & Coordination Team
  const contentTeam = [
    {
      id: 15,
      name: "Dhwani Tiwari",
      position: "Blogger",
      department: "Content",
      image: "/team/blogger.jpg",
      bio: "Content creator and blogger sharing insights about entrepreneurship and innovation.",
      skills: ["Content Writing", "Blogging", "Research", "Storytelling"],
      linkedin: "https://linkedin.com/in/dhwanitiwari",
      instagram: "https://instagram.com/dhwanitiwari",
      email: "dhwani@ecell.com",
    },
    {
      id: 16,
      name: "Devanshi Thakur",
      position: "Overall Coordinator",
      department: "Operations",
      image: "/team/coordinator.jpg",
      bio: "Overall coordinator ensuring seamless collaboration across all departments and teams.",
      skills: [
        "Coordination",
        "Team Management",
        "Communication",
        "Operations",
      ],
      linkedin: "https://linkedin.com/in/devanshithakur",
      instagram: "https://instagram.com/devanshithakur",
      email: "devanshi@ecell.com",
    },
  ];

  return (
    <div className="team-page">
      <Header />
      <motion.div
        className="team-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Meet Our Team</h1>
        <p>
          Passionate individuals driving innovation and entrepreneurship forward
        </p>
      </motion.div>

      <div className="team-content">
        {/* Core Leadership Team */}
        <motion.section
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="section-header">
            <h2>
              Core <span className="highlight">Leadership</span>
            </h2>
            <p>Leading the vision and strategy of E-Cell</p>
          </div>
          <div className="members-grid core-team-grid">
            {coreTeam.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Web Development Team */}
        <motion.section
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="section-header">
            <h2>
              Web <span className="highlight">Development</span>
            </h2>
            <p>Building digital solutions and web platforms</p>
          </div>
          <div className="members-grid department-grid">
            {webDevTeam.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Game Development Team */}
        <motion.section
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="section-header">
            <h2>
              Game <span className="highlight">Development</span>
            </h2>
            <p>Creating immersive gaming experiences and interactive content</p>
          </div>
          <div className="members-grid department-grid">
            {gameDevTeam.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Event Management Team */}
        <motion.section
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="section-header">
            <h2>
              Event <span className="highlight">Management</span>
            </h2>
            <p>
              Organizing impactful events and fostering community engagement
            </p>
          </div>
          <div className="members-grid department-grid">
            {eventTeam.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Digital Marketing Team */}
        <motion.section
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="section-header">
            <h2>
              Digital <span className="highlight">Marketing</span>
            </h2>
            <p>Building brand presence and driving community growth</p>
          </div>
          <div className="members-grid department-grid">
            {marketingTeam.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.section>

        {/* IoT Team */}
        <motion.section
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="section-header">
            <h2>
              IoT & <span className="highlight">Hardware</span>
            </h2>
            <p>Developing smart solutions and innovative hardware projects</p>
          </div>
          <div className="members-grid department-grid">
            {iotTeam.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Content & Coordination Team */}
        <motion.section
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="section-header">
            <h2>
              Content & <span className="highlight">Coordination</span>
            </h2>
            <p>Creating engaging content and ensuring seamless operations</p>
          </div>
          <div className="members-grid department-grid">
            {contentTeam.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </motion.section>

        {/* Join Team CTA */}
        <motion.section
          className="join-team-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="join-team-card">
            <h3>Want to Join Our Team?</h3>
            <p>
              We're always looking for passionate individuals who want to make a
              difference in the entrepreneurship ecosystem.
            </p>
            <div className="join-team-actions">
              <button className="join-btn primary">
                <FaUserPlus />
                Apply Now
              </button>
              <button className="join-btn secondary">
                <FaInfoCircle />
                Learn More
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default TeamPage;
