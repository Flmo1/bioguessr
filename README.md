# Bioguessr

My exam project for the Vue + Appwrite course.

Bioguessr is a guessing game about nature. You get a photo of a species and you
have to put a pin on a world map where you think it lives. The closer you are to
the area where it really lives, the more points you get.

**Live site:** https://bioguessr-192d5.web.app
**Repository:** https://github.com/Flmo1/bioguessr

---

## What you can do

**As a visitor**
- Play the **Daily** expedition: 5 species, the same for everybody, new ones every day
- Play **Quick play**: 5 random species, different every time
- See the real area where the species lives after you guess
- See a chart of how everybody did today and where your score is

**As a logged in player**
- Your daily score gets saved and shows up on the chart

**As an editor (the admin part)**
- Search a species on iNaturalist and import it with one click
- Add, edit and delete species from inside the app

---

## What I used

- **Vue 3** with the Composition API
- **Vite**
- **Vue Router** for the pages and the navigation guard
- **Tailwind CSS** for the styling
- **Appwrite** for the database, login and permissions
- **Leaflet** with Esri satellite tiles for the map
- **iNaturalist API** for the species photos and locations
- **Firebase Hosting** for putting it online

---

## The database

I have two tables in Appwrite.

### subjects (one row per species)

| Column | Type | What it is |
|---|---|---|
| name | string | the normal name |
| scientificName | string | the latin name |
| type | string | animal, plant, fungus or place |
| photoUrl | string | the main photo |
| photoUrl2 | string | a second photo (optional) |
| photoCredit | string | who took the photo, iNaturalist asks for this |
| funFact | string | shown after you guess |
| clues | string array | small hints during the round |
| lat, lng | double | the middle of where the species lives |
| radius | integer | how far its area goes, in km |

### games (one row per finished daily game)

| Column | Type | What it is |
|---|---|---|
| userId | string | who played |
| userName | string | shown in the results |
| score | integer | the total score |
| date | string | like 2026-10-30, so I can ask for one day |

I split them into two tables because they are very different things. Species are
shared content that editors look after. Games belong to one player each. They also
need different permissions, so putting them together would not work.

---

## Roles

| Role | What they can do |
|---|---|
| Guest | play, see species, see the chart |
| Player | same, but their daily score is saved |
| Editor | manage the species in the admin page |

### How I stop people doing things they should not

I did not only hide buttons. The rules are set in Appwrite:

- **subjects**: anyone can read. Only users with the `editor` label can create,
  update or delete.
- **games**: anyone can read (the chart needs this) and logged in users can create.
  Row level security is on, and when a game is saved I give update and delete
  permission only to that user, like this:

```js
permissions: [
  Permission.update(Role.user(user.$id)),
  Permission.delete(Role.user(user.$id)),
]
```

So a player can only change their own score, not somebody else's.

The navigation guard on `/admin` only hides the page. If a normal player tried to
write to `subjects` anyway, Appwrite would answer with a 401.

---

## How the files are organised

```
src/
├── components/     small pieces of interface
├── composables/    useAuth.js, the logged in user shared everywhere
├── services/       the only files that talk to the internet
│   ├── appwrite.js
│   ├── authService.js
│   ├── subjectService.js
│   ├── gameService.js
│   └── inaturalistService.js
├── utils/          distance.js, the maths for the score
├── views/          one file per page
└── router/         the routes and the guard
```

The idea is that a component never talks to Appwrite by itself. It asks a service.
That way if I change something about the database I only have to change one file.

---

## How I use the iNaturalist API

The API is only used in the **admin page**, never while you are playing.

1. The editor types a species name and I call the iNaturalist search
2. When they pick one, I get up to 100 real sightings of that species
3. I take the average of all the coordinates to find the middle, and the distance
   to the furthest sighting becomes the radius
4. The editor checks everything and saves it into Appwrite

I did it this way because the game loads much faster when it only reads from
Appwrite, it still works if iNaturalist is down, and a person can check the data
before players see it.

---

## How to run it

```bash
npm install
```

Make a file called `.env` in the main folder (copy `.env.example`):

```
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_SUBJECTS_ID=your-subjects-table-id
VITE_APPWRITE_GAMES_ID=your-games-table-id
```

Then:

```bash
npm run dev
```

To put it online:

```bash
npm run build
firebase deploy
```

---

## Things I know are not perfect

- **A species is a circle, not a real shape.** Real range maps are polygons, but
  there is no free API that gives you those, and the scoring maths is much simpler
  with a middle point and a radius.
- **The daily set uses the clock of the player's computer**, so the day changes at
  a different moment in another country. Doing it on the server would fix that.
- **The score is calculated in the browser**, so somebody could see the answer in
  the network tab. The proper way is an Appwrite Function that does the scoring on
  the server. I decided not to do that, and I explain why in my AI reflection.
- **PvP is not built.** It needs a matches table and Appwrite Realtime. I left the
  card on the page as "coming soon" and used the time on the required parts instead.
- **Giving somebody the editor label is done in the Appwrite console**, because
  that needs a server API key and I did not want a key like that in a frontend app.