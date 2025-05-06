
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  ChevronDown,
  PlusCircle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// Mock data for admin dashboard
const mockArticles = [
  {
    id: "1",
    title: "Federal Reserve Signals Possible Interest Rate Cuts in Coming Months",
    status: "published",
    author: "Michael Stevens",
    publishedDate: "2025-05-05T14:30:00Z",
    category: "Economy",
    commentsCount: 2
  },
  {
    id: "2",
    title: "Global Markets Rally as Trade Tensions Ease Between Major Economies",
    status: "published",
    author: "Sarah Johnson",
    publishedDate: "2025-05-04T10:15:00Z",
    category: "Markets",
    commentsCount: 1
  },
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary AI-Powered Financial Analysis Platform",
    status: "published",
    author: "David Wong",
    publishedDate: "2025-05-03T16:45:00Z",
    category: "Technology",
    commentsCount: 0
  },
  {
    id: "10",
    title: "Emerging Markets Face Currency Pressures Amid Changing Global Rates",
    status: "draft",
    author: "Michael Stevens",
    publishedDate: "2025-05-06T09:15:00Z",
    category: "Markets",
    commentsCount: 0
  },
  {
    id: "11",
    title: "New Regulatory Framework for Fintech Companies Expected Next Month",
    status: "scheduled",
    author: "Sarah Johnson",
    publishedDate: "2025-05-15T08:00:00Z",
    category: "Regulation",
    commentsCount: 0
  }
];

const mockUsers = [
  {
    id: "u1",
    name: "Robert Chen",
    email: "robert.chen@example.com",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=robert",
    registeredDate: "2024-12-15T14:30:00Z"
  },
  {
    id: "u2",
    name: "Emily Watson",
    email: "emily.watson@example.com",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=emily",
    registeredDate: "2025-01-05T10:15:00Z"
  },
  {
    id: "u3",
    name: "Mark Thompson",
    email: "mark.thompson@example.com",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=mark",
    registeredDate: "2025-01-20T16:45:00Z"
  },
  {
    id: "u4",
    name: "Linda Martinez",
    email: "linda.martinez@example.com",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=linda",
    registeredDate: "2025-02-10T09:15:00Z"
  },
  {
    id: "u5",
    name: "James Wilson",
    email: "james.wilson@example.com",
    status: "banned",
    avatar: "https://i.pravatar.cc/150?u=james",
    registeredDate: "2025-03-15T08:00:00Z"
  }
];

