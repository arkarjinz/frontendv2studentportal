// NAVIGATION
'use client';
export const NAV_LINKS = [
    { href: '/clubs', key: 'clubs', label: 'Clubs' },
    { href: '/gift' , key: 'gift', label: 'Gift'} ,
    {  href: '/posts' , key: 'posts', label: 'Posts'} ,
    { href: '/lost-and-found' , key: 'lost_and_found', label: 'Lost and Found'},
    { href: '/userprofile', key: 'Profile', label: 'Profile' },
    { href: '/idea', key: 'idea', label: 'Idea' },
    { href: '/marketplace', key: 'market', label: 'Marketplace' },






];

// FEATURES SECTION
export const FEATURES = [
    {
        title: 'Connect with others',
        icon: '/micon.svg',
        variant: 'green',
        description:
            'Engage with fellow students to share your experiences, insights, and knowledge. Explore diverse ideas, stories, and perspectives while enjoying fun and entertaining activities that bring the community closer together',
    },
    {
        title: 'Lost and Found',
        icon: '/lostafound.svg',
        variant: 'green',
        description:
            'Effortlessly recover lost items through our dedicated website. If you identify your belongings listed, submit a formal request to the university administration via the platform and provide proof of ownership. The process is efficient, secure, and user-friendly',
    },
    {
        title: 'Browse Clubs',
        icon: '/sport.svg',
        variant: 'green',
        description:
            'Discover and join exciting clubs that match your interests, passions, and hobbies. From sports and arts to academic and cultural groups, there\'s something for everyone!',
    },
    {
        title: 'Gift Flower System',
        icon: '/flower.svg',
        variant: 'orange',
        description:
            'Brighten someone\'s day with our thoughtful flower gifting system. Send beautiful bouquets to express your appreciation, celebrate milestones, or simply spread joy!',
    },
    {
        title : 'Anonymous Voting',
        icon : 'vote.svg',
        variant: 'orange',
        description: 'Vote anonymously for your teachers based on your current semester, helping to ensure quality education and fair feedback within the community'
    },
    {
        title : 'Subscription (Upcoming Feature)',
        icon : 'diamond.svg',
        variant: 'orange',
        description: 'Coming soon! Unlock exclusive features and premium content with our flexible subscription plans, available on a weekly or monthly basis. Cancel anytime and receive a 30% refund as part of our commitment to your satisfaction'
    }
];

// FOOTER SECTION
export const FOOTER_LINKS = [
    {
        title: "Learn More",
        links: [
            "About UnityVerse",
            "Press Releases",
            "Environment",
            "Jobs",
            "Privacy Policy",
            "Contact Us",
        ],
    },
    {
        title: "Our Community",
        links: ["Universe", "Borahae", "Bullet Proof"],
    },
];

export const FOOTER_CONTACT_INFO =
    {
    title: 'Contact Us',
    links: [
        { label: 'Admin Officer', value: '123-456-7890' },
        { label: 'Email Officer', value: 'unityverse@edu.com' },
    ],
}


export const SOCIALS =
    {
    title: 'Social',
    links: [
        { icon: '/facebook.svg', url: 'https://facebook.com' },
        { icon: '/instagram.svg', url: 'https://instagram.com' },
        { icon: '/twitter.svg', url: 'https://twitter.com' },
        { icon: '/youtube.svg', url: 'https://youtube.com' },
        { icon: '/wordpress.svg', url: 'https://wordpress.com' },
    ],
}
