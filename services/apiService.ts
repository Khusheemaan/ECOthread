const API_BASE_URL = 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dob?: string;
  username?: string;
  stylePreferences?: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  user?: T;
  message?: string;
}

export const registerUserAPI = async (
  email: string,
  password: string,
  profile: {
    name: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dob?: string;
  }
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        ...profile,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Registration failed',
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};

export const loginUserAPI = async (
  email: string,
  password: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};

export const updateUserProfileAPI = async (
  userId: string,
  profileUpdates: {
    name?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    phone?: string;
    dob?: string;
    stylePreferences?: string[];
  }
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileUpdates),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data.user,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Profile update failed',
      };
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
};