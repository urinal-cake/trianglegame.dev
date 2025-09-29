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
        locationType: "Headquarters",
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
    },
    {
        name: "Firaxis",
        locationType: "Remote Staff",
        url: "https://firaxis.com"
    },
    {
        name: "Bungie",
        locationType: "Remote Staff",
        url: "https://www.bungie.net"
    },
    {
        name: "Studio Hermitage",
        locationType: "Headquarters",
        url: "https://studiohermitage.com"
    },
    {
        name: "Zapper Games",
        locationType: "Headquarters",
        url: "https://www.zappergames.com"
    },
    {
        name: "Unknown Worlds",
        locationType: "Remote Staff",
        url: "https://unknownworlds.com"
    },
    {
        name: "Notorious Studios",
        locationType: "Remote Staff",
        url: "https://notoriousstudios.com"
    },
    {
        name: "Cold Iron Studios",
        locationType: "Remote Staff",
        url: "https://www.coldironstudios.com"
    },
    {
        name: "Atomic Arcade",
        locationType: "Headquarters",
        url: "https://atomicarcade.com"
    },
    {
        name: "Funcom",
        locationType: "Office",
        url: "https://www.funcom.com"
    },
    {
        name: "Ubisoft",
        locationType: "Office",
        url: "https://www.ubisoft.com"
    },
    {
        name: "Drastic Games",
        locationType: "Headquarters",
        url: "https://drasticgames.com"
    },
    {
        name: "Imangi Studios",
        locationType: "Headquarters",
        url: "https://imangistudios.com"
    },
    {
        name: "Infuse Studio",
        locationType: "Headquarters",
        url: "https://infusestudio.com"
    },
    {
        name: "Limited Run Games",
        locationType: "Headquarters",
        url: "https://limitedrungames.com"
    },
    {
        name: "Methodical Games",
        locationType: "Headquarters",
        url: "https://methodicalgames.com"
    },
    {
        name: "Squanch Games",
        locationType: "Office",
        url: "https://squanchgames.com"
    },
    {
        name: "Villain Games",
        locationType: "Headquarters",
        url: "https://villaingames.com"
    },
    {
        name: "Katsu Entertainment",
        locationType: "Headquarters",
        url: "https://katsuent.com"
    },
    {
        name: "Meta",
        locationType: "Remote Staff",
        url: "https://about.meta.com"
    },
    {
        name: "Stoic",
        locationType: "Remote Staff",
        url: "https://stoicstudio.com"
    },
    {
        name: "OtherSide Entertainment",
        locationType: "Remote Staff",
        url: "https://otherside-e.com"
    },
    {
        name: "inXile Entertainment",
        locationType: "Remote Staff",
        url: "https://www.inxile-entertainment.com"
    },
    {
        name: "Lost Boys Interactive",
        locationType: "Remote Staff",
        url: "https://www.lostboys.com"
    },
    {
        name: "That's No Moon",
        locationType: "Remote Staff",
        url: "https://thatsno.moon"
    },
    {
        name: "Teravision Games",
        locationType: "Remote Staff",
        url: "https://www.teravisiongames.com"
    },
    {
        name: "Microsoft",
        locationType: "Remote Staff",
        url: "https://www.microsoft.com"
    },
    {
        name: "High Voltage",
        locationType: "Remote Staff",
        url: "https://www.hvs.com"
    },
    {
        name: "Happy Manic",
        locationType: "Headquarters",
        url: "https://happymanic.com"
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
    },
    {
        name: "IGDA NC-Triangle",
        description: "The NC-Triangle Chapter of the International Game Developers Association serves game developers in Raleigh, Durham, and Chapel Hill through networking, professional development, and advocacy.",
        location: "Triangle Area",
        type: "Professional Chapter",
        url: "https://nc-triangle.igda.org",
        logo: "images/groups/IGDA-NC.png"
    },
    {
        name: "GameDevDrinkUp Raleigh",
        description: "A monthly DrinkUp for Game Developers bringing together industry professionals over tasty libations. No more waiting for GDC, E3 and PAX - we create regular opportunities for authentic industry discussions and networking.",
        location: "Raleigh",
        type: "Monthly Meetup",
        url: "https://discord.gg/FWkscbmV",
        logo: "images/groups/GDDU.png"
    }
];

// Schools and university programs - will be randomized
const schoolsData = [
    {
        name: "Simulation and Game Development",
        school: "Wake Technical Community College",
        description: "Associate in Applied Science degree providing broad background in simulation and video game industry. Includes practical training in 3D modeling, animation, design, programming, and project management using industry-standard software.",
        location: "Wake Technical Community College",
        type: "Community College Program",
        url: "https://www.waketech.edu/programs-courses/credit/simulation-and-game-development"
    },
    {
        name: "Computer Science - Game Development Concentration",
        school: "North Carolina State University",
        description: "Bachelor's degree concentration combining core Computer Science education with specialized game development coursework including Computer Graphics, Game Design and Development, and Advanced Game Projects.",
        location: "NC State University",
        type: "University Program",
        url: "https://csc.ncsu.edu/academic-program/bachelor-of-science-in-computer-science-game-development-concentration/"
    }
];

// Generate randomized/sorted data for page load
const events = sortEventsByDate(eventsData);
const companies = shuffleArray(companiesData);
const groups = shuffleArray(groupsData);
const schools = shuffleArray(schoolsData);
