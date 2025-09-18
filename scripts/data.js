// Utility function to shuffle array randomly
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Utility function to sort events by date (most recent first)
function sortEventsByDate(events) {
    return [...events].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // Ascending order (earliest first)
    });
}

// Events data - will be sorted by date
const eventsData = [
    {
        name: "Lorem Ipsum Developer Meetup",
        organizer: "Lorem Ipsum Game Developers",
        date: "2025-10-15",
        time: "6:00 PM",
        location: "Lorem Building, Durham",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        url: "https://www.example.com/lorem-meetup"
    },
    {
        name: "Consectetur Adipiscing Showcase",
        organizer: "Lorem Development Association",
        date: "2025-11-20",
        time: "7:00 PM",
        location: "Ipsum Center, Raleigh",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        url: "https://www.example.com/consectetur-showcase"
    },
    {
        name: "Dolor Sit Amet Weekend",
        organizer: "Lorem University Club",
        date: "2025-12-05",
        time: "9:00 AM",
        location: "Lorem University, Raleigh",
        description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        url: "https://www.example.com/dolor-weekend"
    }
];

// Companies with presence in Triangle area - will be randomized
const companiesData = [
    {
        name: "Epic Games",
        logo: "https://cdn.epicgames.com/static/favicon.ico",
        locationType: "Headquarters",
        url: "https://www.epicgames.com"
    },
    {
        name: "Red Storm Entertainment",
        logo: "https://www.ubisoft.com/favicon.ico",
        locationType: "Office",
        url: "https://www.redstorm.com"
    },
    {
        name: "Insomniac Games",
        logo: "https://insomniac.games/favicon.ico",
        locationType: "Office",
        url: "https://insomniac.games"
    },
    {
        name: "Boss Fight Entertainment",
        logo: "https://www.bossfight.co/favicon.ico",
        locationType: "Office",
        url: "https://www.bossfight.co"
    },
    {
        name: "Virtual Heroes",
        logo: "https://www.virtualheroes.com/favicon.ico",
        locationType: "Office",
        url: "https://www.virtualheroes.com"
    },
    {
        name: "Mighty Rabbit Studios",
        logo: "https://www.mightyrabbit.com/favicon.ico",
        locationType: "Office",
        url: "https://www.mightyrabbit.com"
    },
    {
        name: "Unity Technologies",
        logo: "https://unity.com/favicon.ico",
        locationType: "Remote Staff",
        url: "https://unity.com"
    },
    {
        name: "Niantic",
        logo: "https://nianticlabs.com/favicon.ico",
        locationType: "Remote Staff",
        url: "https://nianticlabs.com"
    },
    {
        name: "Riot Games",
        logo: "https://www.riotgames.com/favicon.ico",
        locationType: "Remote Staff",
        url: "https://www.riotgames.com"
    },
    {
        name: "2K Games",
        logo: "https://2k.com/favicon.ico",
        locationType: "Remote Staff",
        url: "https://2k.com"
    },
    {
        name: "Blizzard Entertainment",
        logo: "https://www.blizzard.com/favicon.ico",
        locationType: "Remote Staff",
        url: "https://www.blizzard.com"
    }
];

// Groups and meetups - will be randomized
const groupsData = [
    {
        name: "TASC",
        description: "The Triangle Area Supper Club (TASC) is an invite-only gathering for executives and senior leadership. Its mission is to foster authentic dialogue, reflection, and connection over a shared table.",
        location: "Triangle Area",
        type: "Executive Network",
        url: "https://tasc.games",
        logo: "images/groups/tasc.svg"
    },
    {
        name: "Triangle Interactive",
        description: "The Triangle Interactive Arts Collective (TIAC) is a nonprofit creating a supportive community for local game developers. The TIAC hosts events, and runs a shared office space for game creators.",
        location: "Central North Carolina",
        type: "Nonprofit Organization",
        url: "https://triangleinteractivearts.org",
        logo: "images/groups/tiac.png"
    },
    {
        name: "Raleigh Unreal Engine Meetup",
        description: "In Epic Games' own backyard, the Raleigh Unreal Engine Developers group connects local developers through casual gatherings, workshops and event participation. All are welcome!",
        location: "Raleigh",
        type: "Developer Meetup",
        url: "https://communities.unrealengine.com/raleigh/",
        logo: "images/groups/RaleighUnrealMeetup.png"
    }
];

// Schools and university programs - will be randomized
const schoolsData = [
    {
        name: "Wake Technical Community College – Simulation and Game Design",
        description: "Associate degree program focusing on game design, programming, and interactive media development.",
        location: "Wake Technical Community College",
        type: "Community College Program",
        url: "https://www.waketech.edu/programs-courses/credit/simulation-game-design"
    }
];

// Generate randomized/sorted data for page load
const events = sortEventsByDate(eventsData);
const companies = shuffleArray(companiesData);
const groups = shuffleArray(groupsData);
const schools = shuffleArray(schoolsData);
