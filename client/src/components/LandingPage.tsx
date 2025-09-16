import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Users } from "lucide-react";
import sageAvatar from "@assets/generated_images/Sage_AI_mentor_avatar_094407dc.png";
import jaxAvatar from "@assets/generated_images/Jax_AI_mentor_avatar_2101b220.png";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/30" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6" data-testid="hero-title">
            Your AI-Powered <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Emotional Journey
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto" data-testid="hero-description">
            Discover yourself through interactive journaling with personalized AI mentorship. 
            Get insights from Sage's gentle guidance and Jax's direct feedback, powered by MBTI analysis.
          </p>
          <Button size="lg" onClick={handleLogin} className="text-lg px-8 py-6" data-testid="button-get-started">
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* AI Mentors Section */}
      <section className="py-16 px-4" data-testid="section-mentors">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" data-testid="mentors-title">Meet Your AI Mentors</h2>
          <p className="text-muted-foreground" data-testid="mentors-description">
            Two distinct personalities to guide your emotional growth
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="text-center hover-elevate" data-testid="card-sage">
            <CardHeader>
              <div className="mx-auto w-24 h-24 mb-4 bg-accent rounded-full flex items-center justify-center">
                <img 
                  src={sageAvatar} 
                  alt="Sage AI Mentor" 
                  className="w-16 h-16 object-cover rounded-full"
                  data-testid="img-sage-avatar"
                />
              </div>
              <CardTitle className="text-2xl text-accent-foreground" data-testid="text-sage-name">Sage</CardTitle>
              <CardDescription data-testid="text-sage-description">Gentle Wisdom & Clarity</CardDescription>
            </CardHeader>
            <CardContent data-testid="text-sage-details">
              <p className="text-muted-foreground">
                Provides compassionate insights and helps you understand your emotions with gentle, encouraging guidance.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover-elevate" data-testid="card-jax">
            <CardHeader>
              <div className="mx-auto w-24 h-24 mb-4 bg-chart-3/20 rounded-full flex items-center justify-center">
                <img 
                  src={jaxAvatar} 
                  alt="Jax AI Mentor" 
                  className="w-16 h-16 object-cover rounded-full"
                  data-testid="img-jax-avatar"
                />
              </div>
              <CardTitle className="text-2xl text-foreground" data-testid="text-jax-name">Jax</CardTitle>
              <CardDescription data-testid="text-jax-description">Direct Truth & Growth</CardDescription>
            </CardHeader>
            <CardContent data-testid="text-jax-details">
              <p className="text-muted-foreground">
                Offers honest, direct feedback to challenge your thinking and accelerate personal growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30" data-testid="section-features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="features-title">Why Choose EmotiWise?</h2>
            <p className="text-muted-foreground" data-testid="features-description">
              Combining psychology, AI, and personalization for your emotional well-being
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate" data-testid="card-feature-ai">
              <CardHeader>
                <Brain className="w-12 h-12 text-primary mb-4" data-testid="icon-brain" />
                <CardTitle data-testid="text-feature-ai-title">AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent data-testid="text-feature-ai-content">
                Real-time emotional analysis and personalized responses based on your unique psychological profile.
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-mbti">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" data-testid="icon-users" />
                <CardTitle data-testid="text-feature-mbti-title">MBTI Integration</CardTitle>
              </CardHeader>
              <CardContent data-testid="text-feature-mbti-content">
                Tailored guidance based on your personality type and emotional patterns for deeper self-understanding.
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-growth">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" data-testid="icon-heart" />
                <CardTitle data-testid="text-feature-growth-title">Emotional Growth</CardTitle>
              </CardHeader>
              <CardContent data-testid="text-feature-growth-content">
                Track your emotional journey with progress insights and personalized recommendations for growth.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center" data-testid="section-cta">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4" data-testid="cta-title">Ready to Begin?</h2>
          <p className="text-muted-foreground mb-8" data-testid="cta-description">
            Join thousands discovering their emotional intelligence through AI-powered journaling
          </p>
          <Button size="lg" onClick={handleLogin} className="text-lg px-8 py-6" data-testid="button-cta-start">
            Start Your Journey Today
          </Button>
        </div>
      </section>
    </div>
  );
}