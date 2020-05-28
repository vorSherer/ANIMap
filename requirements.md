The vision of this product is for a user to be able to use this application to enter the title of an anime tv series or movie, get back a sampling of matching results, and then be able to build a collection of those results in a local database for later retrieval. The collection will be viewable on a separate page, and items on that page may be selected for individual detailed view. This view will include options to add comments, personal ranking and a category title to be added to the local database, or the item may be deleted from the database.

The product is aimed at anime fans who wish to collect information about their favorite shows on their local device and manage that data themselves.

If you are an anime fan, or curious about anime, this is a great tool to explore the genre. Otherwise, it won't likely be of interest to you.

## SCOPE (IN)
The web app provides the user with access to imagery and information about the anime titles they select.
The web app permits local storage of the information the user selects, including an image of each item.
Users will be able to add their personal ranking of each item, as well as a category to classify it and any comments they wish to store.
Users will also be able to delete content they no longer wish to retain.

## (OUT)
The web app will not post information to the source API. It also may allow users to select content banned on app stores, though it was designed to be used within the relevant constraints of app stores.

## MVP
The MVP app will permit the user to search for anime by title, return results from which the user can select an item, display more detailed information about that item, and permit the user to save that information in the local database. The user may then add comments to that item that are also saved to the database. There is a page included that displays a list of items saved in the database, so the user can see all that they have collected. The app also includes the capability to delete content from the database.

## STRETCH GOALS:
 - Expand Mobile/Desktop RWD to include Tablet view
 - Home page - user sign-in (all else hidden until sign-in)
 - User link to view saved collection in rank order
 - User may filter by (genre - API criteria) to display resulting list
 - User password check/validation to login to the app
 - (Database: User table, Anime table, Rank and comments table)
 - Search in more than one API
 - Option to link to external URL to view an anime
 - In search page, automatically display a list of (alternate search) options. 
 - In search page, be able to continue viewing paginated results.

## FUNCTIONAL REQUIREMENTS
A user can select anime titles to search.
A user can update their saved content with personal comments.

## DATA FLOW
The user launches the app and is greeted with Welcome text that describes the purpose of the app and directs them to search or view their collection.
Following the Search route, the user may enter and submit an anime title of their choosing.
The title submitted is added to a search query sent to an external API using superagent and express.
Corresponding data is returned from the API, run through a Constructor, and rendered to the Search Results page for display to the user. 
The user may select an item displayed on the page.  The hidden data for that item are passed to and rendered on the View Details page.
The View Details page permits the user to add the data to the local postgres database using the INSERT INTO SQL command. The data is then queried back from the database and rendered on the Edit Detail page, where the user may either add commentary via an EDIT button, or delete the content via a DELETE button.
The EDIT button reveals the hidden item data in editable fields. The user may make changes to these fields, then save the changes to the database via a POST/PUT command via method-override. The changes are INSERTed INTO the database, then select fields from the entire collection is queried back out and rendered to the "My Favorites" page.
Each item on this page is rendered with a "View Details" button that, when clicked, passes that item's information to be rendered again to the Edit Detail page, where it may again be edited, or selected for deletion.  Deleted items are DELETEd from the database and the user is returned to the "My Favorites" page.

## NON-FUNCTIONAL REQUIREMENTS
__USABILITY__ - The user need only enter a valid title to get valid results. Entering an invalid value results in a 400-class error. Once data is recieved, the actual render time to page is less than one second.
__SCALABILITY__ - The app was designed as a single-user application, so it is scaled to a workload of one.
