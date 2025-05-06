
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommentSection, { Comment } from "@/components/CommentSection";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";

// Mock news data - in a real app, this would come from an API
const mockNewsDetails = {
  "1": {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    summary: "Central bank officials indicate a shift in monetary policy as inflation eases and economic growth stabilizes. Markets respond positively to the news with stocks rallying.",
    content: `
      <p>Federal Reserve officials have signaled a potential shift in monetary policy, indicating that interest rate cuts may be on the horizon in the coming months. This development comes as inflation data shows consistent signs of easing and economic growth metrics demonstrate stabilization across key sectors.</p>
      
      <p>During the latest Federal Open Market Committee (FOMC) meeting, policymakers discussed the possibility of transitioning away from the restrictive stance that has characterized monetary policy over the past two years. Minutes from the meeting revealed growing confidence among committee members that inflation is on a sustainable path back to the target 2% level.</p>
      
      <h3>Market Reaction</h3>
      
      <p>Financial markets responded enthusiastically to the news, with major U.S. stock indices recording significant gains. The S&P 500 climbed 1.8%, while the tech-heavy Nasdaq Composite surged by 2.3%. Bond markets also rallied, with yields on 10-year Treasury notes declining by 15 basis points, reflecting investors' expectations of lower interest rates.</p>
      
      <p>Economists at major financial institutions have adjusted their forecasts in response to the Fed's communication. "We now anticipate the first rate cut to occur in September, followed by additional reductions in the fourth quarter," said Amanda Richards, chief economist at Global Investment Partners. "This represents a more accelerated timeline than our previous projections."</p>
      
      <h3>Economic Indicators</h3>
      
      <p>Recent economic data has supported the case for monetary easing. The Consumer Price Index has shown three consecutive months of moderation, with the core measure now at 2.8% year-over-year, down from a peak of 6.6% in 2022. Meanwhile, employment growth has remained robust but not overheated, suggesting a balanced labor market that may not require such restrictive policy measures.</p>
      
      <p>Manufacturing activity has shown signs of recovery after a prolonged period of contraction, with the ISM Manufacturing Index returning to expansion territory for the first time in 18 months. Consumer spending has demonstrated resilience despite higher interest rates, though there are indications that rate-sensitive sectors like housing and auto sales would benefit from lower borrowing costs.</p>
      
      <h3>Global Context</h3>
      
      <p>The Fed's pivot comes as central banks worldwide reassess their monetary stances. The European Central Bank began its easing cycle last month, while the Bank of Canada has already implemented two rate cuts this year. Coordinated easing among major central banks could help prevent disruptive currency fluctuations while supporting global economic growth.</p>
      
      <p>Challenges remain, however. Some FOMC members expressed concerns about easing too quickly and potentially reigniting inflation pressures. The committee emphasized that future policy decisions would remain data-dependent, with particular focus on employment figures, inflation readings, and broader economic activity measures.</p>
      
      <p>Financial analysts suggest that investors should prepare for increased market volatility as each new economic data release could significantly impact expectations for the timing and magnitude of rate cuts.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
    category: "Economy",
    publishedDate: "2025-05-05T14:30:00Z",
    author: "Michael Stevens",
    authorTitle: "Senior Economics Correspondent"
  },
  "2": {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    summary: "Asian and European markets see significant gains following announcement of new trade agreements. Technology and manufacturing sectors lead the surge.",
    content: `
      <p>Global financial markets experienced substantial gains today following announcements that longstanding trade tensions between several major economies are easing. The positive developments came after trade representatives from the United States, China, and European Union revealed a framework for resolving key disputes that have hampered international commerce for years.</p>
      
      <p>The announcement, which emerged from high-level talks in Geneva, outlines a phased approach to removing recently imposed tariffs and establishing more predictable trading protocols. The agreement specifically addresses concerns about intellectual property protections, market access, and industrial subsidies that have been points of contention in recent years.</p>
      
      <h3>Market Performance</h3>
      
      <p>Asian markets led the global rally, with Japan's Nikkei 225 surging 3.2% and Hong Kong's Hang Seng Index climbing 3.7%. Mainland China's Shanghai Composite rose 2.8%, its best daily performance in over six months. The positive sentiment carried into European trading hours, with the pan-European Stoxx 600 rising 2.1% and Germany's DAX adding 2.4%.</p>
      
      <p>U.S. futures indicated a strong opening on Wall Street, with contracts tied to the S&P 500 up 1.8% ahead of the trading session. Technology and manufacturing stocks, which have been particularly vulnerable to trade uncertainty, showed the strongest pre-market gains.</p>
      
      <h3>Sector Winners</h3>
      
      <p>The technology sector emerged as a primary beneficiary of improved trade relations. Semiconductor manufacturers, whose global supply chains have been significantly disrupted by trade restrictions, saw their shares surge. Advanced chip makers recorded gains between 4% and 6% across various markets.</p>
      
      <p>Manufacturing companies also rallied, particularly those with substantial international operations. Automotive stocks in Europe rose an average of 3.2%, while industrial equipment manufacturers in Japan saw gains exceeding 4%.</p>
      
      <h3>Economic Implications</h3>
      
      <p>Economists are revising growth forecasts upward in light of the developments. "The removal of trade barriers could add approximately 0.3 percentage points to global GDP growth over the next year," said Dr. Elena Cortez, international economics professor at Columbia University. "More importantly, it reduces a significant source of uncertainty that has been constraining business investment."</p>
      
      <p>Corporate leaders have responded positively to the news. "This creates a much more predictable environment for making long-term investments in our global operations," said Thomas Chen, CEO of Pacific Tech Industries. "We can now move forward with expansion plans that had been on hold due to trade uncertainty."</p>
      
      <h3>Remaining Challenges</h3>
      
      <p>Despite the broad optimism, analysts caution that implementation details remain to be worked out. The framework agreement establishes principles and timelines but leaves specifics to be negotiated over the coming months. Potential stumbling blocks include verification mechanisms for compliance and procedures for addressing future disputes.</p>
      
      <p>Currency markets have shown more muted reactions, with traders waiting for clarity on how the trade agreements might influence monetary policy decisions in different regions. Bond markets saw modest selling as investors moved away from safe-haven assets, with yields on 10-year treasuries rising slightly.</p>
      
      <p>Market strategists suggest that while the immediate reaction has been strongly positive, investors should monitor developments closely as the detailed negotiations progress in the coming weeks.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
    category: "Markets",
    publishedDate: "2025-05-04T10:15:00Z",
    author: "Sarah Johnson",
    authorTitle: "Global Markets Analyst"
  }
};

