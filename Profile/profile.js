document.addEventListener('DOMContentLoaded', () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData) window.location.href = '../Login_and_Registration/Login and Registration HTML.html'; // Redirect if not logged in

  // Initialize form with user data
  if (userData) {
    const [firstName, ...lastNameParts] = userData.full_name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    document.getElementById('firstName').value = firstName || '';
    document.getElementById('lastName').value = lastName || '';
    document.getElementById('email').value = userData.email;
    document.getElementById('mobile').value = userData.mobile || '';
    document.getElementById('address').value = userData.address || '';
  }

  // Logout functionality
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userData');
    window.location.href = '../Login_and_Registration/Login and Registration HTML.html';
  });

  // Modified save handler with mobile support
  document.getElementById('saveProfile').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const formData = {
      id: userData.id,
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      email: document.getElementById('email').value.trim(),
      mobile: document.getElementById('mobile').value.trim(),
      address: document.getElementById('address').value.trim(),
      currentPassword: document.getElementById('currentPassword').value,
      newPassword: document.getElementById('newPassword').value,
      confirmPassword: document.getElementById('confirmPassword').value
    };

    try {
      // Check for sensitive field changes
      const sensitiveChanges = 
        formData.email !== userData.email || 
        formData.mobile !== userData.mobile;

      if (sensitiveChanges) {
        const currentPassword = prompt('Please enter your password to confirm changes:');
        if (!currentPassword) return;
        
        const verified = await verifyPassword(currentPassword);
        if (!verified) {
          alert('Incorrect password! Changes not saved.');
          return;
        }
      }

      // Handle password change
      let passwordUpdate = {};
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          alert('New passwords do not match!');
          return;
        }
        if (formData.newPassword.length < 8) {
          alert('Password must be at least 8 characters!');
          return;
        }
        passwordUpdate = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };
      }

      // Merge all data
      const updateData = {
        ...formData,
        ...passwordUpdate,
        full_name: `${formData.firstName} ${formData.lastName}`
      };

      const response = await fetch('update_profile.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateData)
      });
      
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('userData', JSON.stringify(result.user));
        alert('Profile updated successfully!');
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred during update');
    }
  });

  // Rest of your existing JavaScript...

  async function verifyPassword(password) {
    try {
      const response = await fetch('verify_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.id,
          password: password
        })
      });
      return (await response.json()).success;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }
});