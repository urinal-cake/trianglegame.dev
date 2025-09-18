// Utility function to shuffle array randomly
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Utility function to parse dates as local instead of UTC
function parseLocalDate(dateString) {
    // Parse YYYY-MM-DD as local date instead of UTC
    // This prevents timezone conversion issues
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
}

// Utility function to sort events by date (most recent first)
function sortEventsByDate(events) {
    return [...events].sort((a, b) => {
        const dateA = parseLocalDate(a.date);
        const dateB = parseLocalDate(b.date);
        return dateA - dateB; // Ascending order (earliest first)
    });
}

// Events data - will be sorted by date
const eventsData = [
    {
        name: "Playtest Night",
        organizer: "Triangle Interactive Arts Collective",
        date: "2025-09-19",
        time: "5:30 PM - 9:00 PM",
        location: "800 Park Offices Drive, Suite 1011",
        description: "Come out and playtest some games from local independent developers, or bring your project and show it to our open & supportive community!",
        url: "https://triangleinteractivearts.org"
    },
    {
        name: "Raleigh Unreal Engine Meetup",
        organizer: "Raleigh Unreal Engine Meetup",
        date: "2025-09-24",
        time: "7:00 PM - 10:00 PM",
        location: "1006 SW Maynard Rd, Cary, NC 27511",
        description: "Hey all! We will be located at Fortnite Brewing in Cary for our monthly meetup! Feel free to bring any projects you are working on if you're interested in showing something, otherwise no need to bring anything!!",
        url: "https://communities.unrealengine.com/events/details/epic-games-raleigh-presents-raleigh-unreal-engine-meetup-2025-09-24/"
    },
    {
        name: "Weekly Hangout",
        organizer: "Triangle Interactive Arts Collective",
        date: "2025-09-25",
        time: "5:00 PM - 7:00 PM",
        location: "800 Park Offices Drive, Suite 1011",
        description: "Every Thursday we get together for our weekly hangout at our community office! We share our projects with each other, and play games! Enter through the front door, through the noisy lobby and straight ahead to the elevators. Our community office (1011) is on the right side of the elevators.",
        url: "https://triangleinteractivearts.org"
    },
    {
        name: "Weekly Hangout",
        organizer: "Triangle Interactive Arts Collective",
        date: "2025-10-02",
        time: "5:00 PM - 7:00 PM",
        location: "800 Park Offices Drive, Suite 1011",
        description: "Every Thursday we get together for our weekly hangout at our community office! We share our projects with each other, and play games! Enter through the front door, through the noisy lobby and straight ahead to the elevators. Our community office (1011) is on the right side of the elevators.",
        url: "https://triangleinteractivearts.org"
    },
    {
        name: "Weekly Hangout",
        organizer: "Triangle Interactive Arts Collective",
        date: "2025-10-09",
        time: "5:00 PM - 7:00 PM",
        location: "800 Park Offices Drive, Suite 1011",
        description: "Every Thursday we get together for our weekly hangout at our community office! We share our projects with each other, and play games! Enter through the front door, through the noisy lobby and straight ahead to the elevators. Our community office (1011) is on the right side of the elevators.",
        url: "https://triangleinteractivearts.org"
    },
    {
        name: "Weekly Hangout",
        organizer: "Triangle Interactive Arts Collective",
        date: "2025-10-16",
        time: "5:00 PM - 7:00 PM",
        location: "800 Park Offices Drive, Suite 1011",
        description: "Every Thursday we get together for our weekly hangout at our community office! We share our projects with each other, and play games! Enter through the front door, through the noisy lobby and straight ahead to the elevators. Our community office (1011) is on the right side of the elevators.",
        url: "https://triangleinteractivearts.org"
    },
    {
        name: "Raleigh Unreal Engine Meetup",
        organizer: "Raleigh Unreal Engine Meetup",
        date: "2025-10-29",
        time: "7:00 PM - 10:00 PM",
        location: "1006 SW Maynard Rd, Cary, NC 27511",
        description: "Hey all! We will be located at Fortnite Brewing in Cary for our monthly meetup! Feel free to bring any projects you are working on if you're interested in showing something, otherwise no need to bring anything!!",
        url: "https://communities.unrealengine.com/events/details/epic-games-raleigh-presents-raleigh-unreal-engine-meetup-2025-10-29/"
    },
    {
        name: "Raleigh Unreal Engine Meetup",
        organizer: "Raleigh Unreal Engine Meetup",
        date: "2025-11-26",
        time: "7:00 PM - 10:00 PM",
        location: "1006 SW Maynard Rd, Cary, NC 27511",
        description: "Hey all! We will be located at Fortnite Brewing in Cary for our monthly meetup! Feel free to bring any projects you are working on if you're interested in showing something, otherwise no need to bring anything!!",
        url: "https://communities.unrealengine.com/events/details/epic-games-raleigh-presents-raleigh-unreal-engine-meetup-2025-11-26/"
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
