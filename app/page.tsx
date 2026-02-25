import Image from "next/image";
import { HeroSection } from "@/components/Hero";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { features } from "@/data/features";


export default function Home() {
  return (
    <div>
      <div className="grid-background"></div>
      <HeroSection />
      <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center md:text-4xl lg:text-5xl xl:text-6xl gradient-title">
            Powerful features for Your Carrer Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">{features.map((feature, index) => {
            return (
              <Card 
              key={index}
              className="border-2 hover:border-primary transition-colors duration-300 shadow-none bg-transparent"
              >
                <CardContent className="p-6 text-center flex flex-col items-center" >
                    <div className="flex flex-col items-center justify-center">
                      {feature.icon}
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                </CardContent>
              </Card>
            )
          })}

          </div>
        </div>
        
      </section>
    </div>
  );
}
