# סיכום מבנה הקליינט

## מבנה תיקיות
```
src/
├── components/
├── styles/
├── style/
├── types/
└── main files
```

## קבצי קונפיגורציה

| קובץ | תיאור |
|------|-------|
| `tsconfig.json` | הגדרות TypeScript ראשיות - מפנה לקבצים נפרדים |
| `tsconfig.app.json` | הגדרות TypeScript לאפליקציה (src/) |
| `tsconfig.node.json` | הגדרות TypeScript ל-Vite config |
| `vite.config.ts` | קונפיגורציית Vite עם פלאגין React |
| `eslint.config.js` | הגדרות ESLint עם TypeScript ו-React |
| `package.json` | תלויות ופקודות פרויקט |
| `.gitignore` | קבצים שלא נכללים בגיט |

## קבצי קוד ראשיים

| קובץ | רכיב/פונקציה | תיאור |
|------|---------------|--------|
| `src/main.tsx` | Entry point | הגדרת routes ו-rendering ראשי |
| `src/App.tsx` | App | מציג את רכיב Login |
| `index.html` | HTML template | קובץ HTML בסיסי עם title "Intelligence Attack" |

## רכיבים (Components)

| קובץ | רכיב | פונקציות | תיאור |
|------|------|----------|---------|
| `src/components/login.tsx` | Login | `onsubmit()` | מסך כניסה - בודק username/password מול השרת |
| `src/components/home-page.tsx` | HomePage | - | עמוד ראשי עם Header, MapView, Footer |
| `src/components/header.tsx` | Header | - | 3 כפתורים: Camera, soldier locations, Intelligence by waypoints |
| `src/components/footer.tsx` | Footer | - | קישור logout עם Link |
| `src/components/MapView.tsx` | MapView | `useEffect()`, `setView()` | מפת Leaflet אינטראקטיבית עם markers וחוגים |
| `src/components/LocationClick.tsx` | LocationClick | `useMapEvents()` | מאזין ללחיצות על מפה ושולח מיקום לשרת |

## טיפוסים (Types)

| קובץ | טיפוס | שדות |
|------|-------|------|
| `src/types/location.ts` | location | id, description, type, lat, len |

## קבצי עיצוב (CSS)

| קובץ | מטרה |
|------|-------|
| `src/index.css` | איפוס margin/padding גלובלי |
| `src/App.css` | עיצוב root container - flex column center |
| `src/style/login.css` | עיצוב מסך הכניסה - main, section, inputs, buttons |
| `src/style/homePage.css` | עיצוב header (aqua) ו-footer (blanchedalmond) |
| `src/styles/MapView.css` | עיצוב מפה - גובה 90vh, כפתור setView |

## Routes

| נתיב | רכיב |
|------|------|
| `/` | App (Login) |
| `/homepage` | HomePage |

## API Calls

| רכיב | Method | Endpoint | מטרה |
|------|--------|----------|-------|
| Login | POST | `/users/checkUser` | אימות משתמש |
| MapView | GET | `/locations` | שליפת מיקומים |
| LocationClick | GET | `/locations/{lat}/{lng}` | שמירת מיקום |

## תלויות עיקריות

| חבילה | מטרה |
|--------|-------|
| react | ממשק משתמש |
| react-router | ניווט |
| leaflet + react-leaflet | מפות |
| typescript | Type safety |
| vite | Build tool |