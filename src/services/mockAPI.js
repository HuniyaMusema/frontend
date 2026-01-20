// Mock API Service for Takamul PMS
// This simulates a backend API and can be easily replaced with real API calls

let projects = [
  {
    id: '1',
    name: 'Residential Building Project',
    description: 'Complete residential building construction with all utilities. This project includes architectural plans, structural engineering, and utility systems integration.',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-12-30',
    progress: 45,
    managerId: '1',
    teamMembers: ['2', '3', '4', '5'],
    clientId: '6',
    paymentStatus: 'paid',
    clientPrePayment: true,
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3',
    receiptVerified: true,
    sketchApproved: true,
    architecturalApproved: true,
    fullPaymentVerified: true,
    createdAt: '2024-01-10T10:00:00Z',
    sketches: [
      { id: 's1', url: 'https://images.unsplash.com/photo-1503387762-592dea58ef21', version: '1.0', status: 'approved' },
      { id: 's2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750', version: '2.0', status: 'approved' }
    ],
    disciplineProgress: {
      civil: 60,
      electrical: 30,
      hydraulic: 45
    },
    location: { address: 'Bole, Addis Ababa', lat: 8.9806, lng: 38.7578 }
  },
  {
    id: '2',
    name: 'Commercial Complex',
    description: 'Large commercial complex with shopping and offices. Currently in planning phase to ensure all government regulations are met.',
    status: 'planning',
    priority: 'high',
    startDate: '2024-03-01',
    endDate: '2025-06-30',
    progress: 10,
    managerId: '1',
    teamMembers: ['2', '3', '4'],
    clientId: '6',
    paymentStatus: 'pending',
    clientPrePayment: false,
    receiptUrl: null,
    receiptVerified: false,
    sketchApproved: false,
    architecturalApproved: false,
    fullPaymentVerified: false,
    createdAt: '2024-01-20T10:00:00Z',
    sketches: [
      { id: 's3', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', version: '0.1', status: 'pending' }
    ],
    disciplineProgress: {
      civil: 5,
      electrical: 0,
      hydraulic: 0
    },
    location: { address: 'Kazanchis, Addis Ababa', lat: 9.0192, lng: 38.7619 }
  }
]

let users = [
  {
    id: '1',
    name: 'Ahmed Al-Mansoori',
    email: 'ahmed@takamul.com',
    phone: '+251 911 234 567',
    password: 'password123',
    role: 'admin', // Project Manager
    avatar: 'https://i.pravatar.cc/150?u=ahmed',
    joinedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Fatima Al-Zahra',
    email: 'fatima@takamul.com',
    phone: '+251 922 345 678',
    password: 'password123',
    role: 'architect',
    avatar: 'https://i.pravatar.cc/150?u=fatima',
    joinedAt: '2023-02-10T10:00:00Z',
  },
  {
    id: '3',
    name: 'Khalid Al-Abri',
    email: 'khalid@takamul.com',
    phone: '+251 933 456 789',
    password: 'password123',
    role: 'civil-engineer',
    avatar: 'https://i.pravatar.cc/150?u=khalid',
    joinedAt: '2023-03-05T10:00:00Z',
  },
  {
    id: '4',
    name: 'Mariam Al-Rashdi',
    email: 'mariam@takamul.com',
    phone: '+251 944 567 890',
    password: 'password123',
    role: 'electrical-engineer',
    avatar: 'https://i.pravatar.cc/150?u=mariam',
    joinedAt: '2023-04-20T10:00:00Z',
  },
  {
    id: '5',
    name: 'Omar Al-Kindi',
    email: 'omar@takamul.com',
    phone: '+251 955 678 901',
    password: 'password123',
    role: 'hydraulic-engineer',
    avatar: 'https://i.pravatar.cc/150?u=omar',
    joinedAt: '2023-05-12T10:00:00Z',
  },
  {
    id: '6',
    name: 'Salma Al-Hinai',
    email: 'salma@takamul.com',
    phone: '+251 966 789 012',
    password: 'password123',
    role: 'client',
    avatar: 'https://i.pravatar.cc/150?u=salma',
    joinedAt: '2023-06-01T10:00:00Z',
  },
  {
    id: '7',
    name: 'Hassan Al-Saidi',
    email: 'hassan@takamul.com',
    phone: '+251 977 890 123',
    password: 'password123',
    role: 'messenger',
    avatar: 'https://i.pravatar.cc/150?u=hassan',
    joinedAt: '2023-07-01T10:00:00Z',
  },
]

let governmentApprovals = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Residential Building Project',
    documentType: 'Architectural Approval',
    status: 'approved',
    submittedAt: '2024-01-15T10:00:00Z',
    reviewedDate: '2024-01-20T10:00:00Z',
    notes: 'The architectural design meets all municipal requirements.',
    reviewedBy: '7',
  },
  {
    id: '2',
    projectId: '2',
    projectName: 'Commercial Complex',
    documentType: 'Structural Design Approval',
    status: 'pending',
    submittedAt: '2024-03-10T10:00:00Z',
    reviewedDate: null,
    notes: '',
    reviewedBy: null,
  },
]

