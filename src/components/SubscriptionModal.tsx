
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Check, Loader2 } from 'lucide-react';
import { usePremium } from '@/hooks/usePremium';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { isPremium, upgradeLoading, promoLoading, handleUpgrade, checkPromoCode } = usePremium();
  const [promoCode, setPromoCode] = useState('');

  const handlePromoSubmit = async () => {
    if (promoCode.trim()) {
      await checkPromoCode(promoCode.trim());
      setPromoCode('');
    }
  };

  if (isPremium) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400">
              <Crown className="h-6 w-6 fill-current" />
              Premium Active
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-yellow-400 fill-current" />
            </div>
            <h3 className="text-xl font-bold mb-2">You're Premium!</h3>
            <p className="text-gray-400 mb-6">
              You have unlimited uploads and subjects. Enjoy all premium features!
            </p>
            <Button 
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Star className="h-5 w-5" />
                Premium Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-white">
                $49.99
                <span className="text-sm font-normal text-gray-400 ml-2">one-time</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Unlimited file uploads</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Unlimited subjects</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Advanced quiz analytics</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>

              <Button 
                onClick={handleUpgrade}
                disabled={upgradeLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                {upgradeLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upgrade Now'
                )}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="text-center">
              <span className="text-gray-400 text-sm">Have a promo code?</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handlePromoSubmit()}
              />
              <Button 
                onClick={handlePromoSubmit}
                disabled={promoLoading || !promoCode.trim()}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {promoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="border-yellow-400 text-yellow-400 text-xs">
                Try code: SURAJ28
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
