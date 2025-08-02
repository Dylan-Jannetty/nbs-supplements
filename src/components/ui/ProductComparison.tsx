import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card.tsx';
import { Badge } from './badge.tsx';
import { Button } from './button.tsx';

interface ProductComparisonProps {
  currentProduct: {
    name: string;
    price: number;
    features: string[];
    rating: number;
  };
}

interface CompetitorProduct {
  name: string;
  price: number;
  features: string[];
  rating: number;
  artificial: boolean;
  clinicalDoses: boolean;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ currentProduct }) => {
  const [showComparison, setShowComparison] = useState(false);

  const competitors: CompetitorProduct[] = [
    {
      name: "Brand X Pre-Workout",
      price: 45.99,
      features: ["Artificial flavors", "Proprietary blend", "Synthetic caffeine"],
      rating: 4.2,
      artificial: true,
      clinicalDoses: false
    },
    {
      name: "Brand Y Energy",
      price: 38.99,
      features: ["Underdosed ingredients", "Artificial colors", "Sugar alcohols"],
      rating: 3.8,
      artificial: true,
      clinicalDoses: false
    },
    {
      name: "Brand Z Performance",
      price: 52.99,
      features: ["Hidden ingredients", "Artificial sweeteners", "Synthetic compounds"],
      rating: 4.0,
      artificial: true,
      clinicalDoses: false
    }
  ];

  const comparisonFeatures = [
    { feature: "Clinical Doses", catalyst: true, description: "All ingredients at research-backed doses" },
    { feature: "Natural Ingredients", catalyst: true, description: "No artificial colors, flavors, or sweeteners" },
    { feature: "Third-Party Tested", catalyst: true, description: "Verified purity and potency" },
    { feature: "Pharmacist Formulated", catalyst: true, description: "Expert pharmaceutical knowledge" },
    { feature: "No Proprietary Blends", catalyst: true, description: "Full transparency of ingredients" },
    { feature: "USA Manufacturing", catalyst: true, description: "FDA-registered facility" },
    { feature: "Money-Back Guarantee", catalyst: true, description: "30-day satisfaction guarantee" }
  ];

  if (!showComparison) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">How does Catalyst compare?</h3>
          <p className="text-muted-foreground mb-4">
            See how Catalyst stacks up against other pre-workout supplements
          </p>
          <Button
            variant="outline"
            onClick={() => setShowComparison(true)}
            className="hover:bg-nbs-primary hover:text-white"
          >
            Compare Products
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Product Comparison</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComparison(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Feature</th>
                <th className="text-center p-4">
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-nbs-primary">{currentProduct.name}</div>
                    <Badge className="mt-1 bg-nbs-primary text-white">Our Product</Badge>
                  </div>
                </th>
                {competitors.map((competitor, index) => (
                  <th key={index} className="text-center p-4">
                    <div className="font-medium text-muted-foreground">{competitor.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium">Price</td>
                <td className="text-center p-4">
                  <span className="text-lg font-bold text-nbs-primary">${currentProduct.price}</span>
                </td>
                {competitors.map((competitor, index) => (
                  <td key={index} className="text-center p-4">
                    <span className="text-lg">${competitor.price}</span>
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Rating</td>
                <td className="text-center p-4">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-bold">{currentProduct.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(currentProduct.rating) ? 'text-nbs-accent fill-current' : 'text-muted-foreground'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </td>
                {competitors.map((competitor, index) => (
                  <td key={index} className="text-center p-4">
                    <div className="flex items-center justify-center gap-1">
                      <span>{competitor.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(competitor.rating) ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              {comparisonFeatures.map((feature, index) => (
                <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{feature.feature}</div>
                      <div className="text-sm text-muted-foreground">{feature.description}</div>
                    </div>
                  </td>
                  <td className="text-center p-4">
                    <svg className="w-6 h-6 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </td>
                  {competitors.map((competitor, compIndex) => (
                    <td key={compIndex} className="text-center p-4">
                      <svg className="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          <Card className="border-2 border-nbs-primary bg-nbs-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-nbs-primary">{currentProduct.name}</CardTitle>
                <Badge className="bg-nbs-primary text-white">Our Product</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-bold text-nbs-primary">${currentProduct.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-bold">{currentProduct.rating}/5</span>
                </div>
                {comparisonFeatures.map((feature, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{feature.feature}:</span>
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {competitors.map((competitor, index) => (
            <Card key={index} className="opacity-75">
              <CardHeader>
                <CardTitle className="text-muted-foreground">{competitor.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-bold">${competitor.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span>{competitor.rating}/5</span>
                  </div>
                  {comparisonFeatures.map((feature, fIndex) => (
                    <div key={fIndex} className="flex justify-between items-center">
                      <span className="text-sm">{feature.feature}:</span>
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
                Why Catalyst Stands Out
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Unlike other pre-workouts that hide behind proprietary blends and artificial ingredients, 
                Catalyst provides full transparency with clinical doses of natural, research-backed ingredients. 
                Every ingredient serves a purpose, and every dose is optimized for maximum effectiveness.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductComparison;