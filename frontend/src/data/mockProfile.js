export const mockProfile = {
  id: '1',
  name: 'Alex Johnson',
  headline: 'Senior Full Stack Engineer | React & Node.js Specialist',
  bio: 'Passionate about building scalable web applications and creating exceptional user experiences. I specialize in modern frontend frameworks and backend architecture. Currently working on innovative projects that push the boundaries of web technology.',
  location: 'San Francisco, CA',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  experiences: [
    {
      id: '1',
      title: 'Senior Full Stack Engineer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      description: 'Leading frontend architecture and mentoring junior developers. Building scalable React applications with TypeScript.'
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'Digital Solutions Ltd.',
      location: 'Remote',
      startDate: 'Jun 2020',
      endDate: 'Dec 2021',
      current: false,
      description: 'Developed and maintained multiple production applications using React, Node.js, and PostgreSQL.'
    },
    {
      id: '3',
      title: 'Junior Developer',
      company: 'Web Startup Co.',
      location: 'Boston, MA',
      startDate: 'Jan 2019',
      endDate: 'May 2020',
      current: false,
      description: 'Built responsive web interfaces and contributed to backend API development.'
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startYear: '2015',
      endYear: '2019'
    },
    {
      id: '2',
      school: 'Online Learning Platform',
      degree: 'Professional Certificate',
      fieldOfStudy: 'Advanced React Development',
      startYear: '2021',
      endYear: '2022'
    }
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Docker', 'AWS', 'Git']
};
