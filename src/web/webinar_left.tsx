import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Mail, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WebinarLeft = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setSubscription(null);
    setSearched(false);

    try {
      const { data, error } = await (supabase as any)
        .from('usa_webinar')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .order('paid_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Use DB status but verify with real-time clock for safety
        const endsAt = new Date(data.ends_at);
        const isActuallyActive = new Date() < endsAt;
        
        setSubscription({
            ...data,
            calculatedStatus: isActuallyActive ? 'Active' : 'Expired'
        });
      } else {
        toast({
          title: "No Data Found",
          description: "We couldn't find a webinar subscription for this email.",
          variant: "destructive"
        });
      }
      setSearched(true);
    } catch (err: any) {
      console.error('Error fetching webinar data:', err);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Webinar Status</h1>
          <p className="text-gray-400">Enter your email to check your subscription period.</p>
        </div>

        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleCheck} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-gray-600 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 transition-all"
              >
                {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking...</> : "Check My Access"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && subscription && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 shadow-xl overflow-hidden">
              <div className="h-2 bg-blue-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ShieldCheck className="text-green-400 w-6 h-6" />
                  Subscription Active
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-200">
                  Hello <span className="font-bold text-white">{subscription.email}</span>, your webinar access details are below:
                </p>
                
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Start Date (Paid)</p>
                      <p className="text-gray-200 font-medium">{formatDate(subscription.paid_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="bg-amber-500/10 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Access Ends At</p>
                      <p className="text-gray-200 font-medium">{formatDate(subscription.ends_at)}</p>
                    </div>
                  </div>
                </div>

                <div className={`text-center p-3 rounded-lg font-bold text-sm ${subscription.calculatedStatus === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  Status: {subscription.calculatedStatus.toUpperCase()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {searched && !subscription && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">No active subscription found for this email address.</p>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-gray-500 text-xs italic">
            Questions? Contact our support via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};

// Simplified Label component since it might be missing in some setups
const Label = ({ children, htmlFor, className }: any) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

export default WebinarLeft;
