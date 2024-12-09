@echo off
echo Creating directories...

REM Create main directories
mkdir css
mkdir css\components
mkdir js
mkdir js\components
mkdir components
mkdir assets
mkdir assets\images
mkdir assets\fonts
mkdir assets\icons

echo Creating HTML files...

REM Home Page
type nul > index.html

REM User Authentication
type nul > signup.html
type nul > login.html

REM Dashboard
type nul > dashboard.html

REM Energy Tracking
type nul > track-energy.html
type nul > components\energy-details.html

REM Comparison and Analytics
type nul > compare.html
type nul > recommendations.html

REM Goals and Campaigns
type nul > set-goals.html
type nul > campaigns.html

REM User Profile and Settings
type nul > profile.html
type nul > settings.html

REM Public Data Visualization
type nul > public-data.html

REM Help and Support
type nul > faq.html
type nul > contact.html

REM Error Pages
type nul > 404.html
type nul > 500.html

REM Additional Features
type nul > device-integration.html
type nul > privacy-policy.html
type nul > terms-and-conditions.html

echo Creating CSS files...

REM Home Page CSS
type nul > css\index.css

REM User Authentication CSS
type nul > css\signup.css
type nul > css\login.css

REM Dashboard CSS
type nul > css\dashboard.css

REM Energy Tracking CSS
type nul > css\track-energy.css
type nul > css\components\energy-details.css

REM Comparison and Analytics CSS
type nul > css\compare.css
type nul > css\recommendations.css

REM Goals and Campaigns CSS
type nul > css\set-goals.css
type nul > css\campaigns.css

REM User Profile and Settings CSS
type nul > css\profile.css
type nul > css\settings.css

REM Public Data Visualization CSS
type nul > css\public-data.css

REM Help and Support CSS
type nul > css\faq.css
type nul > css\contact.css

REM Error Pages CSS
type nul > css\404.css
type nul > css\500.css

REM Additional Features CSS
type nul > css\device-integration.css
type nul > css\privacy-policy.css
type nul > css\terms-and-conditions.css

REM Global CSS
type nul > css\global.css

REM Shared Components CSS
type nul > css\components\header.css
type nul > css\components\footer.css
type nul > css\components\nav-menu.css

echo Creating JS files...

REM Home Page JS
type nul > js\index.js

REM User Authentication JS
type nul > js\signup.js
type nul > js\login.js

REM Dashboard JS
type nul > js\dashboard.js

REM Energy Tracking JS
type nul > js\track-energy.js
type nul > js\components\energy-details.js

REM Comparison and Analytics JS
type nul > js\compare.js
type nul > js\recommendations.js

REM Goals and Campaigns JS
type nul > js\set-goals.js
type nul > js\campaigns.js

REM User Profile and Settings JS
type nul > js\profile.js
type nul > js\settings.js

REM Public Data Visualization JS
type nul > js\public-data.js

REM Help and Support JS
type nul > js\faq.js
type nul > js\contact.js

REM Error Pages JS
type nul > js\404.js
type nul > js\500.js

REM Additional Features JS
type nul > js\device-integration.js
type nul > js\privacy-policy.js
type nul > js\terms-and-conditions.js

REM Global JS
type nul > js\global.js

REM Shared Components JS
type nul > js\components\header.js
type nul > js\components\footer.js
type nul > js\components\nav-menu.js

echo Project setup is complete!
pause
