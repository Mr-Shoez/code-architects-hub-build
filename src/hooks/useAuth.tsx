
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  userRole: string;
  userName: string;
  isLoading: boolean;
  isLeadership: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  userRole: "",
  userName: "",
  isLoading: true,
  isLeadership: false,
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
      
      // Fetch user role if logged in
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole("");
        setUserName("");
      }
    });
    
    // Then check current session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setIsLoading(false);
    };
    
    fetchSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('club_members')
        .select('name, role')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }
      
      if (data) {
        setUserRole(data.role);
        setUserName(data.name);
      } else {
        setUserRole("Member");
        setUserName("");
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole("");
      setUserName("");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };
  
  const isLeadership = ["President", "Vice President", "Secretary", "Treasurer"].includes(userRole);
  
  const value = {
    user,
    isLoggedIn: !!user,
    userRole,
    userName,
    isLoading,
    isLeadership,
    signOut
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default useAuth;