let conversations = [
  {
    id: 'conv1',
    participantId: '2',
    participantName: 'Fatima Al-Zahra',
    lastMessage: 'The drawings are ready for review.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'conv2',
    participantId: '1',
    participantName: 'Ahmed Al-Mansoori',
    lastMessage: 'Please schedule the meeting for tomorrow.',
    updatedAt: new Date().toISOString(),
  }
]

let chatMessages = [
  {
    id: 'm1',
    conversationId: 'conv1',
    senderId: '2',
    text: 'Hello Salma, the architectural drawings are ready for review.',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 'm2',
    conversationId: 'conv1',
    senderId: '6',
    text: 'Great, thank you Fatima. I will take a look.',
    createdAt: '2024-03-20T10:05:00Z',
  }
]

let tasks = [
  {
    id: '1',
    projectId: '1',
    title: 'Architectural Site Analysis',
    description: 'Complete analysis of the soil and surrounding environment for the residential building.',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-02-15',
    assigneeId: '2',
    milestone: 'Design Phase',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    projectId: '1',
    title: 'Foundation Reinforcement Plan',
    description: 'Detailed structural plan for the foundation reinforcement based on site analysis.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-04-30',
    assigneeId: '3',
    milestone: 'Foundation Phase',
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '3',
    projectId: '2',
    title: 'Initial Concept Sketches',
    description: 'Develop first draft of commercial complex concept for client review.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-03-30',
    assigneeId: '2',
    milestone: 'Design Phase',
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '4',
    projectId: '1',
    title: 'Electrical Load Calculation',
    description: 'Calculate total power requirements and transformer capacity.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-05-15',
    assigneeId: '4',
    milestone: 'Utilities Phase',
    createdAt: '2024-03-05T10:00:00Z',
  }
]

