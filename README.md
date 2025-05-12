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