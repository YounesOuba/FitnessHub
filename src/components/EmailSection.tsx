


import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !emailRegex.test(email)) {
      toast({
        variant: "destructive",
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Please enter a valid email address.</span>
          </div>
        ),
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // First, create the table if it doesn't exist
      const { error: createTableError } = await supabase.rpc('create_subscribers_table');
      
      if (createTableError && !createTableError.message.includes('already exists')) {
        console.error('Error creating table:', createTableError);
        throw new Error('Failed to initialize subscription system');
      }

      // Check if email already exists
      const { data: existingEmails, error: checkError } = await supabase
        .from('subscribers')
        .select('email')
        .eq('email', email);

      if (checkError) {
        console.error('Error checking email:', checkError);
        throw new Error('Failed to verify email');
      }

      if (existingEmails && existingEmails.length > 0) {
        toast({
          variant: "destructive",
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>This email is already subscribed.</span>
            </div>
          ),
          duration: 5000,
        });
        return;
      }

      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('subscribers')
        .insert([{ 
          email, 
          subscribed_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error inserting subscriber:', insertError);
        throw new Error('Failed to add subscription');
      }

      toast({
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Successfully subscribed! Check your email.</span>
          </div>
        ),
        duration: 5000,
      });
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        variant: "destructive",
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>
              {error instanceof Error ? error.message : 'Subscription failed. Try again later.'}
            </span>
          </div>
        ),
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
};


  return(
        <section className="py-16 bg-[#212121]">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2b2b2b] rounded-2xl p-8 lg:p-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stay Motivated with Weekly Tips
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Get exclusive workout routines, nutrition advice, and wellness tips delivered 
            straight to your inbox every week.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-[#1a1a1a] text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#cfff6a] disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#cfff6a] text-[#212121] hover:bg-[#b6e85a] px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </form>
          <p className="text-sm text-white/60 mt-4">
            Join us now. Unsubscribe anytime. Your email is safe with us.
          </p>
        </div>
      </div>
    </section>
    )

}

export default EmailSection;





























// function doPost(e) {
//   var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//   var data = JSON.parse(e.postData.contents);
//   sheet.appendRow([data.email]);
//   return ContentService.createTextOutput("Success");
// }