// Mock comments data
const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      content: "This shift in monetary policy seems inevitable given the recent inflation data. I wonder how this will affect mortgage rates in the coming months.",
      author: {
        id: "u1",
        name: "Robert Chen",
        avatar: "https://i.pravatar.cc/150?u=robert"
      },
      likes: 5,
      createdAt: "2025-05-05T16:30:00Z",
      replies: [
        {
          id: "c1r1",
          content: "Mortgage rates typically follow the 10-year Treasury yield more than the Fed funds rate, but yes, we should see some downward pressure on rates if this trend continues.",
          author: {
            id: "u2",
            name: "Emily Watson",
            avatar: "https://i.pravatar.cc/150?u=emily"
          },
          likes: 3,
          createdAt: "2025-05-05T17:15:00Z"
        }
      ]
    },
    {
      id: "c2",
      content: "The Fed has been extremely cautious in their communications lately. I think they're setting expectations for cuts while giving themselves plenty of room to maneuver if inflation spikes again.",
      author: {
        id: "u3",
        name: "Mark Thompson",
        avatar: "https://i.pravatar.cc/150?u=mark"
      },
      likes: 8,
      createdAt: "2025-05-05T18:45:00Z"
    }
  ],
  "2": [
    {
      id: "c3",
      content: "Finally some good news on the trade front! My manufacturing business has been dealing with so much uncertainty over the past few years.",
      author: {
        id: "u4",
        name: "Linda Martinez",
        avatar: "https://i.pravatar.cc/150?u=linda"
      },
      likes: 12,
      createdAt: "2025-05-04T14:20:00Z"
    }
  ]
};

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<typeof mockNewsDetails[keyof typeof mockNewsDetails] | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    if (id && mockNewsDetails[id]) {
      setNews(mockNewsDetails[id]);
      setComments(mockComments[id] || []);
    } else {
      // Handle news not found
      navigate("/not-found", { replace: true });
    }
    
    setLoading(false);
  }, [id, navigate]);
  
  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };
  
  const handleLogout = () => {
    setUser(null);
  };
  
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setUser({ id: "user-1", name: "John Doe" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 mb-4 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow">
        <article className="container mx-auto px-4 py-8 max-w-5xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 flex items-center text-gray-600 hover:text-finance-700"
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </Button>
          
          <Badge className="mb-4">{news.category}</Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>
          
          <div className="flex items-center text-gray-500 mb-6">
            <div className="mr-4">
              By <span className="font-medium text-gray-700">{news.author}</span>
              {news.authorTitle && (
                <span className="text-gray-500 text-sm ml-1">
                  , {news.authorTitle}
                </span>
              )}
            </div>
            <div>
              {format(new Date(news.publishedDate), "MMMM d, yyyy")}
            </div>
          </div>
          
          <div className="mb-8">
            <img 
              src={news.imageUrl} 
              alt={news.title} 
              className="w-full h-auto rounded-lg" 
            />
          </div>
          
          <div 
            className="news-content mb-10"
            dangerouslySetInnerHTML={{ __html: news.content }} 
          />
          
          <div className="border-t border-gray-200 pt-10">
            <CommentSection 
              newsId={news.id} 
              comments={comments}
              currentUser={user}
              onLogin={handleLogin}
            />
          </div>
        </article>
      </main>
      
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default NewsDetail;
