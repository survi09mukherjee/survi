import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubjectCard } from '@/components/SubjectCard';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Search, Filter, Play, MessageCircle } from 'lucide-react';
import { SUBJECTS } from '@/data/subjects';
import { LANGUAGES } from '@/data/languages';

export default function LessonLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const mockLessons = [
    {
      id: '1',
      title: 'The Water Cycle',
      subject: 'Science',
      language: 'Tamil',
      languageCode: 'ta',
      duration: '5:30',
      type: 'video' as const,
      character: '☁️',
      thumbnail: '🌊',
      difficulty: 'easy' as const
    },
    {
      id: '2',
      title: 'Adding Fractions',
      subject: 'Mathematics',
      language: 'Hindi',
      languageCode: 'hi',
      duration: '8:15',
      type: 'video' as const,
      character: '🔢',
      thumbnail: '➗',
      difficulty: 'medium' as const
    },
    {
      id: '3',
      title: 'Parts of Speech',
      subject: 'English',
      language: 'English',
      languageCode: 'en',
      duration: '6:45',
      type: 'voice' as const,
      character: '📚',
      thumbnail: '📖',
      difficulty: 'easy' as const
    },
  ];

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || lesson.languageCode === selectedLanguage;
    const matchesSubject = !selectedSubject || lesson.subject === selectedSubject;
    return matchesSearch && matchesLanguage && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ChevronLeft />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Lesson Library</h1>
                <p className="text-sm text-muted-foreground">Explore lessons in any language</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/language-hub')}>
              🌐 Language Hub
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedSubject ? (
          /* Subject Selection View */
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Choose a Subject</h2>
              <p className="text-muted-foreground">Select a subject to explore lessons</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUBJECTS.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  lessonsCount={Math.floor(Math.random() * 20) + 10}
                  onClick={() => setSelectedSubject(subject.name)}
                />
              ))}
            </div>
          </>
        ) : (
          /* Lessons View */
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubject(null)}
                  className="mb-2"
                >
                  ← Back to Subjects
                </Button>
                <h2 className="text-2xl font-bold">{selectedSubject} Lessons</h2>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedLanguage === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage('all')}
                >
                  All Languages
                </Button>
                {LANGUAGES.slice(0, 5).map((lang) => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang.code)}
                  >
                    {lang.flag} {lang.name}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Lessons</TabsTrigger>
                <TabsTrigger value="video">🎬 Video</TabsTrigger>
                <TabsTrigger value="voice">🎙️ Voice Chat</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {filteredLessons.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No lessons found matching your criteria</p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLessons.map((lesson) => (
                      <Card
                        key={lesson.id}
                        className="overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
                        onClick={() => {
                          if (lesson.type === 'video') {
                            navigate('/video-lesson');
                          } else {
                            navigate('/chat');
                          }
                        }}
                      >
                        {/* Thumbnail */}
                        <div className="relative bg-gradient-hero aspect-video flex items-center justify-center">
                          <div className="text-6xl">{lesson.thumbnail}</div>
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                            {lesson.duration}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            {lesson.type === 'video' ? (
                              <Play className="w-12 h-12 text-white" />
                            ) : (
                              <MessageCircle className="w-12 h-12 text-white" />
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="text-3xl">{lesson.character}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{lesson.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                Taught in {lesson.language}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {lesson.type === 'video' ? '🎬 Video' : '🎙️ Voice'}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                lesson.difficulty === 'easy' ? 'border-green-500 text-green-600' :
                                lesson.difficulty === 'medium' ? 'border-yellow-500 text-yellow-600' :
                                'border-red-500 text-red-600'
                              }`}
                            >
                              {lesson.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="video">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLessons.filter(l => l.type === 'video').map((lesson) => (
                    <Card key={lesson.id} className="p-4">
                      <p className="text-sm">Video lessons coming here...</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="voice">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredLessons.filter(l => l.type === 'voice').map((lesson) => (
                    <Card key={lesson.id} className="p-4">
                      <p className="text-sm">Voice lessons coming here...</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
}
