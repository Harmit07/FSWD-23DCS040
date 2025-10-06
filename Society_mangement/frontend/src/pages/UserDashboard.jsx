import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme,
  Skeleton,
  Alert,
  LinearProgress,
  Paper,
  IconButton,
  CardActionArea,
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  Build as BuildIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Description as DocumentIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ChevronRight as ChevronRightIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import api from '../utils/api';
import { debugUserData, checkUserValidity } from '../utils/debug';

function UserDashboard({ user }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    homeNumber: user?.homeNumber || 'N/A',
    name: user?.name || `Resident ${user?.homeNumber || 'N/A'}`,
    outstandingDues: 0,
    maintenanceRequests: 0,
    upcomingEvents: 0,
    recentNotices: 0,
    totalBookings: 0,
    totalSpent: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState('');

  // Debug: Log user data
  useEffect(() => {
    console.log('🏠 UserDashboard - Component mounted');
    debugUserData(user);
    
    const validation = checkUserValidity(user);
    if (!validation.valid) {
      console.error('❌ UserDashboard - User validation failed:', validation.issues);
      setError(`User data is invalid: ${validation.issues.join(', ')}`);
      return;
    }
    
    console.log('✅ UserDashboard - User data is valid, fetching user data...');
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user has _id
      if (!user._id) {
        console.error('User ID not found:', user);
        setError('User data is incomplete. Please login again.');
        setLoading(false);
        return;
      }
      
      // Fetch user's data in parallel
      const [bookingsRes, complaintsRes, maintenanceRes] = await Promise.all([
        api.get(`/bookings/user/${user._id}`).catch(err => ({ data: [] })),
        api.get(`/complaints/user/${user._id}`).catch(err => ({ data: [] })),
        api.get(`/maintenance/user/${user._id}`).catch(err => ({ data: [] }))
      ]);

      const bookings = bookingsRes.data || [];
      const complaints = complaintsRes.data || [];
      const maintenance = maintenanceRes.data || [];

      // Calculate user metrics
      const totalBookings = bookings.length;
      const totalSpent = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
      const upcomingEvents = bookings.filter(booking => 
        booking.eventId && new Date(booking.eventId.date) > new Date()
      ).length;
      const maintenanceRequests = complaints.filter(complaint => 
        complaint.status === 'pending'
      ).length;
      const outstandingDues = maintenance.filter(m => 
        m.status === 'pending'
      ).reduce((sum, m) => sum + (m.amount || 0), 0);

      setUserData({
        homeNumber: user.homeNumber || 'N/A',
        name: user.name || `Resident ${user.homeNumber || 'N/A'}`,
        outstandingDues,
        maintenanceRequests,
        upcomingEvents,
        recentNotices: 3, // Mock data
        totalBookings,
        totalSpent,
      });

      // Generate recent activities from actual data
      const activities = [];
      
      // Add recent bookings
      bookings.slice(0, 2).forEach(booking => {
        activities.push({
          text: `Booked ${booking.eventId?.title || 'Event'} for ${booking.attendees} people`,
          time: new Date(booking.bookedAt).toLocaleDateString(),
          type: 'booking'
        });
      });

      // Add recent complaints
      complaints.slice(0, 2).forEach(complaint => {
        activities.push({
          text: `Complaint: ${complaint.title} - ${complaint.status}`,
          time: new Date(complaint.createdAt).toLocaleDateString(),
          type: 'complaint'
        });
      });

      // Add maintenance payments
      maintenance.filter(m => m.status === 'completed').slice(0, 1).forEach(m => {
        activities.push({
          text: `Maintenance payment of ₹${m.amount} completed`,
          time: new Date(m.updatedAt).toLocaleDateString(),
          type: 'payment'
        });
      });

      setRecentActivities(activities.slice(0, 4));

    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      title: 'Pay Maintenance', 
      icon: <WalletIcon />, 
      color: '#4caf50', 
      path: '/maintenance',
      subtitle: 'Clear pending dues',
      urgent: userData.outstandingDues > 0
    },
    { 
      title: 'Raise Complaint', 
      icon: <BuildIcon />, 
      color: '#ff9800', 
      path: '/complaints',
      subtitle: 'Report an issue',
      urgent: false
    },
    { 
      title: 'Book Facility', 
      icon: <EventIcon />, 
      color: '#2196f3', 
      path: '/events',
      subtitle: 'Reserve spaces',
      urgent: false
    },
    { 
      title: 'View Notices', 
      icon: <NotificationsIcon />, 
      color: '#9c27b0', 
      path: '/notices',
      subtitle: 'Important updates',
      urgent: userData.recentNotices > 0
    },
  ];

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
          Welcome back, {userData.name}!
        </Typography>
        <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={6} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={60} />
                  <Skeleton variant="text" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" height={60} />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: isMobile ? 1 : 3,
    }}>
      <Box sx={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        px: isMobile ? 1 : 3,
      }}>
        {/* Hero Welcome Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            p: isMobile ? 2 : 4,
            mb: isMobile ? 2 : 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <Avatar 
              sx={{ 
                width: isMobile ? 80 : 100, 
                height: isMobile ? 80 : 100,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                fontSize: isMobile ? '2rem' : '2.5rem',
                mb: isMobile ? 2 : 0,
                mr: isMobile ? 0 : 3,
                border: '4px solid white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              {userData.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                fontWeight="bold"
                sx={{ 
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Welcome back, {userData.name}!
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <Chip 
                  icon={<HomeIcon />}
                  label={`Home ${userData.homeNumber}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  icon={<PeopleIcon />}
                  label="Resident Member"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              backdropFilter: 'blur(10px)',
            }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Quick Stats Dashboard */}
        <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              background: userData.outstandingDues > 0 
                ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' 
                : 'linear-gradient(135deg, #4ecdc4, #44a08d)',
              color: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
            }}>
              <CardContent sx={{ p: isMobile ? 2 : 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    mr: isMobile ? 1 : 2,
                    width: isMobile ? 40 : 50,
                    height: isMobile ? 40 : 50
                  }}>
                    <ReceiptIcon />
                  </Avatar>
                  {userData.outstandingDues > 0 && (
                    <WarningIcon sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                  )}
                </Box>
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  ₹{userData.outstandingDues.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  Outstanding Dues
                </Typography>
              </CardContent>
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }} />
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
            }}>
              <CardContent sx={{ p: isMobile ? 2 : 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    mr: isMobile ? 1 : 2,
                    width: isMobile ? 40 : 50,
                    height: isMobile ? 40 : 50
                  }}>
                    <BuildIcon />
                  </Avatar>
                </Box>
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  {userData.maintenanceRequests}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  Active Requests
                </Typography>
              </CardContent>
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }} />
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
              color: '#333',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
            }}>
              <CardContent sx={{ p: isMobile ? 2 : 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.8)', 
                    color: '#4caf50',
                    mr: isMobile ? 1 : 2,
                    width: isMobile ? 40 : 50,
                    height: isMobile ? 40 : 50
                  }}>
                    <EventIcon />
                  </Avatar>
                </Box>
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  {userData.upcomingEvents}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  Upcoming Events
                </Typography>
              </CardContent>
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
              }} />
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
              color: '#333',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s ease' }
            }}>
              <CardContent sx={{ p: isMobile ? 2 : 3, position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.8)', 
                    color: '#9c27b0',
                    mr: isMobile ? 1 : 2,
                    width: isMobile ? 40 : 50,
                    height: isMobile ? 40 : 50
                  }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
                  {userData.totalBookings}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                  Total Bookings
                </Typography>
              </CardContent>
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
              }} />
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper 
          elevation={0}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            p: isMobile ? 2 : 3,
            mb: isMobile ? 2 : 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            Quick Actions
          </Typography>
          
          <Grid container spacing={isMobile ? 2 : 3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    background: action.urgent 
                      ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
                      : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    color: action.urgent ? 'white' : '#333',
                    border: action.urgent ? 'none' : '1px solid #e0e0e0',
                    '&:hover': { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.3s ease'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardActionArea sx={{ p: isMobile ? 2 : 3, minHeight: '140px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Avatar sx={{ 
                        bgcolor: action.urgent ? 'rgba(255, 255, 255, 0.2)' : action.color,
                        mb: 2,
                        width: isMobile ? 50 : 60,
                        height: isMobile ? 50 : 60,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }}>
                        {action.icon}
                      </Avatar>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"}
                        fontWeight="bold"
                        sx={{ mb: 0.5 }}
                      >
                        {action.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: action.urgent ? 0.9 : 0.7,
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}
                      >
                        {action.subtitle}
                      </Typography>
                      {action.urgent && (
                        <Chip 
                          icon={<WarningIcon />}
                          label="Urgent"
                          size="small"
                          sx={{ 
                            mt: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                        />
                      )}
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Main Content Grid */}
        <Grid container spacing={isMobile ? 2 : 3}>
          {/* Recent Activities */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    fontWeight="bold"
                    sx={{ flex: 1 }}
                  >
                    Recent Activities
                  </Typography>
                  <Button 
                    size="small" 
                    endIcon={<ChevronRightIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>
                
                {recentActivities.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
                    borderRadius: '12px',
                    color: '#666'
                  }}>
                    <EventIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                      No Recent Activities
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.5 }}>
                      Your recent activities will appear here
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {recentActivities.map((activity, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ 
                          py: 2,
                          borderRadius: '12px',
                          mb: index < recentActivities.length - 1 ? 1 : 0,
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' }
                        }}>
                          <ListItemIcon sx={{ minWidth: '50px' }}>
                            <Avatar sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: 
                                activity.type === 'booking' ? '#4caf50' :
                                activity.type === 'complaint' ? '#ff9800' :
                                activity.type === 'payment' ? '#2196f3' : '#9c27b0'
                            }}>
                              {activity.type === 'booking' ? <EventIcon /> :
                               activity.type === 'complaint' ? <BuildIcon /> :
                               activity.type === 'payment' ? <ReceiptIcon /> : <NotificationsIcon />}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="medium">
                                {activity.text}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                {activity.time}
                              </Typography>
                            }
                          />
                          <IconButton size="small">
                            <ChevronRightIcon />
                          </IconButton>
                        </ListItem>
                        {index < recentActivities.length - 1 && (
                          <Divider sx={{ my: 0.5, opacity: 0.3 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Paper>
          </Grid>

          {/* Important Information Sidebar */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={0}
              sx={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                mb: 2
              }}
            >
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  fontWeight="bold"
                  sx={{ mb: 3, textAlign: 'center' }}
                >
                  Important Information
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    mb: 2
                  }}>
                    <ScheduleIcon sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Next Maintenance Due
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        December 15, 2024
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    color: 'white',
                    mb: 2
                  }}>
                    <TrendingUpIcon sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Event Spending
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        ₹{userData.totalSpent.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    p: 2, 
                    borderRadius: '12px',
                    border: '1px solid #e0e0e0',
                    background: '#fafafa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Society Office Hours
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Monday - Saturday: 9:00 AM - 6:00 PM
                    </Typography>
                    
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Emergency Contact
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                      <Typography variant="body2">+91 98765 43210</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                      <Typography variant="body2">admin@society.com</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>

        {/* Statistics Overview */}
        <Paper 
          elevation={0}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mt: isMobile ? 2 : 4
          }}
        >
          <CardContent sx={{ p: isMobile ? 2 : 4 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold"
              sx={{ mb: 4, textAlign: 'center' }}
            >
              Your Statistics Overview
            </Typography>
            
            <Grid container spacing={isMobile ? 2 : 4}>
              <Grid item xs={6} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white'
                }}>
                  <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
                    {userData.totalBookings}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Bookings
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                  color: 'white'
                }}>
                  <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
                    ₹{userData.totalSpent.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Event Spending
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                  color: '#333'
                }}>
                  <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
                    {userData.maintenanceRequests}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active Requests
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
                  color: '#333'
                }}>
                  <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
                    {userData.upcomingEvents}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Upcoming Events
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Paper>
      </Box>
    </Box>
  );
}

export default UserDashboard; 