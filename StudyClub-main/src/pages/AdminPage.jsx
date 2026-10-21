import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Search,
  UserPlus,
  Trash2,
  ShieldAlert,
  ArrowUpDown,
  Download,
  RefreshCw,
  Bell,
  Megaphone,
  Radio,
  Clock,
  Sparkles,
  Award,
  Filter,
  Check,
  X,
  ExternalLink,
  Key,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../services/db'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const {
    user,
    getAllUsers,
    deleteUser,
    updateUserRole,
    updateUserStatus,
    signup,
    auditLogs,
    clearAuditLogs,
    announcements,
    addAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    checkUsernameAvailability
  } = useAuth()

  // Data states
  const [activeTab, setActiveTab] = useState('users') // 'users' | 'clubs' | 'announcements' | 'audit'
  const [usersList, setUsersList] = useState([])
  const [clubsList, setClubsList] = useState([])
  const [tasksList, setTasksList] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  // Filters
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all') // 'all' | 'admin' | 'student'
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'suspended'
  const [clubSearch, setClubSearch] = useState('')

  // New Admin Creation Modal
  const [showNewAdminModal, setShowNewAdminModal] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminDepartment, setNewAdminDepartment] = useState('Platform Operations')
  const [newAdminPasscode, setNewAdminPasscode] = useState('ADMIN2026')
  const [adminUsernameStatus, setAdminUsernameStatus] = useState(null)

  // New Announcement Form
  const [annTitle, setAnnTitle] = useState('')
  const [annMessage, setAnnMessage] = useState('')
  const [annType, setAnnType] = useState('info') // 'info' | 'warning' | 'success'

  // New Club Modal
  const [showNewClubModal, setShowNewClubModal] = useState(false)
  const [newClubName, setNewClubName] = useState('')
  const [newClubDesc, setNewClubDesc] = useState('')

  // Load all platform data
  const loadPlatformData = async () => {
    setLoadingData(true)
    try {
      const allUsers = getAllUsers()
      const allClubs = await db.getClubs()
      const allTasks = await db.getTasks()

      setUsersList(allUsers)
      setClubsList(allClubs)
      setTasksList(allTasks)
    } catch (err) {
      toast.error('Failed to load admin records: ' + err.message)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadPlatformData()
  }, [])

  // Check unique username availability in real-time
  useEffect(() => {
    if (!newAdminUsername.trim()) {
      setAdminUsernameStatus(null)
      return
    }
    const timer = setTimeout(() => {
      const res = checkUsernameAvailability(newAdminUsername)
      setAdminUsernameStatus(res)
    }, 250)
    return () => clearTimeout(timer)
  }, [newAdminUsername])

  // Handle Create Admin
  const handleCreateAdmin = (e) => {
    e.preventDefault()
    if (!adminUsernameStatus?.available) {
      toast.error(adminUsernameStatus?.message || 'Please provide a valid unique username.')
      return
    }
    try {
      signup({
        name: newAdminName,
        username: newAdminUsername,
        email: newAdminEmail,
        password: newAdminPassword,
        role: 'admin',
        department: newAdminDepartment,
        adminPasscode: newAdminPasscode
      })
      toast.success(`🎉 Administrator @${newAdminUsername.replace(/^@/, '')} registered successfully!`)
      setShowNewAdminModal(false)
      setNewAdminName('')
      setNewAdminUsername('')
      setNewAdminEmail('')
      setNewAdminPassword('')
      loadPlatformData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Handle Delete User
  const handleDeleteUser = (targetUser) => {
    if (targetUser.id === user?.id) {
      toast.error('You cannot delete your own logged-in admin account!')
      return
    }
    if (window.confirm(`Are you sure you want to permanently delete user "${targetUser.name}" (@${targetUser.username})?`)) {
      try {
        deleteUser(targetUser.id)
        toast.success(`User @${targetUser.username} removed.`)
        loadPlatformData()
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  // Handle Toggle Role
  const handleToggleRole = (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'student' : 'admin'
    const confirmMsg = nextRole === 'admin'
      ? `Promote "${targetUser.name}" (@${targetUser.username}) to Administrator?`
      : `Demote "${targetUser.name}" (@${targetUser.username}) to Student?`

    if (window.confirm(confirmMsg)) {
      try {
        updateUserRole(targetUser.id, nextRole)
        toast.success(`Updated @${targetUser.username} to ${nextRole.toUpperCase()}`)
        loadPlatformData()
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  // Handle Toggle User Status
  const handleToggleStatus = (targetUser) => {
    const nextStatus = targetUser.status === 'suspended' ? 'active' : 'suspended'
    try {
      updateUserStatus(targetUser.id, nextStatus)
      toast.success(`User status changed to ${nextStatus}.`)
      loadPlatformData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Handle Delete Club
  const handleDeleteClub = async (clubId, clubName) => {
    if (window.confirm(`Are you sure you want to disband and delete study club "${clubName}"?`)) {
      try {
        await db.deleteClub(clubId)
        toast.success(`Study Club "${clubName}" deleted.`)
        loadPlatformData()
      } catch (err) {
        toast.error('Failed to delete club: ' + err.message)
      }
    }
  }

  // Handle Create Club as Admin
  const handleCreateClub = async (e) => {
    e.preventDefault()
    if (!newClubName.trim()) return
    try {
      await db.createClub({
        name: newClubName.trim(),
        description: newClubDesc.trim(),
        owner_name: `Admin (${user?.name || 'Administrator'})`
      })
      toast.success(`Created Study Club "${newClubName}"!`)
      setShowNewClubModal(false)
      setNewClubName('')
      setNewClubDesc('')
      loadPlatformData()
    } catch (err) {
      toast.error('Failed to create club: ' + err.message)
    }
  }

  // Handle Create Announcement
  const handlePostAnnouncement = (e) => {
    e.preventDefault()
    if (!annTitle.trim() || !annMessage.trim()) {
      toast.error('Please enter an announcement title and message.')
      return
    }
    try {
      addAnnouncement({
        title: annTitle,
        message: annMessage,
        type: annType
      })
      toast.success('Broadcast announcement posted across the platform!')
      setAnnTitle('')
      setAnnMessage('')
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Export Platform Report (JSON)
  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      adminActor: user?.username || 'admin',
      stats: {
        totalUsers: usersList.length,
        totalClubs: clubsList.length,
        totalTasks: tasksList.length
      },
      users: usersList,
      clubs: clubsList,
      announcements,
      auditLogs
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `studyclub_admin_export_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    toast.success('Admin platform report downloaded successfully.')
  }

  // Filtered Users List
  const filteredUsers = usersList.filter(u => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase())) ||
      (u.major && u.major.toLowerCase().includes(userSearch.toLowerCase()))

    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  // Filtered Clubs List
  const filteredClubs = clubsList.filter(c => {
    return (
      (c.name && c.name.toLowerCase().includes(clubSearch.toLowerCase())) ||
      (c.join_code && c.join_code.toLowerCase().includes(clubSearch.toLowerCase())) ||
      (c.owner_name && c.owner_name.toLowerCase().includes(clubSearch.toLowerCase()))
    )
  })

  // Summary Metrics
  const adminCount = usersList.filter(u => u.role === 'admin').length
  const studentCount = usersList.filter(u => u.role !== 'admin').length
  const totalClubMembers = clubsList.reduce((acc, curr) => acc + (curr.member_count || 1), 0)
  const completedTasks = tasksList.filter(t => t.is_completed).length
  const completionRate = tasksList.length > 0 ? Math.round((completedTasks / tasksList.length) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 1300, margin: '0 auto', width: '100%' }}>
      {/* ── HEADER BANNER ── */}
      <div
        className="card"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(232, 82, 26, 0.08) 0%, rgba(74, 58, 255, 0.08) 100%)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, var(--accent), #FF6B35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-accent" style={{ fontWeight: 800 }}>ADMIN PORTAL</span>
              <span className="badge badge-purple" style={{ fontWeight: 700 }}>
                Logged in: @{user?.username || 'admin'}
              </span>
              <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-2)' }} />
                Platform Operational
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
              System Administration & Oversight Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
              Manage registered users, unique credentials, study clubs moderation, announcements, and audit trails.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Link
            to="/guide"
            className="btn btn-secondary"
            title="Read Complete Project Documentation"
          >
            <BookOpen size={15} color="var(--accent)" /> Project Guide
          </Link>
          <button
            type="button"
            onClick={loadPlatformData}
            className="btn btn-secondary"
            title="Reload latest records"
          >
            <RefreshCw size={15} /> Refresh Data
          </button>
          <button
            type="button"
            onClick={handleExportData}
            className="btn btn-secondary"
            title="Download full JSON export"
          >
            <Download size={15} /> Export JSON
          </button>
          <button
            type="button"
            onClick={() => setShowNewAdminModal(true)}
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
          >
            <UserPlus size={16} /> Register New Admin
          </button>
        </div>
      </div>

      {/* ── KEY PLATFORM METRICS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Metric 1 */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Accounts</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{usersList.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {adminCount} Admins • {studentCount} Students
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-2-soft)', color: 'var(--accent-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Study Clubs</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{clubsList.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {totalClubMembers} active group members
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-3-soft)', color: 'var(--accent-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Task Completion</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{completionRate}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {completedTasks} of {tasksList.length} tasks finished
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(232, 82, 26, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Broadcasts</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              {announcements.filter(a => a.active).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              System announcements
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 10, overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'users' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'users' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'users' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Users size={16} /> User & Access Management ({usersList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clubs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'clubs' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'clubs' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'clubs' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <BookOpen size={16} /> Study Clubs Moderation ({clubsList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('announcements')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'announcements' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'announcements' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'announcements' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Megaphone size={16} /> Broadcasts & Announcements ({announcements.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            background: activeTab === 'audit' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'audit' ? 'white' : 'var(--text-primary)',
            boxShadow: activeTab === 'audit' ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <Clock size={16} /> Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* ── TAB 1: USER & ACCESS MANAGEMENT ── */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Controls Bar */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', flex: 1, minWidth: 280 }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  className="input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search by name, @username, email, or major..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              {/* Role filter */}
              <select
                className="input"
                style={{ width: 'auto', minWidth: 140 }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins Only</option>
                <option value="student">Students Only</option>
              </select>

              {/* Status filter */}
              <select
                className="input"
                style={{ width: 'auto', minWidth: 140 }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredUsers.length}</strong> of {usersList.length} users
              </span>
            </div>
          </div>

          {/* Users Table */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>User Profile</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Unique Username</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Email Address</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Role</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Department / Major</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No matching user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role === 'admin'
                    const isSelf = u.id === user?.id
                    const isSuspended = u.status === 'suspended'

                    return (
                      <tr
                        key={u.id}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          background: isSuspended ? 'rgba(255, 77, 77, 0.04)' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {/* Profile Name & Avatar */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img
                              src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`}
                              alt={u.name}
                              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                {u.name}
                                {isSelf && (
                                  <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                                    YOU
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Level {u.level || 1} • {u.streak || 1} Day Streak
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Unique Username */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                            @{u.username || u.name.toLowerCase().replace(/\s+/g, '_')}
                          </span>
                        </td>

                        {/* Email */}
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                          {u.email}
                        </td>

                        {/* Role */}
                        <td style={{ padding: '14px 16px' }}>
                          {isAdmin ? (
                            <span className="badge" style={{ background: '#FF4D4D', color: '#fff', gap: 4 }}>
                              <ShieldCheck size={12} /> ADMIN
                            </span>
                          ) : (
                            <span className="badge badge-green" style={{ gap: 4 }}>
                              <GraduationCap size={12} /> Student
                            </span>
                          )}
                        </td>

                        {/* Major / Department */}
                        <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {u.department || u.major || 'Computer Science'}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 16px' }}>
                          {isSuspended ? (
                            <span className="badge" style={{ background: '#FFEBEB', color: '#D90429', gap: 4 }}>
                              Suspended
                            </span>
                          ) : (
                            <span className="badge badge-green" style={{ gap: 4 }}>
                              Active
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                            {/* Toggle Role Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleRole(u)}
                              disabled={isSelf}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              title={isAdmin ? 'Demote to Student' : 'Promote to Administrator'}
                            >
                              <ArrowUpDown size={12} /> {isAdmin ? 'Demote' : 'Promote'}
                            </button>

                            {/* Suspend / Activate Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              disabled={isSelf}
                              className="btn btn-secondary"
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.75rem',
                                color: isSuspended ? 'var(--accent-2)' : 'var(--text-muted)'
                              }}
                              title={isSuspended ? 'Reactivate User' : 'Suspend User'}
                            >
                              {isSuspended ? 'Activate' : 'Suspend'}
                            </button>

                            {/* Delete User Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              disabled={isSelf}
                              style={{
                                padding: '6px 8px',
                                borderRadius: 6,
                                color: isSelf ? 'var(--border)' : '#E63946',
                                background: 'transparent',
                                cursor: isSelf ? 'not-allowed' : 'pointer'
                              }}
                              title={isSelf ? 'Cannot delete self' : 'Permanently Delete User'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: STUDY CLUBS MODERATION ── */}
      {activeTab === 'clubs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            className="card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                className="input"
                style={{ paddingLeft: 36 }}
                placeholder="Search clubs by name, code, or owner..."
                value={clubSearch}
                onChange={(e) => setClubSearch(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowNewClubModal(true)}
              className="btn btn-primary"
            >
              <BookOpen size={16} /> Create Study Club
            </button>
          </div>

          {/* Clubs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {filteredClubs.length === 0 ? (
              <div className="card" style={{ padding: '3rem', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
                No study clubs found matching your search.
              </div>
            ) : (
              filteredClubs.map((club) => (
                <div key={club.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{club.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Owner: <strong>{club.owner_name || 'Admin'}</strong>
                      </div>
                    </div>
                    <span className="badge badge-accent" style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.75rem' }}>
                      CODE: {club.join_code}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1 }}>
                    {club.description || 'No description provided.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} /> {club.member_count || 1} Members
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteClub(club.id, club.name)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#E63946' }}
                    >
                      <Trash2 size={13} /> Disband Club
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: BROADCASTS & ANNOUNCEMENTS ── */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Post New Announcement */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Megaphone size={20} color="var(--accent)" /> Broadcast New Announcement
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Publish platform banners that appear at the top of every student's dashboard.
            </p>

            <form onSubmit={handlePostAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Announcement Headline</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. Scheduled Maintenance or New Midterm Study Sprints"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Announcement Message</label>
                <textarea
                  className="input"
                  rows={3}
                  required
                  placeholder="Details about upcoming platform features, exam review sessions, or updates..."
                  value={annMessage}
                  onChange={(e) => setAnnMessage(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Urgency & Style</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setAnnType('info')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: annType === 'info' ? 'var(--accent-soft)' : 'transparent',
                      color: annType === 'info' ? 'var(--accent)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    Information (Accent)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnnType('warning')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: annType === 'warning' ? '#FFF4E5' : 'transparent',
                      color: annType === 'warning' ? '#D97706' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    Warning (Alert)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAnnType('success')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: annType === 'success' ? 'var(--accent-2-soft)' : 'transparent',
                      color: annType === 'success' ? 'var(--accent-2)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    Success (Milestone)
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                <Megaphone size={16} /> Broadcast to All Students
              </button>
            </form>
          </div>

          {/* Active Broadcasts List */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Broadcast Feed ({announcements.length})</h3>

            {announcements.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
                No platform announcements created yet.
              </div>
            ) : (
              announcements.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: a.active ? 'var(--bg-secondary)' : 'rgba(0,0,0,0.02)',
                    opacity: a.active ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.title}</div>
                    <span className={`badge ${a.active ? 'badge-green' : 'badge-accent'}`} style={{ fontSize: '0.7rem' }}>
                      {a.active ? 'LIVE' : 'MUTED'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                    {a.message}
                  </p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => toggleAnnouncement(a.id)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      {a.active ? 'Mute' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(a.id)}
                      style={{ color: '#E63946', background: 'transparent', cursor: 'pointer', padding: '4px' }}
                      title="Delete Announcement"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: AUDIT LOGS ── */}
      {activeTab === 'audit' && (
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Administrative Audit & Security Trail</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Immutable log recording registrations, credential actions, role elevations, and moderations.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={clearAuditLogs}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', color: '#E63946' }}
              >
                Clear Audit History
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {auditLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No audit events logged yet.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="badge badge-accent" style={{ fontWeight: 700, fontSize: '0.7rem' }}>
                      {log.action}
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{log.details}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <span>By: @{log.actor}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: REGISTER NEW ADMIN ── */}
      {showNewAdminModal && (
        <div className="modal-overlay" onClick={() => setShowNewAdminModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Administrator</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Requires unique username & password</div>
                </div>
              </div>
              <button type="button" onClick={() => setShowNewAdminModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="label">Admin Full Name</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. Jordan Matthews"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Unique Admin Username</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--accent)' }}>
                    @
                  </span>
                  <input
                    className="input"
                    style={{ paddingLeft: 28 }}
                    required
                    placeholder="admin_jordan"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  />
                </div>
                {adminUsernameStatus && (
                  <div style={{ fontSize: '0.75rem', marginTop: 4, color: adminUsernameStatus.available ? 'var(--accent-2)' : '#E63946', fontWeight: 600 }}>
                    {adminUsernameStatus.available ? '✓ ' : '✕ '} {adminUsernameStatus.message}
                  </div>
                )}
              </div>

              <div>
                <label className="label">Official Admin Email</label>
                <input
                  type="email"
                  className="input"
                  required
                  placeholder="jordan@studyclub.edu"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Secure Password (min 6 characters)</label>
                <input
                  type="password"
                  className="input"
                  required
                  placeholder="••••••••••••"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Department / Title</label>
                  <input
                    className="input"
                    placeholder="Platform Operations"
                    value={newAdminDepartment}
                    onChange={(e) => setNewAdminDepartment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Admin Passcode</label>
                  <input
                    className="input"
                    required
                    placeholder="ADMIN2026"
                    value={newAdminPasscode}
                    onChange={(e) => setNewAdminPasscode(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowNewAdminModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  Confirm & Register Admin 🛡️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE STUDY CLUB ── */}
      {showNewClubModal && (
        <div className="modal-overlay" onClick={() => setShowNewClubModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create Study Club as Admin</h3>
              <button type="button" onClick={() => setShowNewClubModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClub} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="label">Study Club Name</label>
                <input
                  className="input"
                  required
                  placeholder="e.g. Advanced Algorithms Circle"
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                />
              </div>

              <div>
                <label className="label">Club Mission / Description</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="What will members study and accomplish together?"
                  value={newClubDesc}
                  onChange={(e) => setNewClubDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowNewClubModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
