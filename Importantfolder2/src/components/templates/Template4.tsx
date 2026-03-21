import type { LandingPageData } from "@/lib/types";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Truck, ShieldCheck } from "lucide-react";

export function Template4(props: LandingPageData) {
  const {
    businessName,
    generatedContent,
    products,
    images
  } = props;

  const heroImage = images?.[0] || PlaceHolderImages.find(p => p.id === 'template4-hero')?.imageUrl || '/placeholder.svg';
  const productImages = [
      images?.[1] || PlaceHolderImages.find(p => p.id === 'template-product-1')?.imageUrl || '/placeholder.svg',
      images?.[2] || PlaceHolderImages.find(p => p.id === 'template-product-2')?.imageUrl || '/placeholder.svg',
      images?.[3] || PlaceHolderImages.find(p => p.id === 'template-product-3')?.imageUrl || '/placeholder.svg',
      images?.[4] || PlaceHolderImages.find(p => p.id === 'template-product-4')?.imageUrl || '/placeholder.svg',
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="font-headline text-2xl font-bold text-gray-900">{businessName}</h2>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 space-y-5">
            <h1 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
                {generatedContent?.headline || "Your One-Stop Shop"}
            </h1>
            <p className="text-lg text-gray-600">
                {generatedContent?.body || "Discover amazing products at unbeatable prices."}
            </p>
            <Button size="lg" className="mt-4 bg-primary text-primary-foreground text-lg px-8 py-6">
                {generatedContent?.callToAction || "Shop Now"} <ShoppingCart className="ml-2"/>
            </Button>
        </div>
        <div className="md:w-1/2 relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
             <Image
                src={heroImage}
                alt={`${businessName} featured product`}
                fill
                className="object-cover"
                data-ai-hint="ecommerce product"
              />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-headline font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(products?.slice(0,4) || ['Product 1', 'Product 2', 'Product 3', 'Product 4']).map((product, index) => (
              <Card key={index} className="overflow-hidden group text-center">
                <CardHeader className="p-0">
                  <div className="relative aspect-square">
                     <Image
                        src={productImages[index]}
                        alt={product}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint="stylish product"
                     />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold font-headline">{product}</CardTitle>
                  <p className="text-muted-foreground mt-1">$99.99</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button className="w-full">Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
       {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-headline font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                    <Truck className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-headline font-semibold mb-2">Fast Shipping</h3>
                    <p className="text-muted-foreground">Get your orders delivered to your doorstep in no time.</p>
                </div>
                <div className="p-6">
                    <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-headline font-semibold mb-2">Secure Payments</h3>
                    <p className="text-muted-foreground">Your transactions are safe with our advanced security.</p>
                </div>
                <div className="p-6">
                    <ShoppingCart className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-headline font-semibold mb-2">Quality Products</h3>
                    <p className="text-muted-foreground">We offer only the best quality products for our customers.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
            <p>&copy; {new Date().getFullYear()} {businessName}. Secure Shopping Guaranteed.</p>
        </div>
      </footer>
    </div>
  );
}
