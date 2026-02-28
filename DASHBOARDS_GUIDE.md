# Dashboard Setup and User Guide

## Overview
This application has three role-based dashboards:
1. **Student Dashboard** - For students to manage their learning profile
2. **Instructor Dashboard** - For instructors to manage their teaching profile
3. **Admin Dashboard** - For administrators to manage all users and system settings

---

## Student Dashboard

### Features
- ✅ View complete profile with profile picture
- ✅ Edit personal information (name, email, password)
- ✅ View account status and join date
- ✅ Track course statistics (courses, completed, in progress)
- ✅ Delete account option
- ✅ Logout functionality

### How to Access
1. Register as a Student
2. Login with your Student credentials
3. You'll be redirected to `/student-dashboard`

### Profile Management
- Click **"✎ Edit Profile"** button to update your information
- Change your name, email, or password
- Click **"Save Changes"** to update
- Click **"Cancel"** to discard changes

### Stats Section
Shows:
- Total courses enrolled
- Completed courses
- Courses in progress

---

## Instructor Dashboard

### Features
- ✅ View complete profile with profile picture
- ✅ Edit personal information (name, email, password)
- ✅ View account status and join date
- ✅ Track instructor statistics:
  - Courses created
  - Total students
  - Rating/Reviews
- ✅ Delete account option
- ✅ Logout functionality

### How to Access
1. Register as an Instructor
2. Login with your Instructor credentials
3. You'll be redirected to `/instructor-dashboard`

### Profile Management
- Similar to Student Dashboard
- Same edit and delete functionality
- Enhanced stats for teaching activities

---

## Admin Dashboard

### Features
- ✅ View all users in the system
- ✅ Search/filter users by name or email
- ✅ View user statistics:
  - Total users count
  - Total students count
  - Total instructors count
  - Active users count
- ✅ Manage user roles (Student, Instructor, Admin)
- ✅ Activate/Deactivate user accounts
- ✅ Edit user information
- ✅ Delete users
- ✅ View user profile pictures
- ✅ See user join dates
- ✅ Logout functionality

### How to Access
**Note:** Admin accounts cannot be self-registered for security reasons.

1. An existing Admin must create an Admin account via the backend
2. Or use an existing Admin account
3. Login with Admin credentials
4. You'll be redirected to `/admin-dashboard`

### Creating an Admin Account (Backend)
Use MongoDB directly or an API call:
```bash
POST /api/users/register
{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "ADMIN"
}
```

### User Management Features

#### Viewing Users
- All users are displayed in a table format
- Shows: Profile picture, name, email, role, status, join date
- Sort and search functionality

#### Searching Users
- Type in the search bar to find users by:
  - First name
  - Last name
  - Email address
- Results update in real-time

#### Editing Users
1. Click the **"Edit"** button for any user
2. A modal window opens with the user's information
3. Update any of these fields:
   - First Name
   - Last Name
   - Email
   - Role (Student, Instructor, Admin)
   - Active Status (checkbox)
4. Click **"Save Changes"** to update
5. Click **"Cancel"** to close without saving

#### Deleting Users
1. Click the **"Delete"** button for any user
2. Confirm the deletion in the popup
3. User account is permanently removed

#### User Roles
- **Student**: Can access Student Dashboard
- **Instructor**: Can access Instructor Dashboard
- **ADMIN**: Can access Admin Dashboard

#### User Status
- **Active**: User can login and use the system
- **Inactive**: User cannot login (can be reactivated)

---

## Dashboard Features Comparison

| Feature | Student | Instructor | Admin |
|---------|---------|-----------|-------|
| View Own Profile | ✅ | ✅ | ✅ |
| Edit Own Profile | ✅ | ✅ | ✅ |
| View All Users | ❌ | ❌ | ✅ |
| Edit Any User | ❌ | ❌ | ✅ |
| Delete Any User | ❌ | ❌ | ✅ |
| Manage User Roles | ❌ | ❌ | ✅ |
| View Statistics | ✅ | ✅ | ✅ |
| Search Users | ❌ | ❌ | ✅ |

---

## Design & UI Features

### Responsive Design
All dashboards are fully responsive and work on:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

### Visual Features
- Modern gradient backgrounds
- Profile picture circles with initials fallback
- Status badges with color coding
- Smooth animations and transitions
- Interactive hover effects
- Clean and professional layout

### Color Scheme
- **Primary**: Gradient (#667eea to #764ba2)
- **Success**: Green (#d1fae5)
- **Error**: Red (#ef4444)
- **Background**: Light gray to white

---

## Authentication Flow

### Registration
1. User selects "Create Account"
2. Fills in: First Name, Last Name, Email, Password, Role, Profile Picture
3. Profile picture is uploaded to Cloudinary
4. User account is created
5. Automatically switched to login view

### Login
1. User enters Email and Password
2. System validates credentials
3. User is stored in localStorage
4. User is redirected to appropriate dashboard based on role

### Logout
- Click **"Logout"** button on any dashboard
- localStorage is cleared
- User is redirected to login page

---

## Security Features

### Password Protection
- Passwords are hashed using bcryptjs
- Password stored securely in MongoDB
- Cannot be viewed in admin panel

### Admin Protection
- Admin accounts cannot be self-registered
- Must be created by existing admin or backend
- Only admins can manage other users' roles

### Data Protection
- Profile pictures stored on Cloudinary (secure cloud storage)
- Unique email requirement
- Account status control to disable/enable access

---

## Troubleshooting

### Common Issues

**Q: "All fields are required" error during registration**
- Ensure all fields including profile picture are filled
- Select an image file for profile picture

**Q: Profile picture not uploading**
- Check file size (max 5MB)
- Verify file format (JPEG, PNG, GIF, WebP)
- Check Cloudinary API credentials in .env

**Q: Cannot login to Dashboard**
- Verify email and password are correct
- Check if account is active (not deactivated by admin)
- Clear browser cache/cookies and try again

**Q: Admin Dashboard shows no users**
- Verify you're logged in as Admin
- Check backend is running and connected to MongoDB
- Ensure users exist in database

### API Endpoints

**User Routes (Backend)**
```
POST   /api/users/register          - Register new user
POST   /api/users/login             - Login user
GET    /api/users                   - Get all users (Admin)
GET    /api/users/:id               - Get user by ID
PUT    /api/users/:id               - Update user
DELETE /api/users/:id               - Delete user
```

---

## Frontend Routes

Add these routes to your React Router configuration:

```jsx
import StudentDashboard from './Component/UserManagement/Dashborad/StudentDashboard/StudentDashboard';
import InstructorDashboard from './Component/UserManagement/Dashborad/InstructorDashboard/InstructorDashboard';
import AdminDashboard from './Component/UserManagement/Dashborad/AdminDashboard/AdminDashboard';

<Route path="/student-dashboard" element={<StudentDashboard />} />
<Route path="/instructor-dashboard" element={<InstructorDashboard />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />
```

---

## Future Enhancements

Possible features to add:
- Password reset functionality
- Email verification
- Two-factor authentication
- User activity logs
- Bulk user import/export
- Advanced filtering and sorting
- Dashboard customization
- User notifications
- Activity timeline
- Performance analytics

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set correctly
3. Check browser console for error messages
4. Ensure backend server is running
5. Verify MongoDB connection is active
