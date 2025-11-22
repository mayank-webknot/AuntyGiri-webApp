import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useLoginMutation, useGetMeQuery, useLogoutMutation } from '@/store/api/authApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // RTK Query hooks
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const { data: meData, refetch: refetchMe } = useGetMeQuery(undefined, {
    skip: !localStorage.getItem('auth_token'), // Only fetch if token exists
  });

  // Fetch user data on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      // Set user from localStorage immediately for faster UI
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Invalid stored user, clear it
        localStorage.removeItem('user');
      }
      
      // Then verify with backend
      refetchMe()
        .then((result) => {
          if (result.data?.success) {
            const userData = result.data.data;
            const updatedUser: User = {
              id: userData.id,
              email: userData.email,
              name: `${userData.firstName} ${userData.lastName}`,
              role: userData.role as User['role'],
              avatar: userData.avatar,
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        })
        .catch(() => {
          // If fetch fails, keep stored user but mark as potentially stale
          // This allows offline usage with cached data
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [refetchMe]);

  // Update user when meData changes
  useEffect(() => {
    if (meData?.success && meData.data) {
      const userData = meData.data;
      const updatedUser: User = {
        id: userData.id,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        role: userData.role as User['role'],
        avatar: userData.avatar,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [meData]);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password }).unwrap();
      
      if (result.success) {
        // Store token and user data
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('refreshToken', result.data.refreshToken);
        
        const userData = result.data.user;
        const user: User = {
          id: userData.id,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          role: userData.role as User['role'],
          avatar: userData.avatar,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Login failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if API call fails, clear local storage
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
