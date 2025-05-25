import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { useAuthStore } from '../stores/useAuthStore';
import { BrainCircuit, Mail, Lock } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, error: authError } = useAuthStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (!email.trim() || !password) {
        throw new Error('Please fill in all fields');
      }

      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      if (isRegistering && password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      if (isRegistering) {
        await register(email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Flash Cards</h1>
          <p className="text-gray-600 mt-1">Learn smarter, not harder</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={error}
              fullWidth
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              error={error}
              fullWidth
              required
            />
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            
            <Button 
              type="submit" 
              isFullWidth
              isLoading={isLoading}
            >
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </Button>

            {!isRegistering && (
              <p className="text-sm text-center text-gray-600">
                Forgot your password? Please contact support for assistance.
              </p>
            )}
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isRegistering 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;