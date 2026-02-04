import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowLeft, Zap, Crown } from 'lucide-react';

export default function Pricing() {
  const [loading, setLoading] = useState('');

  const handleCheckout = async (priceId, planName) => {
    // Check if in iframe
    if (window.self !== window.top) {
      alert('Checkout is only available in the published app. Please open the app in a new tab.');
      return;
    }

    setLoading(planName);
    try {
      const response = await base44.functions.invoke('createCheckout', { priceId });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/Dashboard">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start planning professional app prompts today
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card className="border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="mx-auto mb-4 p-3 bg-indigo-100 rounded-full w-fit">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Monthly</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $5.99
                <span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for regular use</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">AI-powered prompt generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">5P framework guidance</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Template library access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Visual preview mode</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Cancel anytime</span>
                </li>
              </ul>
              <Button
                onClick={() => handleCheckout('price_1SrkhFEL1sKIN5QLrTDqk7V2', 'monthly')}
                disabled={loading !== ''}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-lg"
              >
                {loading === 'monthly' ? 'Processing...' : 'Get Started'}
              </Button>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card className="border-2 border-yellow-400 hover:border-yellow-500 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-yellow-400 text-gray-900 font-bold px-3 py-1">
                BEST VALUE
              </Badge>
            </div>
            <CardHeader className="text-center pb-8 pt-8">
              <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full w-fit">
                <Crown className="h-8 w-8 text-gray-900" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Lifetime Access</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $399
                <span className="text-lg font-normal text-gray-600">/forever</span>
              </div>
              <p className="text-gray-600">One-time payment, lifetime access</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Everything in Monthly, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Lifetime access - no recurring fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">All future updates included</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Save $72+ per year</span>
                </li>
              </ul>
              <Button
                onClick={() => handleCheckout('price_1SrkhFEL1sKIN5QLhHjOss11', 'lifetime')}
                disabled={loading !== ''}
                className="w-full py-6 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-lg"
              >
                {loading === 'lifetime' ? 'Processing...' : 'Get Lifetime Access'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>🔒 Secure payment processing by Stripe</p>
          <p className="mt-2">Need help? Contact support@yourapp.com</p>
        </div>
      </div>
    </div>
  );
}