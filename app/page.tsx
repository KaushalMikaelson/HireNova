import Image from "next/image";
import { HeroSection } from "@/components/Hero";
import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Force HMR to clear cache
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {

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
              );
            })}
          </div>
        </div>

      </section>

      <section className="w-full py-20 md:py-24  bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold ">
                50+
              </h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold ">
                1000+
              </h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold ">
                95%
              </h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold ">
                24/7
              </h3>
              <p className="text-muted-foreground">AI Support Available</p>
            </div>
          </div>
        </div>

      </section>

      <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-center md:text-4xl lg:text-5xl xl:text-6xl gradient-title">
              How it Works
            </h2>
          </div>
          <p className="text-center text-muted-foreground">
            Four Simple steps to accelerate your career growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto mt-12">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section className="w-full py-20 md:py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center md:text-4xl lg:text-5xl xl:text-6xl gradient-title">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => {

              return (
                <Card
                  key={index}
                  className="bg-background"
                >
                  <CardContent className="p-6 text-center flex flex-col items-center" >
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border-2 border-primary/20"
                          />
                        </div>
                        <div>
                          <p className=" font-semibold">{testimonial.author}</p>
                          <p className="text-muted-foreground">{testimonial.role}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                        </div>
                      </div>
                      <div>
                        <blockquote>
                          <p className="text-muted-foreground italic relative">
                            <span className="text-3xl text-primary absolute -top-4 -left-2">
                              &quot;
                            </span>
                            {testimonial.quote}</p>

                        </blockquote>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </section>

      <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center md:text-4xl lg:text-5xl xl:text-6xl gradient-title">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground">
            Find answers to most common questions about our platform.
          </p>
          <div className=" max-w-6xl mx-auto">
            <Accordion type="single" collapsible >
              {faqs.map((faq, index) => {
                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                      <span className="text-lg font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>

                )
              })}
            </Accordion>
          </div>
        </div>

      </section>

      <section className="w-full ">
        <div className=" mx-auto py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold  tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl ">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of professionals who have transformed their careers with HireNova.
            </p>
            <Link href="/dashboard" passHref>
              <Button size="lg" variant="secondary" className=" h-11 mt-5 animate-bounce ">
                Start Your Journey Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

          </div>
        </div>

      </section>

    </div>
  );
}