let settings = {
  companyName: 'Takamul Construction',
  taxRate: 5,
  currency: 'ETB',
  defaultProjectStatus: 'planning',
  emailNotifications: true,
}

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAPI = {
  // Authentication
  async login(email, password) {
    await delay()
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return {
        success: true,
        token: `mock-token-${user.id}`,
        user: userWithoutPassword,
      }
    }
    return { success: false, error: 'Invalid email or password' }
  },

  async signup(name, email, password, phone, role = 'client') {
    await delay()
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return { success: false, error: 'Email already registered' }
    }

    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      phone: phone || '',
      password,
      role,
      avatar: '',
      joinedAt: new Date().toISOString(),
    }
    users.push(newUser)
    const { password: _, ...userWithoutPassword } = newUser
    return {
      success: true,
      token: `mock-token-${newUser.id}`,
      user: userWithoutPassword,
    }
  },

  // Projects
  async getProjects() {
    await delay()
    return projects
  },

  async getProject(id) {
    await delay()
    return projects.find(p => p.id === id) || null
  },

  async createProject(projectData) {
    await delay()
    const newProject = {
      id: String(projects.length + 1),
      ...projectData,
      progress: 0,
      createdAt: new Date().toISOString(),
    }
    projects.push(newProject)
    return newProject
  },

  async updateProject(id, projectData) {
    await delay()
    const index = projects.findIndex(p => p.id === id)
    if (index !== -1) {
      projects[index] = { ...projects[index], ...projectData }
      return projects[index]
    }
    return null
  },

  async deleteProject(id) {
    await delay()
    const index = projects.findIndex(p => p.id === id)
    if (index !== -1) {
      projects.splice(index, 1)
      tasks = tasks.filter(t => t.projectId !== id)
      return true
    }
    return false
  },

  // Tasks
  async getTasks(projectId = null) {
    await delay()
    if (projectId) {
      return tasks.filter(t => t.projectId === projectId)
    }
    return tasks
  },

  async getTask(id) {
    await delay()
    return tasks.find(t => t.id === id) || null
  },

  async createTask(taskData) {
    await delay()
    const newTask = {
      id: String(tasks.length + 1),
      ...taskData,
      createdAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    return newTask
  },

  async updateTask(id, taskData) {
    await delay()
    const index = tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData }
      return tasks[index]
    }
    return null
  },

  async deleteTask(id) {
    await delay()
    const index = tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.splice(index, 1)
      return true
    }
    return false
  },

  // Users/Team
  async getUsers() {
    await delay()
    return users.map(({ password: _, ...user }) => user)
  },

  async getUser(id) {
    await delay()
    const user = users.find(u => u.id === id)
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  },

  async updateUser(userId, userData) {
    await delay()
    const index = users.findIndex(u => u.id === userId)
    if (index !== -1) {
      users[index] = { ...users[index], ...userData }
      const { password: _, ...userWithoutPassword } = users[index]
      return userWithoutPassword
    }
    return null
  },

  // Government Approvals
  async getGovernmentApprovals() {
    await delay()
    return governmentApprovals
  },

  async updateApprovalStatus(approvalId, status, notes, reviewedBy) {
    await delay()
    const approval = governmentApprovals.find(a => a.id === approvalId)
    if (approval) {
      approval.status = status
      approval.notes = notes
      approval.reviewedBy = reviewedBy
      approval.reviewedDate = new Date().toISOString()
      return approval
    }
    return null
  },

  async verifyReceipt(projectId, verified, notes = '') {
    await delay()
    const index = projects.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects[index].receiptVerified = verified
      if (verified) {
        projects[index].paymentStatus = 'paid'
        projects[index].clientPrePayment = true
      } else {
        projects[index].paymentStatus = 'rejected'
        projects[index].paymentNotes = notes
      }
      return projects[index]
    }
    return null
  },

  async uploadReceipt(projectId, url) {
    await delay()
    const index = projects.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects[index].receiptUrl = url
      projects[index].paymentStatus = 'pending'
      return projects[index]
    }
    return null
  },

  // Messaging (New Conversational Structure)
  async getConversations() {
    await delay()
    // In real app, we would filter based on userId
    return conversations
  },

  async getMessages(conversationId) {
    await delay()
    return chatMessages.filter(m => m.conversationId === conversationId)
  },

  async sendMessage(messageData) {
    await delay()
    const newMessage = {
      id: `m${chatMessages.length + 1}`,
      ...messageData,
      createdAt: new Date().toISOString(),
    }
    chatMessages.push(newMessage)
    return newMessage
  },

  // Settings
  async getSettings() {
    await delay()
    return settings
  },

  async updateSettings(newSettings) {
    await delay()
    settings = { ...settings, ...newSettings }
    return settings
  },

  // Statistics
  async getDashboardStats(userId, userRole = null) {
    await delay()
    let filteredProjects = projects
    let filteredTasks = tasks

    if (userRole === 'client') {
      filteredProjects = projects.filter(p => p.clientId === userId)
      const projectIds = filteredProjects.map(p => p.id)
      filteredTasks = tasks.filter(t => projectIds.includes(t.projectId))
    } else if (['architect', 'civil-engineer', 'electrical-engineer', 'hydraulic-engineer'].includes(userRole)) {
      filteredTasks = tasks.filter(t => t.assigneeId === userId)
      const projectIds = [...new Set(filteredTasks.map(t => t.projectId))]
      filteredProjects = projects.filter(p => projectIds.includes(p.id))
    }

    const totalProjects = filteredProjects.length
    const activeProjects = filteredProjects.filter(p => p.status === 'active').length
    const completedProjects = filteredProjects.filter(p => p.status === 'completed').length
    const totalTasks = filteredTasks.length
    const completedTasks = filteredTasks.filter(t => t.status === 'completed').length
    const totalTeamMembers = users.length
    const pendingPayments = filteredProjects.filter(p => p.paymentStatus === 'pending').length

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      totalTeamMembers,
      pendingPayments,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      recentProjects: filteredProjects.slice(0, 3),
      recentTasks: filteredTasks.slice(0, 3)
    }
  },
}
