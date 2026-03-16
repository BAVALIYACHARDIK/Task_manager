import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { signup, validateEmail, validatePassword } from '../service/authService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    fullName?: string;
  }>({});
  const navigate = useNavigate();

  /**
   * Validate form fields on change
   */
  const validateField = (field: string, value: string) => {
    const errors = { ...fieldErrors };

    if (field === 'email') {
      if (!value) {
        errors.email = 'Email is required';
      } else if (!validateEmail(value)) {
        errors.email = 'Please enter a valid email address';
      } else {
        delete errors.email;
      }
    }

    if (field === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (!validatePassword(value)) {
        errors.password = 'Password must be at least 6 characters';
      } else {
        delete errors.password;
      }
    }

    if (field === 'fullName') {
      if (!value) {
        errors.fullName = 'Full name is required';
      } else if (value.trim().length === 0) {
        errors.fullName = 'Full name cannot be empty';
      } else {
        delete errors.fullName;
      }
    }

    setFieldErrors(errors);
  };

  /**
   * Handle input changes
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateField('email', value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateField('password', value);
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    validateField('fullName', value);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    validateField('email', email);
    validateField('password', password);
    validateField('fullName', fullName);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // Call signup service with business logic
      const result = await signup({
        email,
        password,
        fullName,
      });

      if (result.success) {
        // Navigate to dashboard on successful signup
        navigate('/dashboard');
      } else {
        // Display error message from service
        setError(result.error || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Join us to start managing your tasks
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={handleFullNameChange}
                required
                className={`w-full ${fieldErrors.fullName ? 'border-red-500' : ''}`}
              />
              {fieldErrors.fullName && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                className={`w-full ${fieldErrors.email ? 'border-red-500' : ''}`}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password (min. 6 characters)"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`w-full ${fieldErrors.password ? 'border-red-500' : ''}`}
              />
              {fieldErrors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || Object.keys(fieldErrors).length > 0}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            {/* Link to Login */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
