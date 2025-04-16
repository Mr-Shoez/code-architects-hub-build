
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EdgeFunctionTest = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const callFunction = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('hello-world', {
        body: { name }
      });

      if (error) throw error;

      toast.success(data.message);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to call function');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Test Edge Function</h2>
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button 
          onClick={callFunction}
          disabled={loading}
        >
          {loading ? "Calling..." : "Call Function"}
        </Button>
      </div>
    </div>
  );
};

export default EdgeFunctionTest;
