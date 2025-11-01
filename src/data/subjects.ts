export interface Grade {
  id: string;
  label: string;
  ageRange: string;
}

export interface Board {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  boards?: string[];
}

export const GRADES: Grade[] = [
  { id: 'toddler', label: 'Toddlers (2-4)', ageRange: '2-4 years' },
  { id: 'nursery', label: 'Nursery', ageRange: '4-5 years' },
  { id: 'lkg', label: 'LKG', ageRange: '5-6 years' },
  { id: 'ukg', label: 'UKG', ageRange: '6-7 years' },
  { id: 'class-1', label: 'Class 1', ageRange: '6-7 years' },
  { id: 'class-2', label: 'Class 2', ageRange: '7-8 years' },
  { id: 'class-3', label: 'Class 3', ageRange: '8-9 years' },
  { id: 'class-4', label: 'Class 4', ageRange: '9-10 years' },
  { id: 'class-5', label: 'Class 5', ageRange: '10-11 years' },
  { id: 'class-6', label: 'Class 6', ageRange: '11-12 years' },
  { id: 'class-7', label: 'Class 7', ageRange: '12-13 years' },
  { id: 'class-8', label: 'Class 8', ageRange: '13-14 years' },
  { id: 'class-9', label: 'Class 9', ageRange: '14-15 years' },
  { id: 'class-10', label: 'Class 10', ageRange: '15-16 years' },
  { id: 'class-11', label: 'Class 11', ageRange: '16-17 years' },
  { id: 'class-12', label: 'Class 12', ageRange: '17-18 years' },
];

export const BOARDS: Board[] = [
  { id: 'cbse', name: 'Central Board of Secondary Education', abbreviation: 'CBSE' },
  { id: 'icse', name: 'Indian Certificate of Secondary Education', abbreviation: 'ICSE' },
  { id: 'ap', name: 'Andhra Pradesh Board', abbreviation: 'AP Board' },
  { id: 'ts', name: 'Telangana Board', abbreviation: 'TS Board' },
  { id: 'tn', name: 'Tamil Nadu Board', abbreviation: 'TN Board' },
  { id: 'kerala', name: 'Kerala Board', abbreviation: 'Kerala Board' },
  { id: 'karnataka', name: 'Karnataka Board', abbreviation: 'Karnataka Board' },
  { id: 'maharashtra', name: 'Maharashtra Board', abbreviation: 'Maharashtra Board' },
  { id: 'wb', name: 'West Bengal Board', abbreviation: 'WB Board' },
  { id: 'up', name: 'Uttar Pradesh Board', abbreviation: 'UP Board' },
  { id: 'bihar', name: 'Bihar Board', abbreviation: 'Bihar Board' },
  { id: 'rajasthan', name: 'Rajasthan Board', abbreviation: 'Rajasthan Board' },
  { id: 'mp', name: 'Madhya Pradesh Board', abbreviation: 'MP Board' },
  { id: 'gujarat', name: 'Gujarat Board', abbreviation: 'Gujarat Board' },
  { id: 'punjab', name: 'Punjab Board', abbreviation: 'Punjab Board' },
  { id: 'haryana', name: 'Haryana Board', abbreviation: 'Haryana Board' },
  { id: 'jharkhand', name: 'Jharkhand Board', abbreviation: 'Jharkhand Board' },
  { id: 'odisha', name: 'Odisha Board', abbreviation: 'Odisha Board' },
  { id: 'assam', name: 'Assam Board', abbreviation: 'Assam Board' },
  { id: 'hp', name: 'Himachal Pradesh Board', abbreviation: 'HP Board' },
  { id: 'uttarakhand', name: 'Uttarakhand Board', abbreviation: 'Uttarakhand Board' },
];

export const SUBJECTS: Subject[] = [
  { 
    id: 'mathematics', 
    name: 'Mathematics', 
    icon: '🔢', 
    color: 'bg-blue-500', 
    description: 'Numbers, algebra, geometry',
    boards: ['cbse', 'icse', 'ap', 'ts', 'tn', 'kerala', 'karnataka', 'maharashtra', 'wb', 'up', 'bihar', 'rajasthan', 'mp', 'gujarat', 'punjab', 'haryana']
  },
  { 
    id: 'science', 
    name: 'Science', 
    icon: '🔬', 
    color: 'bg-green-500', 
    description: 'Physics, chemistry, biology',
    boards: ['cbse', 'icse', 'ap', 'ts', 'tn', 'kerala', 'karnataka', 'maharashtra', 'wb', 'up', 'bihar', 'rajasthan', 'mp', 'gujarat', 'punjab', 'haryana']
  },
  { 
    id: 'english', 
    name: 'English', 
    icon: '📚', 
    color: 'bg-purple-500', 
    description: 'Grammar, literature, writing',
    boards: ['cbse', 'icse', 'ap', 'ts', 'tn', 'kerala', 'karnataka', 'maharashtra', 'wb', 'up', 'bihar', 'rajasthan', 'mp', 'gujarat', 'punjab', 'haryana']
  },
  { 
    id: 'hindi', 
    name: 'Hindi', 
    icon: '🇮🇳', 
    color: 'bg-orange-500', 
    description: 'व्याकरण, साहित्य, लेखन',
    boards: ['cbse', 'up', 'bihar', 'rajasthan', 'mp', 'haryana']
  },
  { 
    id: 'social-studies', 
    name: 'Social Studies', 
    icon: '🌍', 
    color: 'bg-yellow-600', 
    description: 'History, geography, civics',
    boards: ['cbse', 'icse', 'ap', 'ts', 'tn', 'kerala', 'karnataka', 'maharashtra', 'wb', 'up', 'bihar', 'rajasthan', 'mp', 'gujarat', 'punjab', 'haryana']
  },
  { 
    id: 'computer', 
    name: 'Computer Science', 
    icon: '💻', 
    color: 'bg-indigo-500', 
    description: 'Coding, technology, digital skills',
    boards: ['cbse', 'icse', 'maharashtra', 'karnataka']
  },
  { 
    id: 'evs', 
    name: 'Environmental Studies', 
    icon: '🌱', 
    color: 'bg-lime-500', 
    description: 'Nature, environment, sustainability',
    boards: ['cbse', 'icse']
  },
  { 
    id: 'regional', 
    name: 'Regional Languages', 
    icon: '🗣️', 
    color: 'bg-rose-500', 
    description: 'Tamil, Telugu, Bengali, Marathi and more',
    boards: ['ap', 'ts', 'tn', 'kerala', 'karnataka', 'maharashtra', 'wb', 'odisha', 'assam', 'punjab']
  },
  { 
    id: 'arts', 
    name: 'Arts & Crafts', 
    icon: '🎨', 
    color: 'bg-pink-500', 
    description: 'Drawing, painting, creativity',
    boards: ['cbse', 'icse']
  },
  { 
    id: 'music', 
    name: 'Music', 
    icon: '🎵', 
    color: 'bg-red-500', 
    description: 'Songs, rhythms, instruments',
    boards: ['cbse', 'icse']
  },
];
