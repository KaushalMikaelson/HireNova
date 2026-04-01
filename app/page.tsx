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
import * as motion from "framer-motion/client";

// Force HMR to clear cache
export default function Home() {
  return (
    <div>
      <div className="grid-background"></div>
      <HeroSection />
      <section id="features" className="w-full py-20 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center md:text-4xl lg:text-5xl xl:text-6xl gradient-title mb-8">
            Powerful Features for Your Career Growth
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={feature.href} className="block h-full">
                    <Card
                      className="h-full border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
                    >
                      <CardContent className="p-6 text-center flex flex-col items-center h-full justify-center" >
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                            {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground/90">{feature.title}</h3>
                          <p className="text-muted-foreground/80 font-medium leading-relaxed">{feature.description}</p>
                          <span className="mt-4 flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

      </section>

      <section className="w-full py-20 md:py-24  bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            <div className="flex flex-col items-center justify-center space-y-3 group bg-background/30 backdrop-blur-sm p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-5xl font-extrabold tracking-tighter gradient-title transition-transform duration-300 group-hover:scale-110">
                50+
              </h3>
              <p className="text-muted-foreground font-medium text-lg">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3 group bg-background/30 backdrop-blur-sm p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-5xl font-extrabold tracking-tighter gradient-title transition-transform duration-300 group-hover:scale-110">
                1000+
              </h3>
              <p className="text-muted-foreground font-medium text-lg">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3 group bg-background/30 backdrop-blur-sm p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-5xl font-extrabold tracking-tighter gradient-title transition-transform duration-300 group-hover:scale-110">
                95%
              </h3>
              <p className="text-muted-foreground font-medium text-lg">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3 group bg-background/30 backdrop-blur-sm p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-5xl font-extrabold tracking-tighter gradient-title transition-transform duration-300 group-hover:scale-110">
                24/7
              </h3>
              <p className="text-muted-foreground font-medium text-lg">AI Support Available</p>
            </div>
          </motion.div>
        </div>

      </section>

      <section className="w-full py-20 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl gradient-title">
              How It Works
            </h2>
          </div>
          <p className="text-center text-muted-foreground">
            Four Simple steps to accelerate your career growth.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto mt-12">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center text-center space-y-5 group"
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-primary group-hover:border-primary/40 group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold tracking-tight text-foreground/90">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground/80 font-medium leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
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
            {testimonial.map((t, index) => {

              return (
                <Card
                  key={index}
                  className="bg-background/50 backdrop-blur-sm border-border/50 shadow-lg hover:-translate-y-1 transition-transform duration-300"
                >
                  <CardContent className="p-6 text-center flex flex-col items-center" >
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            src={t.image}
                            alt={t.author}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border-2 border-primary/20"
                          />
                        </div>
                        <div>
                          <p className=" font-semibold">{t.author}</p>
                          <p className="text-muted-foreground">{t.role}</p>
                          <p className="text-sm text-muted-foreground">{t.company}</p>
                        </div>
                      </div>
                      <div>
                        <blockquote>
                          <p className="text-muted-foreground italic relative">
                            <span className="text-3xl text-primary absolute -top-4 -left-2">
                              &quot;
                            </span>
                            {t.quote}</p>

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
              <Button size="lg" variant="secondary" className="h-11 mt-5 group hover:bg-white hover:text-black transition-all duration-300 px-8 rounded-full font-semibold shadow-xl">
                Start Your Journey Today{" "}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>

          </div>
        </div>

      </section>

    </div>
  );
}
