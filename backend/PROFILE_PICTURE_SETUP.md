# Profile Picture with Cloudinary Setup Guide

## Files Created/Modified

### 1. **Configuration Files**
   - `config/cloudinary.js` - Cloudinary configuration
   - `middleware/uploadMiddleware.js` - Multer file upload middleware
   - `.env.example` - Environment variables template

### 2. **Updated Files**
   - `Model/UserModel.js` - Added `profilePicture` field
   - `Controller/UserController.js` - Updated `registerUser` to handle file uploads
   - `Route/UserRoute.js` - Added multer middleware to register route
   - `app.js` - Added upload directory creation and extended JSON parsing
   - `package.json` - Added cloudinary and multer dependencies

## Setup Instructions

### Step 1: Install Dependencies
```bash
npm install cloudinary multer
```

### Step 2: Configure Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com) and create a free account
2. Get your credentials from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

3. Create a `.env` file in the backend folder with:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Frontend Request Format
When registering a user, send a multipart form-data request:

```javascript
const formData = new FormData();
formData.append("first_name", "John");
formData.append("last_name", "Doe");
formData.append("email", "john@example.com");
formData.append("password", "password123");
formData.append("role", "Student");
formData.append("profilePicture", fileInput.files[0]); // File from input

fetch("http://localhost:5000/api/users/register", {
  method: "POST",
  body: formData
});
```

### Step 4: HTML Form Example
```html
<form id="registerForm">
  <input type="text" name="first_name" required />
  <input type="text" name="last_name" required />
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <select name="role" required>
    <option value="Student">Student</option>
    <option value="Instructor">Instructor</option>
  </select>
  <input type="file" name="profilePicture" accept="image/*" required />
  <button type="submit">Register</button>
</form>
```

## Features

✅ Profile picture is **required** during registration
✅ Supports image formats: JPEG, PNG, GIF, WebP
✅ Maximum file size: 5MB
✅ Images automatically uploaded to Cloudinary
✅ Temporary files cleaned up after upload
✅ Profile picture URL stored in database
✅ Returns profilePicture URL in response

## API Response Example

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "role": "Student",
    "profilePicture": "https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/quality-education/profile-pictures/abc.jpg"
  }
}
```

## Error Handling

- Missing profile picture → 400 error
- Invalid image format → Multer rejection
- Cloudinary upload failure → 500 error with cleanup
- Email already exists → 400 error

## Notes

- The local `uploads/` folder is created automatically
- Temporary files are deleted after successful upload to Cloudinary
- Profile pictures are organized in Cloudinary under `quality-education/profile-pictures/` folder
- The profilePicture URL is returned in all user responses
