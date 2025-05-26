# Neighborly
A web app to help Albertans and visitors find local services, events, and Indigenous-led resources.

## Week 2 Progress

### What’s New:
Fully working service search: City, Category, and Search Term now return filtered results
Walkthrough onboarding using the buffalo mascot now launches correctly
Google Maps integration for “Get Directions”
Working form for submitting new services to MySQL
All service categories standardized (no more subcategories causing bugs)


### Challenges Overcome:
- Resolved major issues with .env environment variables not being read correctly
- Learned how to *globalize env variables* to work across user accounts
- Fixed *safe SQL mode* in MySQL Workbench, which blocked UPDATE queries
Walkthrough onboarding had logic and visibility bugs — now fully operational


### Reflection:
It was a grind getting these things to work together, especially the service search and walkthrough. But it's finally clean, smooth, and running great. Well at lest Calgary is I'll be updating the city's next one is Edmonton. Big win this week.


## Week 3 Update

Completed and verified Red Deer entries (approx. 70 unique listings)

- Added new categories: entertainment and indigenous services
Updated backend validation to accept new categories
Verified all Red Deer entries are unique via MySQL duplicate-checking query

- Inserted services using INSERT IGNORE and enforced UNIQUE(name, address, contact)
App tested locally and running properly

## Week 4 Progress

- Finalized the Lethbridge dataset by filling gaps in the *food assistance* category with new listings such as low-cost restaurants, grocery stores, and community meal providers.
Verified that all categories in Lethbridge now meet or exceed expected coverage.
Red Deer was re-checked for duplicates and category issues; confirmed clean and complete.

- Noted and documented recurring local development environment issue: Node + MySQL crash loop. A reliable restart workaround is in place. Permanent fix with nodemon and MySQL reconnection logic planned.
- All changes committed, pushed to GitHub, and documented in the week4_update.txt for Moodle submission.

### Week 5 Progress

*Cities Completed This Week:*
- Grande Prairie
- High Prairie

*Previously Completed Cities:*
- Lethbridge (first city with all 11 categories)
- Medicine Hat
- Lloydminster
- Red Deer (updated during Week 4)

*Categories Covered:*
- Food Assistance  
- Housing  
- Legal Aid  
- Employment Services  
- Healthcare  
- Education  
- Mental Health  
- Seniors Care  
- Childcare  
- Entertainment (added starting with Lethbridge)  
- Indigenous Services (added starting with Lethbridge)

*Highlights This Week:*
- Full category coverage completed for cities from *Lethbridge though High Prairie*
- Verified entries with strict one-org-per-city rule
- Continued SQL validation with INSERT IGNORE format
- Improved workflow using category-by-category batching
- Prepared to revisit *Calgary*, *Edmonton*, and *Red Deer* to backfill new categories added
     after initial setup

*Next Up:*
- Peace River  
- Fort McMurray  
- Then backfilling newer categories in major cities (e.g., Calgary, Edmonton)

Project Update Summary – Week 6 (Final Week)

This week I completed significant updates and fixes to the Neighborly service directory app:
	•	UI Bug Fixes:
	•	Reversed the order of the “View on Map” and “Visit Website” buttons to ensure 
        correct behavior.
	•	This fix resolved a critical issue where the wrong button was being triggered (e.g.,
         clicking “Visit Website” would open a map instead).
	•	Data Cleanup:
	•	Corrected broken or improperly formatted URLs in the MySQL database.
	•	Ensured all website links include https:// to prevent browser errors.
	•	Cleaned and validated address data to ensure map links direct to accurate locations.
	•	Regional Coverage Expanded:
	•	Finalized and verified services for Edmonton, Red Deer, and Calgary.
	•	Added new communities: Cold Lake and Drumheller.
	•	Fixed and standardized entries from northern areas including Grande Prairie and 
        Slave Lake.
	•	Functionality Enhancements:
	•	Improved the service card rendering in the frontend.
	•	Implemented logic to filter out invalid address/map links.
	•	Improved submission form logic and default fallbacks