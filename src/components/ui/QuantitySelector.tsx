import React, { useState, useEffect } from 'react';
import { Button } from './button.tsx';
import { Card, CardContent } from './card.tsx';
import { Badge } from './badge.tsx';

interface QuantitySelectorProps {
  basePrice: number;
  onQuantityChange: (quantity: number, totalPrice: number, savings: number) => void;
  gumroadUrl: string;
}

interface PricingTier {
  quantity: number;
  price: number;
  savings: number;
  popular?: boolean;
  badge?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  basePrice, 
  onQuantityChange, 
  gumroadUrl 
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Pricing tiers with bulk discounts
  const pricingTiers: PricingTier[] = [
    {
      quantity: 1,
      price: basePrice,
      savings: 0,
    },
    {
      quantity: 2,
      price: basePrice * 1.85, // 7.5% discount
      savings: basePrice * 0.15,
      badge: "Save 7.5%"
    },
    {
      quantity: 3,
      price: basePrice * 2.7, // 10% discount
      savings: basePrice * 0.3,
      popular: true,
      badge: "Most Popular"
    },
    {
      quantity: 6,
      price: basePrice * 5.1, // 15% discount
      savings: basePrice * 0.9,
      badge: "Best Value"
    }
  ];

  const currentTier = pricingTiers.find(tier => tier.quantity === selectedQuantity) || pricingTiers[0];

  useEffect(() => {
    onQuantityChange(selectedQuantity, currentTier.price, currentTier.savings);
  }, [selectedQuantity, currentTier, onQuantityChange]);

  const handleQuantitySelect = (quantity: number) => {
    setSelectedQuantity(quantity);
    
    // Track quantity selection
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quantity_selected', {
        quantity: quantity,
        total_price: currentTier.price,
        savings: currentTier.savings
      });
    }
  };

  const getSupplyDuration = (quantity: number) => {
    const daysPerContainer = 30;
    const totalDays = quantity * daysPerContainer;
    if (totalDays < 60) {
      return `${totalDays} days`;
    } else {
      const months = Math.floor(totalDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">Choose Your Supply</h3>
        <p className="text-sm text-muted-foreground">
          Larger quantities save you more money and ensure you never run out
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.quantity}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedQuantity === tier.quantity 
                ? 'ring-2 ring-nbs-primary bg-nbs-primary/5' 
                : 'hover:ring-1 hover:ring-nbs-primary/50'
            } ${tier.popular ? 'scale-105 relative' : ''}`}
            onClick={() => handleQuantitySelect(tier.quantity)}
          >
            {tier.popular && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <Badge className="bg-nbs-accent text-white px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardContent className="p-4 text-center">
              <div className="mb-2">
                <div className="text-2xl font-bold">
                  {tier.quantity}
                </div>
                <div className="text-sm text-muted-foreground">
                  {tier.quantity === 1 ? 'Container' : 'Containers'}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-lg font-semibold text-nbs-primary">
                  ${tier.price.toFixed(2)}
                </div>
                {tier.savings > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ${tier.savings.toFixed(2)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  ${(tier.price / tier.quantity).toFixed(2)} each
                </div>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <div>{getSupplyDuration(tier.quantity)} supply</div>
                {tier.badge && tier.badge !== "Most Popular" && (
                  <Badge variant="secondary" className="text-xs">
                    {tier.badge}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected quantity summary */}
      <Card className="bg-gradient-to-r from-nbs-primary/5 to-nbs-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">
                {selectedQuantity} {selectedQuantity === 1 ? 'Container' : 'Containers'} Selected
              </div>
              <div className="text-sm text-muted-foreground">
                {getSupplyDuration(selectedQuantity)} of premium pre-workout
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-nbs-primary">
                ${currentTier.price.toFixed(2)}
              </div>
              {currentTier.savings > 0 && (
                <div className="text-sm text-green-600 font-medium">
                  You save ${currentTier.savings.toFixed(2)}!
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk discount benefits */}
      {selectedQuantity > 1 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800">
          <CardContent className="p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Bulk Purchase Benefits
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>• Never run out of your pre-workout</li>
              <li>• Lock in current pricing</li>
              <li>• Free shipping (orders over $50)</li>
              {selectedQuantity >= 3 && <li>• Priority customer support</li>}
              {selectedQuantity >= 6 && <li>• Early access to new products</li>}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Shipping and guarantee info */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span>Free shipping over $50</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>30-day guarantee</span>
          </div>
        </div>
        <div className="text-xs">
          Secure checkout powered by Gumroad • Ships within 1-2 business days
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;