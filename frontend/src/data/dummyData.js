// Helper to get a date relative to now
const getFutureDate = (days, hours = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

export const dummyData = {
  user: {
    name: "Alice Johnson",
    email: "alice@university.edu",
    role: "student",
    avatar: "AJ"
  },
  faculty: {
    name: "Dr. Smith",
    email: "smith@university.edu",
    role: "faculty",
    avatar: "DS"
  },
  students: [
    { id: 1, name: "Alice Johnson", email: "alice@university.edu", role: "student", group: "Code Wizards" },
    { id: 2, name: "Bob Smith", email: "bob@university.edu", role: "student", group: "Code Wizards" },
    { id: 3, name: "Charlie Brown", email: "charlie@university.edu", role: "student", group: "Data Ninjas" },
  ],
  groups: [
    { 
      id: 1, 
      name: "Code Wizards", 
      members: ["Alice Johnson", "Bob Smith"],
      progress: 65,
      assignments: [
        { id: 101, title: "React Basics", status: "Submitted", dueDate: getFutureDate(-2), grade: "A" },
        { id: 102, title: "Tailwind Integration", status: "Pending", dueDate: getFutureDate(3, 5), grade: null }
      ]
    },
    { 
      id: 2, 
      name: "Data Ninjas", 
      members: ["Charlie Brown"],
      progress: 40,
      assignments: [
        { id: 101, title: "React Basics", status: "Submitted", dueDate: getFutureDate(-2), grade: "B+" }
      ]
    }
  ],
  assignments: [
    { 
      id: 101, 
      title: "React Basics", 
      description: "Build a simple counter application using React hooks.",
      dueDate: getFutureDate(1, 2),
      oneDriveLink: "https://onedrive.com/abcd",
      assignedTo: "All",
      status: "Submitted",
      grade: "A"
    },
    { 
      id: 102, 
      title: "Tailwind Integration", 
      description: "Style your React application using Tailwind CSS utilities.",
      dueDate: getFutureDate(3, 5),
      oneDriveLink: "https://onedrive.com/efgh",
      assignedTo: "All",
      status: "Pending",
      grade: null
    },
    { 
      id: 103, 
      title: "Final Project Proposal", 
      description: "Submit your group proposal for the final project.",
      dueDate: getFutureDate(12, 0),
      oneDriveLink: "https://onedrive.com/ijkl",
      assignedTo: "Specific Groups",
      status: "Pending",
      grade: null
    }
  ],
  submissions: [
    { id: 1, groupName: "Code Wizards", assignment: "React Basics", status: "Submitted", date: "2026-04-09" },
    { id: 2, groupName: "Data Ninjas", assignment: "React Basics", status: "Submitted", date: "2026-04-10" },
    { id: 3, groupName: "Code Wizards", assignment: "Tailwind Integration", status: "Pending", date: null },
  ],
  exams: [
    { id: 1, subject: "React Frameworks", date: getFutureDate(15), time: "10:00 AM" },
    { id: 2, subject: "Modern Web Design", date: getFutureDate(22), time: "02:00 PM" },
  ],
  notes: [
    { id: 1, title: "Introduction to React Hooks", date: "2026-03-20", link: "#" },
    { id: 2, title: "Tailwind CSS Best Practices", date: "2026-03-25", link: "#" },
    { id: 3, title: "Advanced State Management", date: "2026-03-28", link: "#" },
  ]
};