const mockStats = {
  articles: {
    total: 54,
    published: 42,
    draft: 8,
    scheduled: 4
  },
  users: {
    total: 1250,
    active: 1240,
    banned: 10
  },
  comments: {
    total: 1876,
    pending: 28,
    approved: 1812,
    rejected: 36
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleNewArticle = () => {
    toast({
      title: "Create Article",
      description: "The article editor will be available in the next version.",
    });
  };
  
  const handleDeleteArticle = (id: string) => {
    toast({
      title: "Article Deleted",
      description: `Article ID: ${id} has been deleted.`,
    });
  };
  
  const handleEditArticle = (id: string) => {
    toast({
      title: "Edit Article",
      description: "The article editor will be available in the next version.",
    });
  };
  
  const handleChangeArticleStatus = (id: string, status: string) => {
    toast({
      title: "Status Updated",
      description: `Article status changed to ${status}.`,
    });
  };
  
  const handleChangeUserStatus = (id: string, status: string) => {
    toast({
      title: "User Status Updated",
      description: `User status changed to ${status}.`,
    });
  };
  
  const handleDeleteUser = (id: string) => {
    toast({
      title: "User Deleted",
      description: `User ID: ${id} has been deleted.`,
    });
  };
  
  const handleLogout = () => {
    navigate("/");
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "paused":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "banned":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-finance-900 text-white min-h-screen">
          <div className="p-4 border-b border-finance-800">
            <div className="flex items-center">
              <span className="text-xl font-bold">Finance</span>
              <span className="text-xl font-normal text-gold-500">News</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">Admin Dashboard</p>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-white hover:bg-finance-800 ${activeTab === "overview" ? "bg-finance-800" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Overview
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-white hover:bg-finance-800 ${activeTab === "articles" ? "bg-finance-800" : ""}`}
                  onClick={() => setActiveTab("articles")}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Articles
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-white hover:bg-finance-800 ${activeTab === "users" ? "bg-finance-800" : ""}`}
                  onClick={() => setActiveTab("users")}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Users
                </Button>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-finance-800">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-finance-800"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Top Navigation */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <h1 className="text-lg font-medium">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "articles" && "Article Management"}
                  {activeTab === "users" && "User Management"}
                </h1>
                
                <div className="flex items-center">
                  <Button 
                    onClick={handleNewArticle}
                    className="md:hidden"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    New Article
                  </Button>
                  
                  {/* Mobile Navigation */}
                  <div className="md:hidden ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center">
                          Menu
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setActiveTab("overview")}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Overview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveTab("articles")}>
                          <FileText className="mr-2 h-4 w-4" />
                          Articles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveTab("users")}>
                          <Users className="mr-2 h-4 w-4" />
                          Users
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Articles</CardTitle>
                      <CardDescription>Content statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.articles.total}</div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Published</div>
                          <div className="text-xl font-medium">{mockStats.articles.published}</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Draft</div>
                          <div className="text-xl font-medium">{mockStats.articles.draft}</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Scheduled</div>
                          <div className="text-xl font-medium">{mockStats.articles.scheduled}</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="text-finance-700 hover:text-finance-900 p-0"
                        onClick={() => setActiveTab("articles")}
                      >
                        View all articles
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Users</CardTitle>
                      <CardDescription>User statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.users.total}</div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Active</div>
                          <div className="text-xl font-medium">{mockStats.users.active}</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Banned</div>
                          <div className="text-xl font-medium">{mockStats.users.banned}</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="text-finance-700 hover:text-finance-900 p-0"
                        onClick={() => setActiveTab("users")}
                      >
                        View all users
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Comments</CardTitle>
                      <CardDescription>Comment statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{mockStats.comments.total}</div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Approved</div>
                          <div className="text-xl font-medium">{mockStats.comments.approved}</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Pending</div>
                          <div className="text-xl font-medium">{mockStats.comments.pending}</div>
                        </div>
                        <div className="bg-red-50 p-2 rounded">
                          <div className="text-sm text-gray-500">Rejected</div>
                          <div className="text-xl font-medium">{mockStats.comments.rejected}</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="text-finance-700 hover:text-finance-900 p-0"
                      >
                        View all comments
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Articles</CardTitle>
                    <CardDescription>Latest content published on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Published</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockArticles.slice(0, 5).map(article => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">
                              <Link to={`/news/${article.id}`} className="hover:text-finance-700">
                                {article.title}
                              </Link>
                            </TableCell>
                            <TableCell>{article.category}</TableCell>
                            <TableCell>{article.author}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(article.status)}>
                                {article.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(article.publishedDate), { addSuffix: true })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="ghost" 
                      className="text-finance-700 hover:text-finance-900 p-0"
                      onClick={() => setActiveTab("articles")}
                    >
                      View all articles
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="articles">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Articles</h2>
                  <Button onClick={handleNewArticle}>
                    <PlusCircle className="h-5 w-5 mr-2" />
                    New Article
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead>Comments</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockArticles.map(article => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">
                              <Link to={`/news/${article.id}`} className="hover:text-finance-700">
                                {article.title}
                              </Link>
                            </TableCell>
                            <TableCell>{article.category}</TableCell>
                            <TableCell>{article.author}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(article.status)}>
                                {article.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(article.publishedDate), { addSuffix: true })}
                            </TableCell>
                            <TableCell>{article.commentsCount}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditArticle(article.id)}>
                                    Edit
                                  </DropdownMenuItem>
                                  {article.status !== "published" && (
                                    <DropdownMenuItem onClick={() => handleChangeArticleStatus(article.id, "published")}>
                                      Publish
                                    </DropdownMenuItem>
                                  )}
                                  {article.status === "published" && (
                                    <DropdownMenuItem onClick={() => handleChangeArticleStatus(article.id, "paused")}>
                                      Pause
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleDeleteArticle(article.id)} className="text-red-600">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Users</h2>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="mr-2 h-8 w-8">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{user.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(user.registeredDate), { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  {user.status === "active" ? (
                                    <DropdownMenuItem onClick={() => handleChangeUserStatus(user.id, "banned")}>
                                      Ban User
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleChangeUserStatus(user.id, "active")}>
                                      Activate User
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
