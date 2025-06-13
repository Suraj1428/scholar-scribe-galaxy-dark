
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
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
      // For now, check localStorage until the database table is created
      const premiumStatus = localStorage.getItem(`premium_${user.id}`);
      setIsPremium(premiumStatus === 'true');
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;

    setUpgradeLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store in localStorage for now
      localStorage.setItem(`premium_${user.id}`, 'true');
      localStorage.setItem(`premium_method_${user.id}`, 'payment');
      localStorage.setItem(`premium_date_${user.id}`, new Date().toISOString());

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
        // Store in localStorage for now
        localStorage.setItem(`premium_${user.id}`, 'true');
        localStorage.setItem(`premium_method_${user.id}`, 'promo_code');
        localStorage.setItem(`premium_code_${user.id}`, code.toUpperCase());
        localStorage.setItem(`premium_date_${user.id}`, new Date().toISOString());

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
