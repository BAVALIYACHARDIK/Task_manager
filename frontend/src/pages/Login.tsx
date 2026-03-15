import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { login, validateEmail, validatePassword } from '../service/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
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

    setFieldErrors(errors);
  };

  /**
   * Handle email input change
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateField('email', value);
  };

  /**
   * Handle password input change
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateField('password', value);
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

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      // Call login service with business logic
      const result = await login({ email, password });

      if (result.success) {
        // Navigate to the protected dashboard on successful login
        navigate('/dashboard');
      } else {
        // Display error message from service
        setError(result.error || 'Login failed');
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
            Sign In to Your Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
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

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || Object.keys(fieldErrors).length > 0}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;