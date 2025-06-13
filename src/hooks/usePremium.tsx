
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    }
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking premium status:', error);
        return;
      }

      setIsPremium(!!data?.is_premium);
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;

    setUpgradeLoading(true);
    try {
      // Simulate payment processing (you can integrate with Stripe here)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          is_premium: true,
          upgraded_at: new Date().toISOString(),
          upgrade_method: 'payment'
        });

      if (error) throw error;

      setIsPremium(true);
      toast({
        title: "Welcome to Premium!",
        description: "You now have unlimited uploads and subjects!",
      });
    } catch (error: any) {
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to upgrade to premium",
        variant: "destructive",
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const checkPromoCode = async (code: string) => {
    if (!user) return;

    setPromoLoading(true);
    try {
      if (code.toUpperCase() === 'SURAJ28') {
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            is_premium: true,
            upgraded_at: new Date().toISOString(),
            upgrade_method: 'promo_code',
            promo_code: code.toUpperCase()
          });

        if (error) throw error;

        setIsPremium(true);
        toast({
          title: "Promo Code Applied!",
          description: "Welcome to Premium! You now have unlimited access.",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "The promo code you entered is not valid.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to apply promo code",
        variant: "destructive",
      });
    } finally {
      setPromoLoading(false);
    }
  };

  return {
    isPremium,
    upgradeLoading,
    promoLoading,
    handleUpgrade,
    checkPromoCode,
    checkPremiumStatus
  };
};
